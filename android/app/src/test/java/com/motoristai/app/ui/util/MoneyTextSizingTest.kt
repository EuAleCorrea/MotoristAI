package com.motoristai.app.ui.util

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class MoneyTextSizingTest {

    private val small = Money.format(250_00L)      // R$ 250,00  (10 chars)
    private val large = Money.format(987_654_321L) // R$ 9.876.543,21 (15 chars)
    private val negative = Money.format(-123_456L) // − R$ 1.234,56 (12 chars)

    @Test
    fun `small values keep the largest tier`() {
        assertEquals(MoneyTier.DISPLAY, MoneyTextSizing.pickTier(small, availableWidthDp = 300f))
    }

    @Test
    fun `values degrade the tier as width shrinks`() {
        val atWide = MoneyTextSizing.pickTier(large, availableWidthDp = 300f)
        val atNarrow = MoneyTextSizing.pickTier(large, availableWidthDp = 96f)
        assertTrue(
            "tier deve diminuir com a largura",
            atNarrow.sizeSp <= atWide.sizeSp
        )
    }

    @Test
    fun `the chosen tier always fits or falls back to the smallest`() {
        val widths = listOf(96f, 104f, 160f, 220f, 280f, 328f, 480f)
        val texts = listOf(small, large, negative, Money.format(1L), Money.format(99_999_999L))

        for (text in texts) {
            for (width in widths) {
                val tier = MoneyTextSizing.pickTier(text, width, fontScale = 1f)
                val fits = MoneyTextSizing.estimateWidthDp(text, tier, 1f) <= width
                val isSmallest = tier == MoneyTier.MICRO
                assertTrue(
                    "para '$text' em ${width}dp o tier $tier não cabe e não é o menor",
                    fits || isSmallest
                )
            }
        }
    }

    @Test
    fun `font scale 200 percent forces a smaller tier`() {
        val at100 = MoneyTextSizing.pickTier(large, availableWidthDp = 300f, fontScale = 1f)
        val at200 = MoneyTextSizing.pickTier(large, availableWidthDp = 300f, fontScale = 2f)
        assertTrue(at200.sizeSp < at100.sizeSp)
    }

    @Test
    fun `wrap is requested only when a single line does not fit`() {
        assertTrue(MoneyTextSizing.requiresWrap(large, MoneyTier.DISPLAY, 100f))
        assertTrue(!MoneyTextSizing.requiresWrap(small, MoneyTier.DISPLAY, 400f))
    }

    @Test
    fun `indicator columns adapt to the available width`() {
        assertEquals(3, MoneyTextSizing.indicatorColumns(480f))
        assertEquals(3, MoneyTextSizing.indicatorColumns(360f))
        assertEquals(2, MoneyTextSizing.indicatorColumns(359f))
        assertEquals(2, MoneyTextSizing.indicatorColumns(300f))
        assertEquals(1, MoneyTextSizing.indicatorColumns(299f))
        assertEquals(2, MoneyTextSizing.indicatorColumns(320f))
    }

    @Test
    fun `there is no tier above DISPLAY and none below MICRO`() {
        val tiers = MoneyTier.entries
        assertEquals(MoneyTier.DISPLAY, tiers.first())
        assertEquals(MoneyTier.MICRO, tiers.last())
        assertTrue(tiers.zipWithNext().all { (a, b) -> a.sizeSp > b.sizeSp })
    }
}
