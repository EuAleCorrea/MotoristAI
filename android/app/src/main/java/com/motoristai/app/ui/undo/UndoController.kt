package com.motoristai.app.ui.undo

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/**
 * Controlador da ação Desfazer.
 *
 * Garantias:
 *  1. Janela exata de [windowMillis] (5.000 ms). O callback de confirmação só ocorre depois dela.
 *  2. Cada ação é confirmada **uma única vez** (`consumed` é marcado antes de invocar o callback).
 *  3. `undo(id)` só atua sobre a ação pendente com o mesmo id; ids antigos são ignorados,
 *     impedindo confirmar ou reverter a ação errada.
 *  4. Encerrar a tela (dispose) confirma imediatamente a ação pendente — nunca perde dados
 *     nem deixa estado inconsistente.
 *  5. Falha na confirmação é reportada em `onFailed`, sem marcar a ação como concluída
 *     silenciosamente.
 */
class UndoController(
    private val scope: CoroutineScope,
    val windowMillis: Long = DEFAULT_WINDOW_MILLIS
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
        @Volatile
        var consumed: Boolean = false

        var job: Job? = null
    }

    private val lock = Any()
    private var pending: Pending? = null

    /** Id da ação que ainda pode ser desfeita, ou null. */
    val pendingId: String?
        get() = synchronized(lock) { pending?.takeIf { !it.consumed }?.id }

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
            if (current != null && !current.consumed) {
                if (current.id == id) return false
                current.consumed = true
                current.job?.cancel()
                superseded = current
            }
            Pending(id, onConfirm, onUndone, onFailed).also { pending = it }
        }

        // A ação anterior é confirmada (nunca descartada) para não perder o registro.
        val previous = superseded
        if (previous != null) {
            scope.launch { previous.onConfirm() }
        }

        active.job = scope.launch {
            delay(windowMillis)
            commit(active)
        }
        return true
    }

    /** Desfaz a ação pendente, se o id corresponder. */
    fun undo(id: String): Boolean {
        val active = synchronized(lock) {
            val current = pending
            if (current == null || current.id != id || current.consumed) return false
            current.consumed = true
            pending = null
            current
        }
        active.job?.cancel()
        scope.launch { active.onUndone() }
        return true
    }

    /**
     * Confirma imediatamente a ação pendente (dispose / troca de tela / cancelamento).
     * Idempotente: chamadas repetidas não disparam o callback de novo.
     */
    fun confirmAndClear() {
        val active = synchronized(lock) {
            val current = pending ?: return
            pending = null
            if (current.consumed) return
            current.consumed = true
            current
        }
        active.job?.cancel()
        scope.launch { commit(active, alreadyConsumed = true) }
    }

    private suspend fun commit(action: Pending, alreadyConsumed: Boolean = false) {
        if (!alreadyConsumed) {
            synchronized(lock) {
                if (action.consumed) return
                action.consumed = true
            }
        }
        try {
            val ok = action.onConfirm()
            if (!ok) action.onFailed(IllegalStateException("Falha ao confirmar a ação ${action.id}"))
        } catch (t: Throwable) {
            action.onFailed(t)
        }
    }
}
