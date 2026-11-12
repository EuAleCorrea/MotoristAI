package com.motoristai.app.ui.theme

import androidx.compose.material3.ColorScheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

// Light Colors
val LightPrimary = Color(0xFF0057D9)
val LightOnPrimary = Color(0xFFFFFFFF)
val LightPrimaryContainer = Color(0xFFE6F2FF)
val LightOnPrimaryContainer = Color(0xFF0057D9)

val LightSecondary = Color(0xFF00A3FF)
val LightOnSecondary = Color(0xFF0B1929)
val LightSecondaryContainer = Color(0xFFE0F4FF)
val LightOnSecondaryContainer = Color(0xFF00557A)

val LightTertiary = Color(0xFF7C4DFF)
val LightOnTertiary = Color(0xFFFFFFFF)

val LightBackground = Color(0xFFF1F5F9)
val LightOnBackground = Color(0xFF0F172A)

val LightSurface = Color(0xFFFFFFFF)
val LightOnSurface = Color(0xFF0F172A)
val LightSurfaceVariant = Color(0xFFF8FAFC)
val LightOnSurfaceVariant = Color(0xFF475569)

val LightOutline = Color(0xFFE2E8F0)
val LightOutlineVariant = Color(0xFFCBD5E1)

val LightError = Color(0xFFDC2626)
val LightOnError = Color(0xFFFFFFFF)
val LightErrorContainer = Color(0xFFFEE2E2)
val LightOnErrorContainer = Color(0xFFB91C1C)

// Dark Colors
val DarkPrimary = Color(0xFF0A84FF)
val DarkOnPrimary = Color(0xFF0B1929)
val DarkPrimaryContainer = Color(0xFF4DA3FF)
val DarkOnPrimaryContainer = Color(0xFF0B1929)

val DarkSecondary = Color(0xFF00A3FF)
val DarkOnSecondary = Color(0xFF0B1929)
val DarkSecondaryContainer = Color(0xFF0E2A47)
val DarkOnSecondaryContainer = Color(0xFF8FD3FF)

val DarkTertiary = Color(0xFF7C4DFF)
val DarkOnTertiary = Color(0xFFFFFFFF)

val DarkBackground = Color(0xFF0B1929)
val DarkOnBackground = Color(0xFFFFFFFF)

val DarkSurface = Color(0xFF112630)
val DarkOnSurface = Color(0xFFFFFFFF)
val DarkSurfaceVariant = Color(0xFF162534)
val DarkOnSurfaceVariant = Color(0xFF94A3B8)

val DarkOutline = Color(0xFF1E3A5F)
val DarkOutlineVariant = Color(0xFF334155)

val DarkError = Color(0xFFDC2626)
val DarkOnError = Color(0xFFFFFFFF)
val DarkErrorContainer = Color(0xFF3D1518)
val DarkOnErrorContainer = Color(0xFFFCA5A5)

// Scrim
val LightScrim = Color(0x6B0B1929)
val DarkScrim = Color(0x8C000000)

/**
 * Extended Tokens + Theme Color Shortcuts
 */
@Immutable
data class MotoristAIColors(
    val primary: Color,
    val onPrimary: Color,
    val surface: Color,
    val onSurface: Color,
    val surfaceVariant: Color,
    val onSurfaceVariant: Color,
    val background: Color,
    val onBackground: Color,
    val border: Color,
    val errorContainer: Color,
    val accent: Color,
    val accentSubtle: Color,
    val success: Color,
    val successText: Color,
    val warning: Color,
    val warningText: Color,
    val info: Color,
    val errorBorder: Color,
    val errorText: Color,
    val textMuted: Color,
    val disabledSurface: Color,
    val onDisabled: Color,
    val gradientStart: Color,
    val gradientEnd: Color,
    val chartGrid: Color,
    val chartPalette: List<Color>
)

