package com.motoristai.app.ui.demo

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.consumeWindowInsets
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.SnackbarDuration
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.motoristai.app.ui.components.MotoristAINavigationBar
import com.motoristai.app.ui.components.NavDestination
import com.motoristai.app.ui.icons.MotoristAIIcons
import com.motoristai.app.ui.screens.HomeScreen
import com.motoristai.app.ui.theme.MotoristAIThemeTokens

/**
 * Harness de demonstração da Home.
 *
 * Contém a barra de controle exclusiva do ambiente de demonstração, a [HomeScreen], a barra
 * inferior com FAB central e o bottom sheet de novo lançamento. Nenhum dado real é gravado.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DemoHomeContent(
    state: DemoHomeState = remember { DemoHomeState() }
) {
    val snackbarHostState = remember { SnackbarHostState() }
    val sheetState = rememberModalBottomSheetState()

    LaunchedEffect(state.message) {
        val current = state.message
        if (current != null) {
            // Duração longa: as mensagens da demonstração são informativas e o emulador de
            // testes é lento, então uma janela curta expira antes da asserção do Compose Test.
            snackbarHostState.showSnackbar(
                message = current,
                duration = SnackbarDuration.Long
            )
            state.message = null
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MotoristAIThemeTokens.colors.background)
            .statusBarsPadding()
    ) {
        DemoControlBar(state)

        // A barra de demonstração já consome o inset superior; evita padding duplicado na Home.
        // A barra inferior fica NO FLUXO (não sobreposta): o conteúdo nunca passa por baixo dela.
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .consumeWindowInsets(WindowInsets.statusBars)
        ) {
            when (state.currentDestination) {
                NavDestination.INICIO -> {
                    HomeScreen(
                        state = state.uiState,
                        onPeriodSelected = state::selectPeriod,
                        onMonthChanged = state::changeMonth,
                        onToggleBalanceVisibility = state::toggleBalanceVisibility,
                        onNotificationClick = {
                            state.message = "As notificações ainda não estão disponíveis nesta demonstração."
                        },
                        onProfileClick = {
                            state.message = "O perfil ainda não está disponível nesta demonstração."
                        },
                        onAiClick = state::onAiClick,
                        onOdometerClick = state::onOdometerClick,
                        onImportClick = state::onImportClick,
                        onTransactionClick = state::onTransactionClick,
                        onViewAllTransactions = state::onViewAllTransactions,
                        onRetry = state::showNormal
                    )
                }
                else -> DemoDestinationPlaceholder(state.currentDestination)
            }

            SnackbarHost(
                hostState = snackbarHostState,
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 80.dp)
                    .padding(horizontal = 16.dp)
            )
        }

        MotoristAINavigationBar(
            currentDestination = state.currentDestination,
            onDestinationSelected = state::selectDestination,
            onFabClick = state::openSheet
        )
    }

    if (state.isSheetOpen) {
        ModalBottomSheet(
            onDismissRequest = state::closeSheet,
            sheetState = sheetState,
            containerColor = MotoristAIThemeTokens.colors.surface,
            modifier = Modifier.testTag("demo_new_entry_sheet")
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .navigationBarsPadding()
                    .padding(horizontal = 16.dp)
                    .padding(bottom = 16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "Novo lançamento",
                    style = MotoristAIThemeTokens.typography.title2,
                    color = MotoristAIThemeTokens.colors.onSurface
                )
                Text(
                    text = "Demonstração — nenhum lançamento é gravado.",
                    style = MotoristAIThemeTokens.typography.caption,
                    color = MotoristAIThemeTokens.colors.textMuted
                )

                Spacer(modifier = Modifier.height(8.dp))

                SheetOption(
                    label = "Nova receita",
                    icon = MotoristAIIcons.TrendingUp,
                    onClick = { state.onSheetOption("Nova receita") }
                )
                SheetOption(
                    label = "Nova despesa",
                    icon = MotoristAIIcons.TrendingDown,
                    onClick = { state.onSheetOption("Nova despesa") }
                )
                SheetOption(
                    label = "Lançamento por voz",
                    icon = MotoristAIIcons.Mic,
                    onClick = { state.onSheetOption("Lançamento por voz") }
                )

                Spacer(modifier = Modifier.height(8.dp))
            }
        }
    }
}

@Composable
private fun SheetOption(
    label: String,
    icon: ImageVector,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .clickable(onClick = onClick)
            .testTag("demo_sheet_option_$label")
            .padding(horizontal = 12.dp, vertical = 16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Start
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = MotoristAIThemeTokens.colors.accent,
            modifier = Modifier.size(20.dp)
        )
        Spacer(modifier = Modifier.size(12.dp))
        Text(
            text = label,
            style = MotoristAIThemeTokens.typography.body,
            color = MotoristAIThemeTokens.colors.onSurface
        )
    }
}

@Composable
private fun DemoControlBar(state: DemoHomeState) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(MotoristAIThemeTokens.colors.surface)
            .padding(horizontal = 8.dp, vertical = 6.dp),
        horizontalArrangement = Arrangement.spacedBy(6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = "DEMO",
            style = MotoristAIThemeTokens.typography.caption,
            color = MotoristAIThemeTokens.colors.textMuted,
            modifier = Modifier.padding(end = 2.dp)
        )
        DemoChip("Normal", "demo_state_normal", onClick = state::showNormal)
        DemoChip("Carregando", "demo_state_loading", onClick = state::showLoading)
        DemoChip("Erro", "demo_state_error", onClick = state::showError)
        DemoChip("Vazio", "demo_state_empty", onClick = state::showEmpty)
    }
}

@Composable
private fun DemoChip(
    label: String,
    tag: String,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(MotoristAIThemeTokens.colors.surfaceVariant)
            .border(1.dp, MotoristAIThemeTokens.colors.border, RoundedCornerShape(8.dp))
            .clickable(onClick = onClick)
            .testTag(tag)
            .padding(horizontal = 8.dp, vertical = 6.dp)
    ) {
        Text(
            text = label,
            style = MotoristAIThemeTokens.typography.caption,
            color = MotoristAIThemeTokens.colors.onSurface
        )
    }
}

@Composable
private fun DemoDestinationPlaceholder(destination: NavDestination) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = destination.title,
            style = MotoristAIThemeTokens.typography.title2,
            color = MotoristAIThemeTokens.colors.onBackground,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Tela não implementada. A navegação inferior existe apenas para validar o contêiner desta demonstração.",
            style = MotoristAIThemeTokens.typography.bodySmall,
            color = MotoristAIThemeTokens.colors.textMuted,
            textAlign = TextAlign.Center,
            modifier = Modifier.testTag("demo_destination_placeholder")
        )
    }
}
