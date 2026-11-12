package com.motoristai.app.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.tween
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
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.motoristai.app.ui.icons.MotoristAIIcons
import com.motoristai.app.ui.theme.MotoristAIThemeTokens
import com.motoristai.app.ui.undo.UndoController
import kotlinx.coroutines.CoroutineScope

data class BottomSheetOption(
    val title: String,
    val subtitle: String,
    val icon: ImageVector,
    val iconColor: Color,
    val onClick: () -> Unit
)

/**
 * C22 - Modal Bottom Sheet de ações rápidas.
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
                BottomSheetOption(
                    "Nova receita",
                    "Corrida, plataforma ou outra entrada",
                    MotoristAIIcons.TrendingUp,
                    MotoristAIThemeTokens.colors.success
                ) { onOptionSelected("receita") },
                BottomSheetOption(
                    "Nova despesa",
                    "Veículo ou família",
                    MotoristAIIcons.TrendingDown,
                    MotoristAIThemeTokens.colors.errorText
                ) { onOptionSelected("despesa") },
                BottomSheetOption(
                    "Lançamento por voz",
                    "Fale o valor e a categoria",
                    MotoristAIIcons.Mic,
                    MotoristAIThemeTokens.colors.accent
                ) { onOptionSelected("voz") }
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
 * C23 - Diálogo de confirmação destrutiva.
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
            PrimaryButton(text = confirmText, onClick = onConfirm, fullWidth = true)
        },
        dismissButton = {
            SecondaryButton(text = dismissText, onClick = onDismiss, fullWidth = true)
        },
        shape = RoundedCornerShape(20.dp)
    )
}

/**
 * Estado do host de Desfazer. Encapsula o [UndoController] e expõe o que a UI precisa.
 */
@Stable
class UndoHostState(
    scope: CoroutineScope,
    windowMillis: Long = UndoController.DEFAULT_WINDOW_MILLIS
) {
    private val controller = UndoController(scope, windowMillis)

    var message by mutableStateOf<String?>(null)
        private set

    var pendingId by mutableStateOf<String?>(null)
        private set

    val windowMillisValue: Long get() = controller.windowMillis

    /**
     * Arma uma ação desfazível. [onConfirm] devolve `true` quando a confirmação foi aplicada.
     * Sempre chamado **uma única vez**, após a janela ou no dispose.
     */
    fun show(
        id: String,
        message: String,
        onConfirm: suspend () -> Boolean,
        onUndo: suspend () -> Unit,
        onFailed: (Throwable) -> Unit = {}
    ) {
        val armed = controller.arm(
            id = id,
            onConfirm = {
                val result = onConfirm()
                clearIfCurrent(id)
                result
            },
            onUndone = {
                onUndo()
                clearIfCurrent(id)
            },
            onFailed = onFailed
        )
        if (armed) {
            this.message = message
            this.pendingId = id
        }
    }

    fun undo() {
        pendingId?.let { controller.undo(it) }
    }

    /** Dispara a confirmação pendente (dispose, troca de tela, cancelamento). */
    fun confirmAndClear() {
        message = null
        pendingId = null
        controller.confirmAndClear()
    }

    private fun clearIfCurrent(id: String) {
        if (pendingId == id) {
            message = null
            pendingId = null
        }
    }
}

@Composable
fun rememberUndoHostState(
    windowMillis: Long = UndoController.DEFAULT_WINDOW_MILLIS
): UndoHostState {
    val scope = rememberCoroutineScope()
    return remember(windowMillis) { UndoHostState(scope, windowMillis) }
}

/**
 * C24 - Snackbar de Desfazer com janela explícita de 5.000 ms.
 *
 * Não usa `SnackbarHostState.showSnackbar`, cuja menor duração é 4 s.
 * Ao sair da composição (navegação / tela destruída), a ação pendente é confirmada.
 */
@Composable
fun UndoSnackbarHost(
    state: UndoHostState,
    modifier: Modifier = Modifier
) {
    DisposableEffect(state) {
        onDispose { state.confirmAndClear() }
    }

    AnimatedVisibility(
        visible = state.message != null,
        enter = slideInVertically(initialOffsetY = { it }) + fadeIn(),
        exit = slideOutVertically(targetOffsetY = { it }) + fadeOut(),
        modifier = modifier
    ) {
        val currentMessage = state.message
        if (currentMessage != null) {
            val progress = remember(state.pendingId) { Animatable(1f) }

            LaunchedEffect(state.pendingId) {
                progress.snapTo(1f)
                progress.animateTo(
                    targetValue = 0f,
                    animationSpec = tween(
                        durationMillis = state.windowMillisValue.toInt(),
                        easing = LinearEasing
                    )
                )
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
                            text = currentMessage,
                            style = MotoristAIThemeTokens.typography.body,
                            color = MotoristAIThemeTokens.colors.onSurface,
                            modifier = Modifier.weight(1f)
                        )

                        TextActionButton(
                            text = "Desfazer",
                            onClick = { state.undo() },
                            color = MotoristAIThemeTokens.colors.accent
                        )
                    }

                    LinearProgressIndicator(
                        progress = progress.value,
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
