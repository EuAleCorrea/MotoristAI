package com.motoristai.app.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Immutable
data class MotoristAISpacing(
    val space1: Dp = 4.dp,
    val space2: Dp = 8.dp,
    val space3: Dp = 12.dp,
    val space4: Dp = 16.dp,
    val space5: Dp = 24.dp,
    val space6: Dp = 32.dp,
    val touchTargetMin: Dp = 48.dp,
    val screenPadding: Dp = 16.dp,
    val cardPadding: Dp = 16.dp,
    val cardGap: Dp = 12.dp,
    val buttonHeight: Dp = 48.dp,
    val textFieldHeight: Dp = 56.dp,
    val bottomBarHeight: Dp = 56.dp
)

val LocalMotoristAISpacing = staticCompositionLocalOf { MotoristAISpacing() }
