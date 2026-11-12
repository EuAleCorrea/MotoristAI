package com.motoristai.app.ui.navigation

/**
 * Métricas da barra inferior com FAB central, calculadas a partir da largura real disponível
 * e do inset do sistema — nenhum valor de largura é fixo.
 *
 * Composição: 4 destinos + 1 slot central para o FAB.
 * O slot central tem a largura do FAB (56 dp), nunca menor que o alvo de toque (48 dp).
 * Os 4 destinos restantes dividem o que sobra, com piso de 48 dp.
 */
data class NavBarMetrics(
    val barHeightDp: Float,
    val fabSlotWidthDp: Float,
    val slotWidthDp: Float,
    val fabBottomOffsetDp: Float,
    val contentPaddingBottomDp: Float,
    val useShortLabels: Boolean
)

object NavigationMetrics {

    const val BAR_HEIGHT_DP = 56f
    const val FAB_SIZE_DP = 56f
    const val MIN_TOUCH_TARGET_DP = 48f
    const val FAB_BOTTOM_GAP_DP = 28f
    const val CONTENT_BOTTOM_GAP_DP = 8f

    /** Abaixo desta largura de slot, os rótulos passam para a forma curta. */
    const val SHORT_LABEL_THRESHOLD_DP = 68f

    /** Acima desta escala de fonte, rótulos longos não cabem com folga. */
    const val MAX_FULL_LABEL_FONT_SCALE = 1.25f

    fun compute(
        availableWidthDp: Float,
        bottomInsetDp: Float,
        fontScale: Float = 1f
    ): NavBarMetrics {
        val fabSlot = maxOf(FAB_SIZE_DP, MIN_TOUCH_TARGET_DP)
        val rawSlot = (availableWidthDp - fabSlot) / 4f
        val slotWidth = maxOf(rawSlot, MIN_TOUCH_TARGET_DP)

        val useShortLabels =
            slotWidth < SHORT_LABEL_THRESHOLD_DP || fontScale > MAX_FULL_LABEL_FONT_SCALE

        // FAB sobreposto 28 dp à barra, sempre acima do inset de gesto.
        val fabBottomOffset = bottomInsetDp + FAB_BOTTOM_GAP_DP

        // Conteúdo termina 8 dp acima do topo do FAB.
        val contentPaddingBottom = fabBottomOffset + FAB_SIZE_DP + CONTENT_BOTTOM_GAP_DP

        return NavBarMetrics(
            barHeightDp = BAR_HEIGHT_DP,
            fabSlotWidthDp = fabSlot,
            slotWidthDp = slotWidth,
            fabBottomOffsetDp = fabBottomOffset,
            contentPaddingBottomDp = contentPaddingBottom,
            useShortLabels = useShortLabels
        )
    }
}
