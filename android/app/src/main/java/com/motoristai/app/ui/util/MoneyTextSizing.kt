package com.motoristai.app.ui.util

/**
 * Escolha de tipografia para valores monetários.
 *
 * Objetivo: **nunca** esconder dígitos. O texto é reduzido de degrau até caber na largura
 * disponível; se nem o menor degrau couber em uma linha, o componente permite duas linhas
 * (o valor usa espaço não separável, então quebra apenas antes de "R$", nunca no meio do número).
 * Não existe `TextOverflow.Ellipsis` em nenhum valor monetário.
 */
enum class MoneyTier(val sizeSp: Float, val lineHeightSp: Float) {
    DISPLAY(28f, 32f),
    TITLE1(24f, 28f),
    TITLE2(20f, 24f),
    TITLE3(18f, 24f),
    MICRO(16f, 20f)
}

object MoneyTextSizing {

    /** Largura média de um caractere em Roboto, relativa ao tamanho da fonte. */
    const val CHAR_WIDTH_RATIO = 0.62f

    /** Quantas linhas o valor pode ocupar quando o menor degrau ainda não cabe. */
    const val MAX_LINES = 2

    fun estimateWidthDp(text: String, tier: MoneyTier, fontScale: Float = 1f): Float =
        text.length * tier.sizeSp * CHAR_WIDTH_RATIO * fontScale

    /**
     * Retorna o maior degrau que cabe em [availableWidthDp].
     * Se nenhum degrau couber em uma linha, retorna [MoneyTier.MICRO] — nunca um valor truncado.
     */
    fun pickTier(text: String, availableWidthDp: Float, fontScale: Float = 1f): MoneyTier {
        if (availableWidthDp <= 0f) return MoneyTier.MICRO
        val singleLineCapacity = availableWidthDp
        for (tier in MoneyTier.entries) {
            if (estimateWidthDp(text, tier, fontScale) <= singleLineCapacity) return tier
        }
        // Não cabe em uma linha: o componente passa a usar duas linhas com o menor degrau.
        return MoneyTier.MICRO
    }

    /** O valor precisa de duas linhas nesse degrau e nessa largura? */
    fun requiresWrap(text: String, tier: MoneyTier, availableWidthDp: Float, fontScale: Float = 1f): Boolean =
        estimateWidthDp(text, tier, fontScale) > availableWidthDp

    /**
     * Quantas colunas o grupo de indicadores deve ter para a largura disponível.
     * Abaixo de 360 dp o grupo quebra de 3 colunas para 1 (empilhado), evitando compressão.
     */
    fun indicatorColumns(availableWidthDp: Float): Int = when {
        availableWidthDp >= 360f -> 3
        availableWidthDp >= 300f -> 2
        else -> 1
    }
}
