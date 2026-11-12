package com.motoristai.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable

@Composable
fun MotoristAITheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkMotoristAIScheme else LightMotoristAIScheme
    val extendedColors = if (darkTheme) DarkExtendedColors else LightExtendedColors

    CompositionLocalProvider(
        LocalMotoristAIColors provides extendedColors,
        LocalMotoristAITypography provides AppTypography,
        LocalMotoristAISpacing provides MotoristAISpacing()
    ) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography = MaterialTypography,
            shapes = AppShapes,
            content = content
        )
    }
}

object MotoristAIThemeTokens {
    val colors: MotoristAIColors
        @Composable
        @ReadOnlyComposable
        get() = LocalMotoristAIColors.current

    val typography: MotoristAITypography
        @Composable
        @ReadOnlyComposable
        get() = LocalMotoristAITypography.current

    val spacing: MotoristAISpacing
        @Composable
        @ReadOnlyComposable
        get() = LocalMotoristAISpacing.current
}