val LightExtendedColors = MotoristAIColors(
    primary = LightPrimary,
    onPrimary = LightOnPrimary,
    surface = LightSurface,
    onSurface = LightOnSurface,
    surfaceVariant = LightSurfaceVariant,
    onSurfaceVariant = LightOnSurfaceVariant,
    background = LightBackground,
    onBackground = LightOnBackground,
    border = LightOutline,
    errorContainer = LightErrorContainer,
    accent = Color(0xFF0A84FF),
    accentSubtle = Color(0xFFE6F2FF),
    success = Color(0xFF16A34A),
    successText = Color(0xFF15803D),
    warning = Color(0xFFF59E0B),
    warningText = Color(0xFFB45309),
    info = Color(0xFF0EA5E9),
    errorBorder = Color(0xFFEF4444),
    errorText = Color(0xFFDC2626),
    textMuted = Color(0xFF64748B),
    disabledSurface = Color(0xFFE2E8F0),
    onDisabled = Color(0xFF94A3B8),
    gradientStart = Color(0xFF0057D9),
    gradientEnd = Color(0xFF0A84FF),
    chartGrid = Color(0xFFE2E8F0),
    chartPalette = listOf(
        Color(0xFF0A84FF),
        Color(0xFFF59E0B),
        Color(0xFF7C4DFF),
        Color(0xFF22C55E),
        Color(0xFFEF4444),
        Color(0xFF94A3B8)
    )
)

val DarkExtendedColors = MotoristAIColors(
    primary = DarkPrimary,
    onPrimary = DarkOnPrimary,
    surface = DarkSurface,
    onSurface = DarkOnSurface,
    surfaceVariant = DarkSurfaceVariant,
    onSurfaceVariant = DarkOnSurfaceVariant,
    background = DarkBackground,
    onBackground = DarkOnBackground,
    border = DarkOutline,
    errorContainer = DarkErrorContainer,
    accent = Color(0xFF4DA3FF),
    accentSubtle = Color(0xFF0E2A47),
    success = Color(0xFF22C55E),
    successText = Color(0xFF22C55E),
    warning = Color(0xFFF59E0B),
    warningText = Color(0xFFFBBF24),
    info = Color(0xFF0EA5E9),
    errorBorder = Color(0xFFEF4444),
    errorText = Color(0xFFF87171),
    textMuted = Color(0xFF7E8FA3),
    disabledSurface = Color(0xFF1E2A36),
    onDisabled = Color(0xFF4A5A6B),
    gradientStart = Color(0xFF0057D9),
    gradientEnd = Color(0xFF0A84FF),
    chartGrid = Color(0xFF1E3A5F),
    chartPalette = listOf(
        Color(0xFF4DA3FF),
        Color(0xFFFBBF24),
        Color(0xFFA78BFA),
        Color(0xFF4ADE80),
        Color(0xFFF87171),
        Color(0xFF7E8FA3)
    )
)

val LocalMotoristAIColors = staticCompositionLocalOf { LightExtendedColors }

val LightMotoristAIScheme: ColorScheme = lightColorScheme(
    primary = LightPrimary,
    onPrimary = LightOnPrimary,
    primaryContainer = LightPrimaryContainer,
    onPrimaryContainer = LightOnPrimaryContainer,
    secondary = LightSecondary,
    onSecondary = LightOnSecondary,
    secondaryContainer = LightSecondaryContainer,
    onSecondaryContainer = LightOnSecondaryContainer,
    tertiary = LightTertiary,
    onTertiary = LightOnTertiary,
    background = LightBackground,
    onBackground = LightOnBackground,
    surface = LightSurface,
    onSurface = LightOnSurface,
    surfaceVariant = LightSurfaceVariant,
    onSurfaceVariant = LightOnSurfaceVariant,
    outline = LightOutline,
    outlineVariant = LightOutlineVariant,
    error = LightError,
    onError = LightOnError,
    errorContainer = LightErrorContainer,
    onErrorContainer = LightOnErrorContainer,
    scrim = LightScrim
)

val DarkMotoristAIScheme: ColorScheme = darkColorScheme(
    primary = DarkPrimary,
    onPrimary = DarkOnPrimary,
    primaryContainer = DarkPrimaryContainer,
    onPrimaryContainer = DarkOnPrimaryContainer,
    secondary = DarkSecondary,
    onSecondary = DarkOnSecondary,
    secondaryContainer = DarkSecondaryContainer,
    onSecondaryContainer = DarkOnSecondaryContainer,
    tertiary = DarkTertiary,
    onTertiary = DarkOnTertiary,
    background = DarkBackground,
    onBackground = DarkOnBackground,
    surface = DarkSurface,
    onSurface = DarkOnSurface,
    surfaceVariant = DarkSurfaceVariant,
    onSurfaceVariant = DarkOnSurfaceVariant,
    outline = DarkOutline,
    outlineVariant = DarkOutlineVariant,
    error = DarkError,
    onError = DarkOnError,
    errorContainer = DarkErrorContainer,
    onErrorContainer = DarkOnErrorContainer,
    scrim = DarkScrim
)
