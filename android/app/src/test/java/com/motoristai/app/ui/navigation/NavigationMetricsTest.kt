package com.motoristai.app.ui.navigation

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class NavigationMetricsTest {

    private val widths = listOf(320f, 360f, 393f, 480f)
    private val gestureInset = 24f
    private val threeButtonInset = 48f

    @Test
    fun `touch targets are never below 48dp on any tested width`() {
        for (width in widths) {
            val metrics = NavigationMetrics.compute(width, gestureInset)
            assertTrue(
                "slot de ${metrics.slotWidthDp}dp em ${width}dp",
                metrics.slotWidthDp >= NavigationMetrics.MIN_TOUCH_TARGET_DP
            )
            assertTrue(metrics.fabSlotWidthDp >= NavigationMetrics.MIN_TOUCH_TARGET_DP)
        }
    }

    @Test
    fun `the row never overflows the available width`() {
        for (width in widths) {
            val metrics = NavigationMetrics.compute(width, gestureInset)
            val occupied = metrics.slotWidthDp * 4 + metrics.fabSlotWidthDp
            assertTrue(
                "ocupado ${occupied}dp excede ${width}dp",
                occupied <= width + 0.01f
            )
        }
    }

    @Test
    fun `slot widths follow the width per device`() {
        assertEquals(66f, NavigationMetrics.compute(320f, gestureInset).slotWidthDp, 0.01f)
        assertEquals(76f, NavigationMetrics.compute(360f, gestureInset).slotWidthDp, 0.01f)
        assertEquals(84.25f, NavigationMetrics.compute(393f, gestureInset).slotWidthDp, 0.01f)
        assertEquals(106f, NavigationMetrics.compute(480f, gestureInset).slotWidthDp, 0.01f)
    }

    @Test
    fun `short labels are used only when needed`() {
        assertTrue(NavigationMetrics.compute(320f, gestureInset).useShortLabels)
        assertFalse(NavigationMetrics.compute(360f, gestureInset).useShortLabels)
        assertFalse(NavigationMetrics.compute(480f, gestureInset).useShortLabels)
    }

    @Test
    fun `font scale above 125 percent switches to short labels`() {
        assertTrue(NavigationMetrics.compute(480f, gestureInset, fontScale = 1.5f).useShortLabels)
        assertFalse(NavigationMetrics.compute(480f, gestureInset, fontScale = 1.25f).useShortLabels)
    }

    @Test
    fun `content padding accounts for gesture navigation`() {
        val metrics = NavigationMetrics.compute(360f, gestureInset)
        // 24 (inset) + 28 (gap) + 56 (fab) + 8 (folga)
        assertEquals(116f, metrics.contentPaddingBottomDp, 0.01f)
    }

    @Test
    fun `content padding accounts for three button navigation`() {
        val metrics = NavigationMetrics.compute(360f, threeButtonInset)
        assertEquals(140f, metrics.contentPaddingBottomDp, 0.01f)
    }

    @Test
    fun `fab keeps its distance from the bottom edge including the inset`() {
        assertEquals(52f, NavigationMetrics.compute(360f, gestureInset).fabBottomOffsetDp, 0.01f)
        assertEquals(76f, NavigationMetrics.compute(360f, threeButtonInset).fabBottomOffsetDp, 0.01f)
    }

    @Test
    fun `bar height is constant across widths`() {
        for (width in widths) {
            assertEquals(56f, NavigationMetrics.compute(width, gestureInset).barHeightDp, 0.01f)
        }
    }
}
