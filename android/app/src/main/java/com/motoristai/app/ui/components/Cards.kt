package com.motoristai.app.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
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
import com.motoristai.app.ui.icons.MotoristAIIcons
import com.motoristai.app.ui.theme.MotoristAIThemeTokens
import com.motoristai.app.ui.util.MoneyTextSizing

/**
 * C15 - Card de Saldo com gradiente e alternância de visibilidade.
 * Quando oculto, mostra "R$ ••••" e mantém o valor real no rótulo de acessibilidade?
 * Não: com o valor oculto o TalkBack anuncia apenas "Saldo oculto", para não vazar o dado.
 */
@Composable
fun BalanceCard(
    balanceCents: Long,
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
                    modifier = Modifier.size(48.dp)
                ) {
                    Icon(
                        imageVector = if (isBalanceVisible) MotoristAIIcons.Visibility else MotoristAIIcons.VisibilityOff,
                        contentDescription = if (isBalanceVisible) "Ocultar saldo" else "Mostrar saldo",
                        tint = Color.White,
                        modifier = Modifier.size(22.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(4.dp))

            if (isBalanceVisible) {
                MoneyText(
                    cents = balanceCents,
                    color = Color.White,
                    label = "Saldo atual"
                )
                if (subtitleText.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = subtitleText,
                        style = MotoristAIThemeTokens.typography.caption,
                        color = Color.White.copy(alpha = 0.8f)
                    )
                }
            } else {
                Text(
                    text = "R$ ••••",
                    style = MotoristAIThemeTokens.typography.display,
                    color = Color.White,
                    maxLines = 1,
                    modifier = Modifier.semantics { contentDescription = "Saldo oculto" }
                )
            }
        }
    }
}

/**
 * C16 - Card de indicador financeiro. Recebe o valor em centavos e delega a
 * apresentação ao [MoneyText], que nunca trunca.
 */
@Composable
fun IndicatorCard(
    title: String,
    cents: Long,
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
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = title,
                    style = MotoristAIThemeTokens.typography.caption,
                    color = MotoristAIThemeTokens.colors.textMuted,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
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

            MoneyText(
                cents = cents,
                color = valueColor,
                label = title
            )
        }
    }
}

/**
 * Grupo de indicadores responsivo.
 * 3 colunas a partir de 360 dp, 2 colunas de 300 a 359 dp, empilhado abaixo disso.
 */
@Composable
fun IndicatorGroup(
    modifier: Modifier = Modifier,
    items: List<IndicatorCardData>
) {
    BoxWithConstraints(modifier = modifier.fillMaxWidth()) {
        val columns = MoneyTextSizing.indicatorColumns(this.maxWidth.value)

        if (columns == 1) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items.forEach { item ->
                    IndicatorCard(
                        title = item.title,
                        cents = item.cents,
                        valueColor = item.color,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        } else {
            items.chunked(columns).forEach { row ->
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    row.forEach { item ->
                        IndicatorCard(
                            title = item.title,
                            cents = item.cents,
                            valueColor = item.color,
                            modifier = Modifier.weight(1f)
                        )
                    }
                    repeat(columns - row.size) {
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }
            }
        }
    }
}

data class IndicatorCardData(
    val title: String,
    val cents: Long,
    val color: Color
)

/**
 * C17 - Card de meta financeira.
 */
@Composable
fun GoalCard(
    title: String,
    targetCents: Long,
    progressFraction: Float,
    modifier: Modifier = Modifier
) {
    val isCompleted = progressFraction >= 1.0f
    val progressPercent = (progressFraction * 100).toInt().coerceIn(0, 100)

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
                    color = MotoristAIThemeTokens.colors.onSurface,
                    modifier = Modifier.weight(1f),
                    maxLines = 2
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

            MoneyText(
                cents = targetCents,
                color = MotoristAIThemeTokens.colors.textMuted,
                label = "Meta"
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
 * C18 - Item de lista de lançamento.
 */
@Composable
fun MotoristAIListItem(
    title: String,
    subtitle: String,
    cents: Long,
    valueColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: ImageVector? = null,
    showChevron: Boolean = true
) {
    val valueText = com.motoristai.app.ui.util.Money.format(cents)

    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 12.dp)
            .semantics {
                contentDescription = "$title, $subtitle, $valueText"
            },
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
                text = valueText,
                style = MotoristAIThemeTokens.typography.title3,
                color = valueColor,
                maxLines = 1
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
