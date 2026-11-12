package com.motoristai.app.ui.util

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class MoneyTest {

    @Test
    fun `formats zero`() {
        assertEquals("R$\u00A00,00", Money.format(0L))
    }

    @Test
    fun `formats cents only`() {
        assertEquals("R$\u00A00,05", Money.format(5L))
        assertEquals("R$\u00A00,50", Money.format(50L))
    }

    @Test
    fun `formats small amounts without thousand separator`() {
        assertEquals("R$\u00A0250,00", Money.format(25_000L))
        assertEquals("R$\u00A0999,99", Money.format(99_999L))
    }

    @Test
    fun `formats thousands with dot separator`() {
        assertEquals("R$\u00A01.000,00", Money.format(100_000L))
        assertEquals("R$\u00A01.234,56", Money.format(123_456L))
        assertEquals("R$\u00A011.650,00", Money.format(1_165_000L))
    }

    @Test
    fun `formats millions`() {
        assertEquals("R$\u00A01.000.000,00", Money.format(100_000_000L))
        assertEquals("R$\u00A09.876.543,21", Money.format(987_654_321L))
    }

    @Test
    fun `formats negatives with typographic minus before the symbol`() {
        assertEquals("\u2212 R$\u00A0150,00", Money.format(-15_000L))
        assertEquals("\u2212 R$\u00A01.234,56", Money.format(-123_456L))
    }

    @Test
    fun `uses non breaking space so the value never splits mid number`() {
        val formatted = Money.format(123_456L)
        assertTrue(formatted.contains('\u00A0'))
        assertTrue(formatted.none { it == ' ' })
    }

    @Test
    fun `accessibility label always carries the full value`() {
        assertEquals(
            "Saldo atual, R$\u00A09.876.543,21",
            Money.accessibilityLabel("Saldo atual", 987_654_321L)
        )
        assertEquals("R$\u00A00,00", Money.accessibilityLabel(null, 0L))
        assertEquals("R$\u00A00,00", Money.accessibilityLabel("   ", 0L))
    }

    @Test
    fun `handles Long MIN_VALUE without overflow`() {
        val formatted = Money.format(Long.MIN_VALUE)
        assertTrue(formatted.startsWith("\u2212 R$"))
    }
}
