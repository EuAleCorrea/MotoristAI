package com.motoristai.app.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.motoristai.app.ui.icons.MotoristAIIcons
import com.motoristai.app.ui.theme.MotoristAIThemeTokens

/**
 * C25 - Estado vazio.
 */
@Composable
fun EmptyState(
    title: String = "Nenhum lançamento encontrado",
    description: String = "Sua lista de lançamentos para este período está vazia.",
    modifier: Modifier = Modifier,
    icon: ImageVector = MotoristAIIcons.Inbox,
    actionButton: @Composable (() -> Unit)? = null
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(72.dp)
                .clip(CircleShape)
                .background(MotoristAIThemeTokens.colors.surfaceVariant),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = MotoristAIThemeTokens.colors.textMuted,
                modifier = Modifier.size(36.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = title,
            style = MotoristAIThemeTokens.typography.title2,
            color = MotoristAIThemeTokens.colors.onSurface
        )

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = description,
            style = MotoristAIThemeTokens.typography.bodySmall,
            color = MotoristAIThemeTokens.colors.textMuted,
            textAlign = androidx.compose.ui.text.style.TextAlign.Center
        )

        if (actionButton != null) {
            Spacer(modifier = Modifier.height(20.dp))
            actionButton()
        }
    }
}

/**
 * C26 - Estado de carregamento.
 */
@Composable
fun LoadingState(
    modifier: Modifier = Modifier,
    message: String = "Carregando informações..."
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        CircularProgressIndicator(
            modifier = Modifier.size(36.dp),
            color = MotoristAIThemeTokens.colors.primary,
            strokeWidth = 3.dp
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = message,
            style = MotoristAIThemeTokens.typography.body,
            color = MotoristAIThemeTokens.colors.textMuted
        )
    }
}

/**
 * C27 - Estado de erro.
 */
@Composable
fun ErrorState(
    title: String = "Não foi possível carregar os dados",
    message: String = "Verifique sua conexão e tente novamente.",
    onRetry: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(72.dp)
                .clip(CircleShape)
                .background(MotoristAIThemeTokens.colors.errorContainer),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = MotoristAIIcons.ErrorOutline,
                contentDescription = null,
                tint = MotoristAIThemeTokens.colors.errorText,
                modifier = Modifier.size(36.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = title,
            style = MotoristAIThemeTokens.typography.title2,
            color = MotoristAIThemeTokens.colors.onSurface
        )

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = message,
            style = MotoristAIThemeTokens.typography.bodySmall,
            color = MotoristAIThemeTokens.colors.textMuted,
            textAlign = androidx.compose.ui.text.style.TextAlign.Center
        )

        Spacer(modifier = Modifier.height(20.dp))

        PrimaryButton(
            text = "Tentar novamente",
            onClick = onRetry,
            fullWidth = false
        )
    }
}

/**
 * C28 - Skeleton com shimmer.
 */
@Composable
fun SkeletonItem(
    height: Dp,
    modifier: Modifier = Modifier,
    borderRadius: Dp = 12.dp
) {
    val transition = rememberInfiniteTransition(label = "shimmerTransition")
    val translateAnim = transition.animateFloat(
        initialValue = 0f,
        targetValue = 1000f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "shimmerTranslation"
    )

    val shimmerColors = listOf(
        MotoristAIThemeTokens.colors.disabledSurface,
        MotoristAIThemeTokens.colors.surfaceVariant,
        MotoristAIThemeTokens.colors.disabledSurface
    )

    val brush = Brush.linearGradient(
        colors = shimmerColors,
        start = Offset(translateAnim.value - 300f, translateAnim.value - 300f),
        end = Offset(translateAnim.value, translateAnim.value)
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(height)
            .clip(RoundedCornerShape(borderRadius))
            .background(brush)
            .clearAndSetSemantics { }
    )
}

/**
 * C30 - Barra de progresso.
 */
@Composable
fun MotoristAIProgressBar(
    progress: Float?,
    modifier: Modifier = Modifier
) {
    if (progress != null) {
        LinearProgressIndicator(
            progress = progress.coerceIn(0f, 1f),
            modifier = modifier
                .fillMaxWidth()
                .height(6.dp)
                .clip(RoundedCornerShape(3.dp)),
            color = MotoristAIThemeTokens.colors.primary,
            trackColor = MotoristAIThemeTokens.colors.border
        )
    } else {
        LinearProgressIndicator(
            modifier = modifier
                .fillMaxWidth()
                .height(6.dp)
                .clip(RoundedCornerShape(3.dp)),
            color = MotoristAIThemeTokens.colors.primary,
            trackColor = MotoristAIThemeTokens.colors.border
        )
    }
}
