package com.motoristai.app.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.FloatingActionButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.motoristai.app.ui.theme.MotoristAIThemeTokens

/**
 * C01 - Botão Primário
 */
@Composable
fun PrimaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    isLoading: Boolean = false,
    icon: ImageVector? = null,
    fullWidth: Boolean = true
) {
    val buttonModifier = if (fullWidth) modifier.fillMaxWidth().height(48.dp) else modifier.height(48.dp)

    Button(
        onClick = onClick,
        modifier = buttonModifier.semantics {
            contentDescription = if (isLoading) "$text, carregando" else text
        },
        enabled = enabled && !isLoading,
        shape = RoundedCornerShape(12.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = MotoristAIThemeTokens.colors.primary,
            contentColor = MotoristAIThemeTokens.colors.onPrimary,
            disabledContainerColor = MotoristAIThemeTokens.colors.disabledSurface,
            disabledContentColor = MotoristAIThemeTokens.colors.onDisabled
        ),
        contentPadding = PaddingValues(horizontal = 20.dp)
    ) {
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.size(18.dp),
                color = MotoristAIThemeTokens.colors.onPrimary,
                strokeWidth = 2.dp
            )
            Spacer(modifier = Modifier.width(8.dp))
        } else if (icon != null) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
        }
        Text(
            text = text,
            style = MotoristAIThemeTokens.typography.label
        )
    }
}

/**
 * C02 - Botão Secundário (Outlined)
 */
@Composable
fun SecondaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    icon: ImageVector? = null,
    fullWidth: Boolean = true
) {
    val buttonModifier = if (fullWidth) modifier.fillMaxWidth().height(48.dp) else modifier.height(48.dp)

    OutlinedButton(
        onClick = onClick,
        modifier = buttonModifier,
        enabled = enabled,
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(
            1.dp,
            if (enabled) MotoristAIThemeTokens.colors.border else MotoristAIThemeTokens.colors.disabledSurface
        ),
        colors = ButtonDefaults.outlinedButtonColors(
            contentColor = MotoristAIThemeTokens.colors.primary,
            disabledContentColor = MotoristAIThemeTokens.colors.onDisabled
        ),
        contentPadding = PaddingValues(horizontal = 20.dp)
    ) {
        if (icon != null) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
        }
        Text(
            text = text,
            style = MotoristAIThemeTokens.typography.label
        )
    }
}

/**
 * C03 - Botão Tonal
 */
@Composable
fun TonalButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    icon: ImageVector? = null,
    fullWidth: Boolean = true
) {
    val buttonModifier = if (fullWidth) modifier.fillMaxWidth().height(48.dp) else modifier.height(48.dp)

    FilledTonalButton(
        onClick = onClick,
        modifier = buttonModifier,
        enabled = enabled,
        shape = RoundedCornerShape(12.dp),
        colors = ButtonDefaults.filledTonalButtonColors(
            containerColor = MotoristAIThemeTokens.colors.accentSubtle,
            contentColor = MotoristAIThemeTokens.colors.primary,
            disabledContainerColor = MotoristAIThemeTokens.colors.disabledSurface,
            disabledContentColor = MotoristAIThemeTokens.colors.onDisabled
        ),
        contentPadding = PaddingValues(horizontal = 20.dp)
    ) {
        if (icon != null) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
        }
        Text(
            text = text,
            style = MotoristAIThemeTokens.typography.label
        )
    }
}

/**
 * C04 - Botão de Texto
 */
@Composable
fun TextActionButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    color: Color? = null
) {
    val textColor = color ?: MotoristAIThemeTokens.colors.primary

    TextButton(
        onClick = onClick,
        modifier = modifier.height(40.dp),
        enabled = enabled,
        colors = ButtonDefaults.textButtonColors(
            contentColor = textColor,
            disabledContentColor = MotoristAIThemeTokens.colors.onDisabled
        )
    ) {
        Text(
            text = text,
            style = MotoristAIThemeTokens.typography.label
        )
    }
}

/**
 * C05 - Floating Action Button (FAB)
 */
@Composable
fun MotoristAIFab(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    contentDescriptionText: String = "Novo lançamento"
) {
    FloatingActionButton(
        onClick = onClick,
        modifier = modifier
            .size(56.dp)
            .semantics { contentDescription = contentDescriptionText },
        shape = RoundedCornerShape(28.dp),
        containerColor = MotoristAIThemeTokens.colors.accent,
        contentColor = Color.White,
        elevation = FloatingActionButtonDefaults.elevation(defaultElevation = 6.dp)
    ) {
        Icon(
            imageVector = Icons.Default.Add,
            contentDescription = null,
            modifier = Modifier.size(28.dp)
        )
    }
}
