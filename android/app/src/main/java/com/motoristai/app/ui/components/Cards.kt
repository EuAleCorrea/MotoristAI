package com.motoristai.app.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.motoristai.app.ui.theme.MotoristAIThemeTokens

/**
 * C15 - Card de Saldo com Gradiente e Toggle de Visibilidade
 */
@Composable
fun BalanceCard(
    balanceFormatted: String,
    isBalanceVisible: Boolean,
    onToggleVisibility: () -> Unit,
    modifier: Modifier = Modifier,
    subtitleText: String = "+12% em relação ao mês anterior"
) {
    val gradientBrush = Brush.linearGradient(
        colors = listOf(
            MotoristAIThemeTokens.colors.gradientStart,
            MotoristAIThemeTokens.colors.gradientEnd
        )
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(gradientBrush)
            .padding(16.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Saldo Atual",
                    style = MotoristAIThemeTokens.typography.label,
                    color = Color.White.copy(alpha = 0.8f)
                )

                IconButton(
                    onClick = onToggleVisibility,
                    modifier = Modifier.size(32.dp)
                ) {
                    Icon(
                        imageVector = if (isBalanceVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                        contentDescription = if (isBalanceVisible) "Ocultar saldo" else "Mostrar saldo",
                        tint = Color.White
                    )
                }
            }

            Spacer(modifier = Modifier.height(4.dp))

            val displayValue = if (isBalanceVisible) balanceFormatted else "R$ ••••"
            val textStyle = if (displayValue.length > 13) {
                MotoristAIThemeTokens.typography.title2
            } else {
                MotoristAIThemeTokens.typography.display
            }

            Text(
                text = displayValue,
                style = textStyle,
                color = Color.White,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            if (subtitleText.isNotEmpty() && isBalanceVisible) {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = subtitleText,
                    style = MotoristAIThemeTokens.typography.caption,
                    color = Color.White.copy(alpha = 0.8f)
                )
            }
        }
    }
}

/**
 * C16 - Card de Indicador Financeiro (Receitas / Despesas / Saldo)
 */
@Composable
fun IndicatorCard(
    title: String,
    amountFormatted: String,
    valueColor: Color,
    modifier: Modifier = Modifier,
    icon: ImageVector? = null
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MotoristAIThemeTokens.colors.surface
        ),
        border = BorderStroke(1.dp, MotoristAIThemeTokens.colors.border)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = title,
                    style = MotoristAIThemeTokens.typography.caption,
                    color = MotoristAIThemeTokens.colors.textMuted
                )
                if (icon != null) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = valueColor,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = amountFormatted,
                style = if (amountFormatted.length > 11) MotoristAIThemeTokens.typography.title3 else MotoristAIThemeTokens.typography.title2,
                color = valueColor,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

/**
 * C17 - Card de Meta Financeira
 */
@Composable
fun GoalCard(
    title: String,
    targetAmountFormatted: String,
    progressFraction: Float,
    modifier: Modifier = Modifier
) {
    val isCompleted = progressFraction >= 1.0f
    val progressPercent = (progressFraction * 100).toInt().coerceAtMost(100)

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MotoristAIThemeTokens.colors.surface
        ),
        border = BorderStroke(1.dp, MotoristAIThemeTokens.colors.border)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = title,
                    style = MotoristAIThemeTokens.typography.title3,
                    color = MotoristAIThemeTokens.colors.onSurface
                )
                if (isCompleted) {
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = "Meta concluída",
                        tint = MotoristAIThemeTokens.colors.success,
                        modifier = Modifier.size(20.dp)
                    )
                } else {
                    Text(
                        text = "$progressPercent%",
                        style = MotoristAIThemeTokens.typography.label,
                        color = MotoristAIThemeTokens.colors.primary
                    )
                }
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = targetAmountFormatted,
                style = MotoristAIThemeTokens.typography.bodySmall,
                color = MotoristAIThemeTokens.colors.textMuted
            )

            Spacer(modifier = Modifier.height(8.dp))

            LinearProgressIndicator(
                progress = progressFraction.coerceIn(0f, 1f),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(RoundedCornerShape(3.dp)),
                color = if (isCompleted) MotoristAIThemeTokens.colors.success else MotoristAIThemeTokens.colors.primary,
                trackColor = MotoristAIThemeTokens.colors.border
            )
        }
    }
}

/**
 * C18 - Item de Lista de Lançamento
 */
@Composable
fun MotoristAIListItem(
    title: String,
    subtitle: String,
    valueFormatted: String,
    valueColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: ImageVector? = null,
    showChevron: Boolean = true
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 12.dp)
            .semantics { contentDescription = "$title, $subtitle, $valueFormatted" },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.weight(1f)
        ) {
            if (icon != null) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(MotoristAIThemeTokens.colors.surfaceVariant)
                        .border(1.dp, MotoristAIThemeTokens.colors.border, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = MotoristAIThemeTokens.colors.onSurfaceVariant,
                        modifier = Modifier.size(20.dp)
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
            }

            Column {
                Text(
                    text = title,
                    style = MotoristAIThemeTokens.typography.title3,
                    color = MotoristAIThemeTokens.colors.onSurface,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = subtitle,
                    style = MotoristAIThemeTokens.typography.caption,
                    color = MotoristAIThemeTokens.colors.textMuted,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }

        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                text = valueFormatted,
                style = MotoristAIThemeTokens.typography.title3,
                color = valueColor
            )
            if (showChevron) {
                Spacer(modifier = Modifier.width(4.dp))
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                    contentDescription = null,
                    tint = MotoristAIThemeTokens.colors.textMuted,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}
