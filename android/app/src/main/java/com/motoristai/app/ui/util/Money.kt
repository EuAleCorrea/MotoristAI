package com.motoristai.app.ui.util

/**
 * Formatação monetária pt-BR, livre de dependência de Locale para ser determinística em teste.
 *
 * Regras (tokens.md):
 *  - símbolo obrigatório "R$"
 *  - separador de milhar "." e decimal ","
 *  - negativo com sinal de menos tipográfico antes do símbolo: "− R$ 150,00"
 *  - sempre duas casas decimais
 */
object Money {

    /** Sinal de menos tipográfico (U+2212), conforme especificação. */
    const val MINUS = "\u2212"

    /** Espaço não separável, para o valor nunca quebrar entre "R$" e o número. */
    const val NBSP = "\u00A0"

    fun format(cents: Long): String {
        val negative = cents < 0L
        // Evita overflow em Long.MIN_VALUE
        val abs = if (negative) -(cents + 1L) + 1L else cents
        val whole = abs / 100L
        val fraction = abs % 100L

        return buildString {
            if (negative) {
                append(MINUS)
                append(' ')
            }
            append("R$")
            append(NBSP)
            append(groupThousands(whole))
            append(',')
            if (fraction < 10L) append('0')
            append(fraction)
        }
    }

    /** Versão sem símbolo, para rótulos e testes auxiliares. */
    fun formatNumber(cents: Long): String = format(cents).substringAfter(NBSP)

    private fun groupThousands(value: Long): String {
        val digits = value.toString()
        if (digits.length <= 3) return digits
        val out = StringBuilder()
        val firstGroupSize = digits.length % 3
        var index = 0
        if (firstGroupSize > 0) {
            out.append(digits, 0, firstGroupSize)
            index = firstGroupSize
        }
        while (index < digits.length) {
            if (out.isNotEmpty()) out.append('.')
            out.append(digits, index, index + 3)
            index += 3
        }
        return out.toString()
    }

    /** Texto completo lido pelo TalkBack, sempre com o valor integral. */
    fun accessibilityLabel(label: String?, cents: Long): String {
        val value = format(cents)
        return if (label.isNullOrBlank()) value else "$label, $value"
    }
}
