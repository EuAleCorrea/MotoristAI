package com.motoristai.app.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
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
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.TrendingDown
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.SheetState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.motoristai.app.ui.theme.MotoristAIThemeTokens

data class BottomSheetOption(
    val title: String,
    val subtitle: String,
    val icon: ImageVector,
    val iconColor: Color,
    val onClick: () -> Unit
)

/**
 * C22 - Modal Bottom Sheet de Ações Rápidas
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MotoristAIBottomSheet(
    onDismissRequest: () -> Unit,
    onOptionSelected: (String) -> Unit,
    sheetState: SheetState = rememberModalBottomSheetState()
) {
    ModalBottomSheet(
        onDismissRequest = onDismissRequest,
        sheetState = sheetState,
        containerColor = MotoristAIThemeTokens.colors.surface,
        scrimColor = MotoristAIThemeTokens.colors.primary.copy(alpha = 0.42f),
        shape = RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Novo lançamento",
                        style = MotoristAIThemeTokens.typography.title2,
                        color = MotoristAIThemeTokens.colors.onSurface
                    )
                    Text(
                        text = "Escolha o tipo de registro",
                        style = MotoristAIThemeTokens.typography.caption,
                        color = MotoristAIThemeTokens.colors.textMuted
                    )
                }

                IconButton(onClick = onDismissRequest) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Fechar menu de ações",
                        tint = MotoristAIThemeTokens.colors.textMuted
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            val options = listOf(
                BottomSheetOption("Nova receita", "Corrida, plataforma ou outra entrada", Icons.Default.TrendingUp, MotoristAIThemeTokens.colors.success) {
                    onOptionSelected("receita")
                },
                BottomSheetOption("Nova despesa", "Veículo ou família", Icons.Default.TrendingDown, MotoristAIThemeTokens.colors.errorText) {
                    onOptionSelected("despesa")
                },
                BottomSheetOption("Lançamento por voz", "Fale o valor e a categoria", Icons.Default.Mic, MotoristAIThemeTokens.colors.accent) {
                    onOptionSelected("voz")
                }
            )

            options.forEach { option ->
                Surface(
                    onClick = option.onClick,
                    shape = RoundedCornerShape(12.dp),
                    color = MotoristAIThemeTokens.colors.surfaceVariant,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(option.iconColor.copy(alpha = 0.12f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = option.icon,
                                    contentDescription = null,
                                    tint = option.iconColor,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = option.title,
                                    style = MotoristAIThemeTokens.typography.title3,
                                    color = MotoristAIThemeTokens.colors.onSurface
                                )
                                Text(
                                    text = option.subtitle,
                                    style = MotoristAIThemeTokens.typography.caption,
                                    color = MotoristAIThemeTokens.colors.textMuted
                                )
                            }
                        }

                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                            contentDescription = null,
                            tint = MotoristAIThemeTokens.colors.textMuted,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

/**
 * C23 - Diálogo de Confirmação Destrutiva
 */
@Composable
fun DestructiveDialog(
    title: String,
    message: String,
    onConfirm: () -> Unit,
    onDismiss: () -> Unit,
    confirmText: String = "Excluir",
    dismissText: String = "Cancelar"
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = MotoristAIThemeTokens.colors.surface,
        title = {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(MotoristAIThemeTokens.colors.errorContainer),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = null,
                        tint = MotoristAIThemeTokens.colors.errorText,
                        modifier = Modifier.size(24.dp)
                    )
                }
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = title,
                    style = MotoristAIThemeTokens.typography.title2,
                    color = MotoristAIThemeTokens.colors.onSurface
                )
            }
        },
        text = {
            Text(
                text = message,
                style = MotoristAIThemeTokens.typography.bodySmall,
                color = MotoristAIThemeTokens.colors.textMuted,
                modifier = Modifier.fillMaxWidth(),
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
        },
        confirmButton = {
            PrimaryButton(
                text = confirmText,
                onClick = onConfirm,
                fullWidth = true
            )
        },
        dismissButton = {
            SecondaryButton(
                text = dismissText,
                onClick = onDismiss,
                fullWidth = true
            )
        },
        shape = RoundedCornerShape(20.dp)
    )
}

/**
 * C24 - Custom 5-Second Transactional Undo Snackbar State & Host
 */
data class UndoSnackbarData(
    val actionUuid: String,
    val message: String,
    val onUndo: () -> Unit,
    val onTimeout: () -> Unit
)

@Composable
fun UndoSnackbarHost(
    snackbarData: UndoSnackbarData?,
    modifier: Modifier = Modifier
) {
    AnimatedVisibility(
        visible = snackbarData != null,
        enter = slideInVertically(initialOffsetY = { it }) + fadeIn(),
        exit = slideOutVertically(targetOffsetY = { it }) + fadeOut(),
        modifier = modifier
    ) {
        if (snackbarData != null) {
            var progress by remember(snackbarData.actionUuid) { mutableFloatStateOf(1f) }

            LaunchedEffect(snackbarData.actionUuid) {
                val totalSteps = 50
                for (step in totalSteps downTo 0) {
                    progress = step / totalSteps.toFloat()
                    kotlinx.coroutines.delay(100L)
                }
                snackbarData.onTimeout()
            }

            Surface(
                shape = RoundedCornerShape(12.dp),
                color = MotoristAIThemeTokens.colors.surface,
                shadowElevation = 8.dp,
                border = BorderStroke(1.dp, MotoristAIThemeTokens.colors.border),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = snackbarData.message,
                            style = MotoristAIThemeTokens.typography.body,
                            color = MotoristAIThemeTokens.colors.onSurface,
                            modifier = Modifier.weight(1f)
                        )

                        TextActionButton(
                            text = "Desfazer",
                            onClick = snackbarData.onUndo,
                            color = MotoristAIThemeTokens.colors.accent
                        )
                    }

                    LinearProgressIndicator(
                        progress = progress,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(3.dp),
                        color = MotoristAIThemeTokens.colors.accent,
                        trackColor = Color.Transparent
                    )
                }
            }
        }
    }
}
