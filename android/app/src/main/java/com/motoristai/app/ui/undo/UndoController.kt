package com.motoristai.app.ui.undo

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.NonCancellable
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * Controlador da ação Desfazer.
 *
 * Garantias:
 *  1. Janela exata de [windowMillis] (5.000 ms). A confirmação só ocorre depois dela.
 *  2. Todo caminho de confirmação — timeout, substituição, dispose e cancelamento do escopo —
 *     passa pelo mesmo `commit()`, que trata retorno `false` e exceções via `onFailed`.
 *  3. Cada ação é confirmada **uma única vez**: a reivindicação de confirmação é atômica
 *     (`confirmed`), independente de quem disparou.
 *  4. A confirmação **não é perdida** quando a tela é destruída ou o escopo de UI é cancelado:
 *     o temporizador roda no escopo de UI, mas a confirmação roda em [commitScope]
 *     (independente) e dentro de `NonCancellable`.
 *  5. `undo(id)` só age sobre a ação pendente com o mesmo id; ids obsoletos são ignorados.
 *
 * @param scope escopo da UI — controla apenas a contagem da janela de 5 s.
 * @param windowMillis duração da janela.
 * @param commitScope escopo independente onde as confirmações são executadas.
 *        Precisa sobreviver ao [scope] para que o dispose não perca a confirmação.
 */
class UndoController(
    private val scope: CoroutineScope,
    val windowMillis: Long = DEFAULT_WINDOW_MILLIS,
    private val commitScope: CoroutineScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
) {

    companion object {
        const val DEFAULT_WINDOW_MILLIS = 5_000L
    }

    private class Pending(
        val id: String,
        val onConfirm: suspend () -> Boolean,
        val onUndone: suspend () -> Unit,
        val onFailed: (Throwable) -> Unit
    ) {
        /** Janela encerrada: não é mais possível desfazer. */
        @Volatile
        var settled: Boolean = false

        /** Reivindicação de confirmação. Garante disparo único. */
        @Volatile
        var confirmed: Boolean = false

        var job: Job? = null
    }

    private val lock = Any()
    private var pending: Pending? = null

    init {
        // Rede de segurança: se o escopo de UI for cancelado sem que o dono chame
        // confirmAndClear(), a ação pendente ainda é confirmada.
        scope.coroutineContext[Job]?.invokeOnCompletion {
            confirmAndClear()
        }
    }

    /** Id da ação que ainda pode ser desfeita, ou null. */
    val pendingId: String?
        get() = synchronized(lock) { pending?.takeIf { !it.settled }?.id }

    /**
     * Arma uma nova ação desfazível.
     * @return false se já existe ação pendente com o mesmo id (evita duplicidade de disparo).
     */
    fun arm(
        id: String,
        onConfirm: suspend () -> Boolean,
        onUndone: suspend () -> Unit,
        onFailed: (Throwable) -> Unit = {}
    ): Boolean {
        var superseded: Pending? = null

        val active = synchronized(lock) {
            val current = pending
            if (current != null && !current.settled) {
                if (current.id == id) return false
                // Fecha a janela da ação anterior e agenda a confirmação dela
                // pelo mesmo fluxo seguro das demais confirmações.
                current.settled = true
                superseded = current
            }
            Pending(id, onConfirm, onUndone, onFailed).also { pending = it }
        }

        superseded?.let { previous ->
            previous.job?.cancel()
            launchCommit(previous)
        }

        active.job = scope.launch {
            delay(windowMillis)
            launchCommit(active)
        }
        return true
    }

    /** Desfaz a ação pendente, se o id corresponder. */
    fun undo(id: String): Boolean {
        val active = synchronized(lock) {
            val current = pending
            if (current == null || current.id != id || current.settled || current.confirmed) return false
            current.settled = true
            pending = null
            current
        }
        active.job?.cancel()
        commitScope.launch {
            withContext(NonCancellable) { active.onUndone() }
        }
        return true
    }

    /**
     * Confirma imediatamente a ação pendente (dispose / troca de tela / cancelamento do escopo).
     * Idempotente: chamadas repetidas não disparam o callback de novo.
     */
    fun confirmAndClear() {
        val active = synchronized(lock) {
            val current = pending ?: return
            pending = null
            current.settled = true
            if (current.confirmed) return
            current
        }
        active.job?.cancel()
        launchCommit(active)
    }

    /**
     * Todo caminho de confirmação passa por aqui: executa em [commitScope] e dentro de
     * `NonCancellable`, para que o cancelamento da UI não interrompa a confirmação.
     */
    private fun launchCommit(action: Pending) {
        commitScope.launch {
            commit(action)
        }
    }

    private suspend fun commit(action: Pending) {
        if (!beginConfirm(action)) return

        try {
            val ok = withContext(NonCancellable) { action.onConfirm() }
            if (!ok) {
                action.onFailed(IllegalStateException("Falha ao confirmar a ação ${action.id}"))
            }
        } catch (t: Throwable) {
            action.onFailed(t)
        }
    }

    /**
     * Reivindica a confirmação de forma atômica.
     * @return false se já houve confirmação para esta ação.
     */
    private fun beginConfirm(action: Pending): Boolean = synchronized(lock) {
        if (action.confirmed) return false
        action.confirmed = true
        action.settled = true
        if (pending === action) pending = null
        true
    }
}
