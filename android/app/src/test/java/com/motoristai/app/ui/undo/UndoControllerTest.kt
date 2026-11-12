package com.motoristai.app.ui.undo

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.advanceTimeBy
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.runCurrent
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class UndoControllerTest {

    // ─────────────────────────────────────────────────────────────────────────
    // Janela de 5 s
    // ─────────────────────────────────────────────────────────────────────────

    @Test
    fun `confirm is not called before the 5000ms window`() = runTest {
        var confirmed = 0
        val controller = UndoController(this, commitScope = this)

        controller.arm(id = "a1", onConfirm = { confirmed++; true }, onUndone = {})

        advanceTimeBy(4_999)
        runCurrent()
        assertEquals(0, confirmed)
        assertEquals("a1", controller.pendingId)

        advanceTimeBy(1)
        advanceUntilIdle()
        assertEquals(1, confirmed)
        assertNull(controller.pendingId)
    }

    @Test
    fun `confirm fires exactly once after the window`() = runTest {
        var confirmed = 0
        val controller = UndoController(this, commitScope = this)

        controller.arm(id = "a2", onConfirm = { confirmed++; true }, onUndone = {})

        advanceTimeBy(10_000)
        advanceUntilIdle()
        assertEquals(1, confirmed)

        // Chamadas repetidas de dispose não podem duplicar a confirmação.
        controller.confirmAndClear()
        controller.confirmAndClear()
        advanceUntilIdle()
        assertEquals(1, confirmed)
    }

    @Test
    fun `window duration is exactly 5000ms`() {
        assertEquals(5_000L, UndoController.DEFAULT_WINDOW_MILLIS)
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Desfazer
    // ─────────────────────────────────────────────────────────────────────────

    @Test
    fun `undo before the window cancels the confirmation`() = runTest {
        var confirmed = 0
        var undone = 0
        val controller = UndoController(this, commitScope = this)

        controller.arm(id = "a3", onConfirm = { confirmed++; true }, onUndone = { undone++ })

        advanceTimeBy(1_000)
        assertTrue(controller.undo("a3"))
        advanceUntilIdle()

        advanceTimeBy(10_000)
        advanceUntilIdle()

        assertEquals(0, confirmed)
        assertEquals(1, undone)
        assertNull(controller.pendingId)
    }

    @Test
    fun `undo with a stale id is ignored`() = runTest {
        var confirmed = 0
        var undone = 0
        val controller = UndoController(this, commitScope = this)

        controller.arm(id = "current", onConfirm = { confirmed++; true }, onUndone = { undone++ })
        advanceTimeBy(500)

        assertFalse(controller.undo("stale"))
        assertEquals(0, undone)
        assertEquals("current", controller.pendingId)

        advanceTimeBy(5_000)
        advanceUntilIdle()
        assertEquals(1, confirmed)
    }

    @Test
    fun `undo after the window is a no-op`() = runTest {
        var confirmed = 0
        var undone = 0
        val controller = UndoController(this, commitScope = this)

        controller.arm(id = "a4", onConfirm = { confirmed++; true }, onUndone = { undone++ })
        advanceTimeBy(5_000)
        advanceUntilIdle()

        assertFalse(controller.undo("a4"))
        assertEquals(1, confirmed)
        assertEquals(0, undone)
    }

    @Test
    fun `arming the same id twice does not duplicate the action`() = runTest {
        var confirmed = 0
        val controller = UndoController(this, commitScope = this)

        assertTrue(controller.arm(id = "dup", onConfirm = { confirmed++; true }, onUndone = {}))
        assertFalse(controller.arm(id = "dup", onConfirm = { confirmed++; true }, onUndone = {}))

        advanceTimeBy(5_000)
        advanceUntilIdle()
        assertEquals(1, confirmed)
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Substituição de ação pendente (ponto 1 da entrega)
    // ─────────────────────────────────────────────────────────────────────────

    @Test
    fun `a new action supersedes the previous one by confirming it`() = runTest {
        var firstConfirmed = 0
        var secondConfirmed = 0
        val controller = UndoController(this, commitScope = this)

        controller.arm(id = "first", onConfirm = { firstConfirmed++; true }, onUndone = {})
        advanceTimeBy(1_000)

        controller.arm(id = "second", onConfirm = { secondConfirmed++; true }, onUndone = {})
        runCurrent()

        assertEquals(1, firstConfirmed)
        assertEquals(0, secondConfirmed)
        assertEquals("second", controller.pendingId)

        advanceTimeBy(5_000)
        advanceUntilIdle()
        assertEquals(1, secondConfirmed)
    }

    @Test
    fun `supersede reports a failed confirmation instead of swallowing it`() = runTest {
        val failures = mutableListOf<Throwable>()
        val controller = UndoController(this, commitScope = this)

        controller.arm(
            id = "first",
            onConfirm = { false },
            onUndone = {},
            onFailed = { failures += it }
        )
        advanceTimeBy(500)

        controller.arm(id = "second", onConfirm = { true }, onUndone = {})
        advanceUntilIdle()

        assertEquals("deve reportar falha da ação substituída", 1, failures.size)
        assertTrue(failures.first().message!!.contains("first"))
    }

    @Test
    fun `supersede reports an exception thrown by the previous confirmation`() = runTest {
        val failures = mutableListOf<Throwable>()
        val controller = UndoController(this, commitScope = this)

        controller.arm(
            id = "boom",
            onConfirm = { throw IllegalStateException("falha simulada") },
            onUndone = {},
            onFailed = { failures += it }
        )
        advanceTimeBy(500)

        controller.arm(id = "next", onConfirm = { true }, onUndone = {})
        advanceUntilIdle()

        assertEquals(1, failures.size)
        assertEquals("falha simulada", failures.first().message)
    }

    @Test
    fun `supersede never confirms the same action twice`() = runTest {
        var firstConfirmed = 0
        val controller = UndoController(this, commitScope = this)

        controller.arm(id = "first", onConfirm = { firstConfirmed++; true }, onUndone = {})
        advanceTimeBy(100)

        // Duas substituições em sequência: a primeira ação sai do fluxo na primeira.
        controller.arm(id = "second", onConfirm = { true }, onUndone = {})
        controller.arm(id = "third", onConfirm = { true }, onUndone = {})
        advanceUntilIdle()

        assertEquals(1, firstConfirmed)
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Dispose, cancelamento de escopo e concorrência (pontos 2 e 3)
    // ─────────────────────────────────────────────────────────────────────────

    @Test
    fun `dispose confirms the pending action immediately and only once`() = runTest {
        var confirmed = 0
        val controller = UndoController(this, commitScope = this)

        controller.arm(id = "a5", onConfirm = { confirmed++; true }, onUndone = {})
        advanceTimeBy(2_000)

        controller.confirmAndClear()
        advanceUntilIdle()
        assertEquals(1, confirmed)

        controller.confirmAndClear()
        advanceTimeBy(10_000)
        advanceUntilIdle()
        assertEquals(1, confirmed)
    }

    @Test
    fun `confirmation survives cancellation of the UI coroutine scope`() = runTest {
        var confirmed = 0
        val uiJob = SupervisorJob()
        val uiScope = CoroutineScope(uiJob + StandardTestDispatcher(testScheduler))

        val controller = UndoController(uiScope, commitScope = this)
        controller.arm(id = "a8", onConfirm = { confirmed++; true }, onUndone = {})

        advanceTimeBy(1_000)
        assertEquals(0, confirmed)

        // Tela destruída: o escopo da UI é cancelado sem ninguém chamar confirmAndClear().
        uiJob.cancel()
        advanceUntilIdle()

        assertEquals("a confirmação não pode ser perdida", 1, confirmed)
    }

    @Test
    fun `confirmation is not lost when the scope is cancelled after the window`() = runTest {
        var confirmed = 0
        val uiJob = SupervisorJob()
        val uiScope = CoroutineScope(uiJob + StandardTestDispatcher(testScheduler))
        val controller = UndoController(uiScope, commitScope = this)

        controller.arm(id = "a9", onConfirm = { confirmed++; true }, onUndone = {})

        advanceTimeBy(5_000)
        advanceUntilIdle()
        assertEquals(1, confirmed)

        uiJob.cancel()
        advanceUntilIdle()
        assertEquals(1, confirmed)
    }

    @Test
    fun `rapid succession of actions confirms every superseded one exactly once`() = runTest {
        val confirmedIds = mutableListOf<String>()
        val controller = UndoController(this, commitScope = this)

        repeat(50) { index ->
            controller.arm(
                id = "action-$index",
                onConfirm = { confirmedIds += "action-$index"; true },
                onUndone = {}
            )
            advanceTimeBy(10)
        }
        runCurrent()

        // As 49 primeiras foram substituídas e confirmadas; a última segue pendente.
        assertEquals(49, confirmedIds.size)
        assertEquals(49, confirmedIds.distinct().size)
        assertEquals("action-49", controller.pendingId)

        advanceTimeBy(5_000)
        advanceUntilIdle()
        assertEquals(50, confirmedIds.size)
        assertEquals(50, confirmedIds.distinct().size)
        assertNull(controller.pendingId)
    }

    @Test
    fun `undo and dispose racing settle the action a single time`() = runTest {
        var confirmed = 0
        var undone = 0
        val controller = UndoController(this, commitScope = this)

        controller.arm(id = "race", onConfirm = { confirmed++; true }, onUndone = { undone++ })

        val undoneResult = controller.undo("race")
        controller.confirmAndClear()
        advanceUntilIdle()

        assertTrue(undoneResult)
        assertEquals(0, confirmed)
        assertEquals(1, undone)
    }

    @Test
    fun `scope cancellation after undo does not confirm`() = runTest {
        var confirmed = 0
        var undone = 0
        val uiJob = SupervisorJob()
        val uiScope = CoroutineScope(uiJob + StandardTestDispatcher(testScheduler))
        val controller = UndoController(uiScope, commitScope = this)

        controller.arm(id = "a10", onConfirm = { confirmed++; true }, onUndone = { undone++ })
        assertTrue(controller.undo("a10"))
        advanceUntilIdle()

        uiJob.cancel()
        advanceUntilIdle()

        assertEquals(0, confirmed)
        assertEquals(1, undone)
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Falhas
    // ─────────────────────────────────────────────────────────────────────────

    @Test
    fun `failure to confirm is reported and not swallowed`() = runTest {
        var failures = 0
        val controller = UndoController(this, commitScope = this)

        controller.arm(id = "a6", onConfirm = { false }, onUndone = {}, onFailed = { failures++ })

        advanceTimeBy(5_000)
        advanceUntilIdle()
        assertEquals(1, failures)
    }

    @Test
    fun `an exception during confirmation is reported`() = runTest {
        var failures = 0
        val controller = UndoController(this, commitScope = this)

        controller.arm(
            id = "a7",
            onConfirm = { throw IllegalStateException("boom") },
            onUndone = {},
            onFailed = { failures++ }
        )

        advanceTimeBy(5_000)
        advanceUntilIdle()
        assertEquals(1, failures)
    }
}
