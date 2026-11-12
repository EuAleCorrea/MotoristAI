package com.motoristai.app.ui.undo

import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.advanceTimeBy
import kotlinx.coroutines.test.runCurrent
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class UndoControllerTest {

    @Test
    fun `confirm is not called before the 5000ms window`() = runTest {
        var confirmed = 0
        val controller = UndoController(this)

        controller.arm(
            id = "a1",
            onConfirm = { confirmed++; true },
            onUndone = {}
        )

        advanceTimeBy(4_999)
        runCurrent()
        assertEquals(0, confirmed)
        assertEquals("a1", controller.pendingId)

        advanceTimeBy(1)
        runCurrent()
        assertEquals(1, confirmed)
        assertNull(controller.pendingId)
    }

    @Test
    fun `confirm fires exactly once after the window`() = runTest {
        var confirmed = 0
        val controller = UndoController(this)

        controller.arm(id = "a2", onConfirm = { confirmed++; true }, onUndone = {})

        advanceTimeBy(10_000)
        runCurrent()
        assertEquals(1, confirmed)

        controller.confirmAndClear()
        runCurrent()
        assertEquals(1, confirmed)
    }

    @Test
    fun `undo before the window cancels the confirmation`() = runTest {
        var confirmed = 0
        var undone = 0
        val controller = UndoController(this)

        controller.arm(id = "a3", onConfirm = { confirmed++; true }, onUndone = { undone++ })

        advanceTimeBy(1_000)
        assertTrue(controller.undo("a3"))

        advanceTimeBy(10_000)
        runCurrent()

        assertEquals(0, confirmed)
        assertEquals(1, undone)
        assertNull(controller.pendingId)
    }

    @Test
    fun `undo with a stale id is ignored`() = runTest {
        var confirmed = 0
        var undone = 0
        val controller = UndoController(this)

        controller.arm(id = "current", onConfirm = { confirmed++; true }, onUndone = { undone++ })
        advanceTimeBy(500)

        assertFalse(controller.undo("stale"))
        assertEquals(0, undone)
        assertEquals("current", controller.pendingId)

        advanceTimeBy(5_000)
        runCurrent()
        assertEquals(1, confirmed)
    }

    @Test
    fun `undo after the window is a no-op`() = runTest {
        var confirmed = 0
        var undone = 0
        val controller = UndoController(this)

        controller.arm(id = "a4", onConfirm = { confirmed++; true }, onUndone = { undone++ })
        advanceTimeBy(5_000)
        runCurrent()

        assertFalse(controller.undo("a4"))
        assertEquals(1, confirmed)
        assertEquals(0, undone)
    }

    @Test
    fun `arming the same id twice does not duplicate the action`() = runTest {
        var confirmed = 0
        val controller = UndoController(this)

        assertTrue(controller.arm(id = "dup", onConfirm = { confirmed++; true }, onUndone = {}))
        assertFalse(controller.arm(id = "dup", onConfirm = { confirmed++; true }, onUndone = {}))

        advanceTimeBy(5_000)
        runCurrent()
        assertEquals(1, confirmed)
    }

    @Test
    fun `a new action supersedes the previous one by confirming it`() = runTest {
        var firstConfirmed = 0
        var secondConfirmed = 0
        val controller = UndoController(this)

        controller.arm(id = "first", onConfirm = { firstConfirmed++; true }, onUndone = {})
        advanceTimeBy(1_000)

        controller.arm(id = "second", onConfirm = { secondConfirmed++; true }, onUndone = {})
        runCurrent()

        assertEquals(1, firstConfirmed)
        assertEquals(0, secondConfirmed)
        assertEquals("second", controller.pendingId)

        advanceTimeBy(5_000)
        runCurrent()
        assertEquals(1, secondConfirmed)
    }

    @Test
    fun `dispose confirms the pending action immediately and only once`() = runTest {
        var confirmed = 0
        val controller = UndoController(this)

        controller.arm(id = "a5", onConfirm = { confirmed++; true }, onUndone = {})
        advanceTimeBy(2_000)

        controller.confirmAndClear()
        runCurrent()
        assertEquals(1, confirmed)

        controller.confirmAndClear()
        advanceTimeBy(10_000)
        runCurrent()
        assertEquals(1, confirmed)
    }

    @Test
    fun `failure to confirm is reported and not swallowed`() = runTest {
        var failures = 0
        val controller = UndoController(this)

        controller.arm(
            id = "a6",
            onConfirm = { false },
            onUndone = {},
            onFailed = { failures++ }
        )

        advanceTimeBy(5_000)
        runCurrent()
        assertEquals(1, failures)
    }

    @Test
    fun `an exception during confirmation is reported`() = runTest {
        var failures = 0
        val controller = UndoController(this)

        controller.arm(
            id = "a7",
            onConfirm = { throw IllegalStateException("boom") },
            onUndone = {},
            onFailed = { failures++ }
        )

        advanceTimeBy(5_000)
        runCurrent()
        assertEquals(1, failures)
    }

    @Test
    fun `window duration is exactly 5000ms`() {
        assertEquals(5_000L, UndoController.DEFAULT_WINDOW_MILLIS)
    }
}
