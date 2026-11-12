package com.motoristai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.asPaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowLeft
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.motoristai.app.ui.components.BalanceCard
import com.motoristai.app.ui.components.EmptyState
import com.motoristai.app.ui.components.ErrorState
import com.motoristai.app.ui.components.IndicatorCard
import com.motoristai.app.ui.components.LoadingState
import com.motoristai.app.ui.components.MotoristAIListItem
import com.motoristai.app.ui.navigation.NavigationMetrics
import com.motoristai.app.ui.theme.MotoristAIThemeTokens
import com.motoristai.app.ui.util.Money

data class HomeUiState(
    val userName: String = "Alessandro",
    val selectedPeriod: HomePeriod = HomePeriod.HOJE,
    val currentMonthLabel: String = "Nov/2026",
    val balanceCents: Long = 284_650L,
    val balanceSubtitle: String = "↑ +12,4% em relação a Out/2026",
    val isBalanceVisible: Boolean = true,
    val revenueCents: Long = 732_000L,
    val revenueSubtitle: String = "↑ +8,9% no período",
    val expenseCents: Long = 447_350L,
    val expenseSubtitle: String = "↓ +5,1% no período",
    val goalTitle: String = "Faturamento mensal",
    val goalCurrentCents: Long = 732_000L,
    val goalTargetCents: Long = 1_000_000L,
    val recentTransactions: List<HomeTransactionItem> = listOf(
        HomeTransactionItem("1", "Combustível", "Posto Alpha · 12/11/2026", -18_000L, Icons.Default.ShoppingCart),
        HomeTransactionItem("2", "Corrida (App)", "Uber · 12/11/2026", 42_000L, Icons.Default.Place),
        HomeTransactionItem("3", "Manutenção", "Auto Center · 11/11/2026", -35_000L, Icons.Default.Build)
    ),
    val isLoading: Boolean = false,
    val hasError: Boolean = false
)

enum class HomePeriod { HOJE, MES }

data class HomeTransactionItem(
    val id: String,
    val title: String,
    val subtitle: String,
    val cents: Long,
    val icon: ImageVector
)

/**
 * Tela Início (Home) do MotoristAI — Finalizada (Entrega 03.1.2).
 * Contempla robustez contra fontes ampliadas, responsividade flexível e todos os estados.
 */
@Composable
fun HomeScreen(
    state: HomeUiState,
    onPeriodSelected: (HomePeriod) -> Unit,
    onMonthChanged: (Int) -> Unit,
    onToggleBalanceVisibility: () -> Unit,
    onNotificationClick: () -> Unit,
    onProfileClick: () -> Unit,
    onAiClick: () -> Unit,
    onOdometerClick: () -> Unit,
    onImportClick: () -> Unit,
    onTransactionClick: (String) -> Unit,
    onViewAllTransactions: () -> Unit,
    onRetry: () -> Unit,
    modifier: Modifier = Modifier
) {
    val statusBarHeight = WindowInsets.statusBars.asPaddingValues().calculateTopPadding()
    val bottomInset = WindowInsets.navigationBars.asPaddingValues().calculateBottomPadding()
    val fontScale = LocalDensity.current.fontScale

    Surface(
        modifier = modifier.fillMaxSize(),
        color = MotoristAIThemeTokens.colors.background
    ) {
        BoxWithConstraints(modifier = Modifier.fillMaxSize()) {
            val metrics = NavigationMetrics.compute(
                availableWidthDp = maxWidth.value,
                bottomInsetDp = bottomInset.value,
                fontScale = fontScale
            )

            when {
                state.isLoading -> {
                    LoadingState(
                        message = "Carregando operações do dia...",
                        modifier = Modifier.padding(top = statusBarHeight)
                    )
                }
                state.hasError -> {
                    ErrorState(
                        title = "Falha ao sincronizar dados",
                        message = "Não foi possível carregar as informações do seu painel financeiro.",
                        onRetry = onRetry,
                        modifier = Modifier.padding(top = statusBarHeight)
                    )
                }
                else -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .verticalScroll(rememberScrollState())
                            .padding(top = statusBarHeight + 12.dp, bottom = metrics.contentPaddingBottomDp.dp)
                            .padding(horizontal = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        // 1. Cabeçalho
                        HomeHeader(
                            userName = state.userName,
                            onNotificationClick = onNotificationClick,
                            onProfileClick = onProfileClick
                        )

                        // 2. Seletor de Período
                        PeriodSelectorRow(
                            selectedPeriod = state.selectedPeriod,
                            onPeriodSelected = onPeriodSelected,
                            monthLabel = state.currentMonthLabel,
                            onPreviousMonth = { onMonthChanged(-1) },
                            onNextMonth = { onMonthChanged(1) }
                        )

                        // 3. Card de Saldo
                        BalanceCard(
                            balanceCents = state.balanceCents,
                            isBalanceVisible = state.isBalanceVisible,
                            onToggleVisibility = onToggleBalanceVisibility,
                            subtitleText = state.balanceSubtitle
                        )

                        // 4. Indicadores (Receitas e Despesas)
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                IndicatorCard(
                                    title = "Receitas",
                                    cents = state.revenueCents,
                                    valueColor = MotoristAIThemeTokens.colors.successText,
                                    modifier = Modifier.fillMaxWidth()
                                )
                                Text(
                                    text = state.revenueSubtitle,
                                    style = MotoristAIThemeTokens.typography.caption,
                                    color = MotoristAIThemeTokens.colors.textMuted,
                                    modifier = Modifier.padding(start = 4.dp, top = 2.dp)
                                )
                            }

                            Column(modifier = Modifier.weight(1f)) {
                                IndicatorCard(
                                    title = "Despesas",
                                    cents = state.expenseCents,
                                    valueColor = MotoristAIThemeTokens.colors.errorText,
                                    modifier = Modifier.fillMaxWidth()
                                )
                                Text(
                                    text = state.expenseSubtitle,
                                    style = MotoristAIThemeTokens.typography.caption,
                                    color = MotoristAIThemeTokens.colors.textMuted,
                                    modifier = Modifier.padding(start = 4.dp, top = 2.dp)
                                )
                            }
                        }

                        // 5. Metas
                        HomeGoalSection(
                            title = state.goalTitle,
                            currentCents = state.goalCurrentCents,
                            targetCents = state.goalTargetCents
                        )

                        // 6. Acessos Rápidos (Flexíveis para fontes grandes)
                        HomeQuickAccessSection(
                            onAiClick = onAiClick,
                            onOdometerClick = onOdometerClick,
                            onImportClick = onImportClick
                        )

                        // 7. Movimentações Recentes ou Estado Vazio
                        if (state.recentTransactions.isEmpty()) {
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = MotoristAIThemeTokens.colors.surface),
                                border = androidx.compose.foundation.BorderStroke(1.dp, MotoristAIThemeTokens.colors.border)
                            ) {
                                EmptyState(
                                    title = "Nenhuma movimentação hoje",
                                    description = "Os lançamentos do dia aparecerão aqui assim que forem registrados.",
                                    modifier = Modifier.height(180.dp)
                                )
                            }
                        } else {
                            HomeTransactionsSection(
                                transactions = state.recentTransactions,
                                onTransactionClick = onTransactionClick,
                                onViewAll = onViewAllTransactions
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun HomeHeader(
    userName: String,
    onNotificationClick: () -> Unit,
    onProfileClick: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(MotoristAIThemeTokens.colors.primary),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(22.dp)
                )
            }
            Column {
                Text(
                    text = "MotoristAI",
                    style = MotoristAIThemeTokens.typography.caption,
                    color = MotoristAIThemeTokens.colors.textMuted
                )
                Text(
                    text = "Início",
                    style = MotoristAIThemeTokens.typography.title1,
                    color = MotoristAIThemeTokens.colors.onBackground
                )
            }
        }

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            IconButton(
                onClick = onNotificationClick,
                modifier = Modifier
                    .size(48.dp) // Alvo mínimo de 48 dp
                    .clip(CircleShape)
                    .background(MotoristAIThemeTokens.colors.surface)
                    .border(1.dp, MotoristAIThemeTokens.colors.border, CircleShape)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = Icons.Default.Notifications,
                        contentDescription = "Notificações",
                        tint = MotoristAIThemeTokens.colors.onSurfaceVariant,
                        modifier = Modifier.size(20.dp)
                    )
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(MotoristAIThemeTokens.colors.errorText)
                            .align(Alignment.TopEnd)
                    )
                }
            }

            IconButton(
                onClick = onProfileClick,
                modifier = Modifier
                    .size(48.dp) // Alvo mínimo de 48 dp
                    .clip(CircleShape)
                    .background(MotoristAIThemeTokens.colors.surface)
                    .border(1.dp, MotoristAIThemeTokens.colors.border, CircleShape)
            ) {
                Icon(
                    imageVector = Icons.Default.Person,
                    contentDescription = "Perfil de $userName",
                    tint = MotoristAIThemeTokens.colors.onSurfaceVariant,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}

@Composable
private fun PeriodSelectorRow(
    selectedPeriod: HomePeriod,
    onPeriodSelected: (HomePeriod) -> Unit,
    monthLabel: String,
    onPreviousMonth: () -> Unit,
    onNextMonth: () -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                modifier = Modifier
                    .height(40.dp) // Alvo mínimo adequado
                    .clip(RoundedCornerShape(10.dp))
                    .background(MotoristAIThemeTokens.colors.surfaceVariant)
                    .border(1.dp, MotoristAIThemeTokens.colors.border, RoundedCornerShape(10.dp))
                    .padding(2.dp)
            ) {
                val isHoje = selectedPeriod == HomePeriod.HOJE
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .height(36.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isHoje) MotoristAIThemeTokens.colors.accentSubtle else Color.Transparent)
                        .clickable { onPeriodSelected(HomePeriod.HOJE) }
                        .semantics { contentDescription = "Período Hoje, ${if (isHoje) "selecionado" else ""}" },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Hoje",
                        style = MotoristAIThemeTokens.typography.label,
                        color = if (isHoje) MotoristAIThemeTokens.colors.primary else MotoristAIThemeTokens.colors.onSurfaceVariant
                    )
                }

                val isMes = selectedPeriod == HomePeriod.MES
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .height(36.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isMes) MotoristAIThemeTokens.colors.accentSubtle else Color.Transparent)
                        .clickable { onPeriodSelected(HomePeriod.MES) }
                        .semantics { contentDescription = "Período Mês, ${if (isMes) "selecionado" else ""}" },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Mês",
                        style = MotoristAIThemeTokens.typography.label,
                        color = if (isMes) MotoristAIThemeTokens.colors.primary else MotoristAIThemeTokens.colors.onSurfaceVariant
                    )
                }
            }

            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .height(40.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(MotoristAIThemeTokens.colors.surface)
                    .border(1.dp, MotoristAIThemeTokens.colors.border, RoundedCornerShape(10.dp))
                    .padding(horizontal = 4.dp)
            ) {
                IconButton(onClick = onPreviousMonth, modifier = Modifier.size(36.dp)) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.KeyboardArrowLeft,
                        contentDescription = "Mês anterior",
                        tint = MotoristAIThemeTokens.colors.textMuted,
                        modifier = Modifier.size(18.dp)
                    )
                }
                Text(
                    text = monthLabel,
                    style = MotoristAIThemeTokens.typography.label,
                    color = MotoristAIThemeTokens.colors.onSurface,
                    modifier = Modifier.padding(horizontal = 4.dp)
                )
                IconButton(onClick = onNextMonth, modifier = Modifier.size(36.dp)) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                        contentDescription = "Próximo mês",
                        tint = MotoristAIThemeTokens.colors.textMuted,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun HomeGoalSection(
    title: String,
    currentCents: Long,
    targetCents: Long
) {
    val progress = if (targetCents > 0) (currentCents.toFloat() / targetCents.toFloat()).coerceIn(0f, 1f) else 0f
    val percent = (progress * 100).toInt()

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MotoristAIThemeTokens.colors.surface),
        border = androidx.compose.foundation.BorderStroke(1.dp, MotoristAIThemeTokens.colors.border)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(28.dp)
                            .clip(CircleShape)
                            .background(MotoristAIThemeTokens.colors.accentSubtle),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Star,
                            contentDescription = null,
                            tint = MotoristAIThemeTokens.colors.accent,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                    Column {
                        Text(
                            text = "Metas",
                            style = MotoristAIThemeTokens.typography.title3,
                            color = MotoristAIThemeTokens.colors.onSurface
                        )
                        Text(
                            text = title,
                            style = MotoristAIThemeTokens.typography.caption,
                            color = MotoristAIThemeTokens.colors.textMuted
                        )
                    }
                }

                Text(
                    text = "$percent%",
                    style = MotoristAIThemeTokens.typography.label,
                    color = MotoristAIThemeTokens.colors.primary
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = Money.format(currentCents),
                    style = MotoristAIThemeTokens.typography.bodySmall,
                    color = MotoristAIThemeTokens.colors.onSurface
                )
                Text(
                    text = "de ${Money.format(targetCents)}",
                    style = MotoristAIThemeTokens.typography.caption,
                    color = MotoristAIThemeTokens.colors.textMuted
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            LinearProgressIndicator(
                progress = progress,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(RoundedCornerShape(3.dp)),
                color = MotoristAIThemeTokens.colors.primary,
                trackColor = MotoristAIThemeTokens.colors.border
            )
        }
    }
}

@Composable
private fun HomeQuickAccessSection(
    onAiClick: () -> Unit,
    onOdometerClick: () -> Unit,
    onImportClick: () -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(
            text = "Acessos rápidos",
            style = MotoristAIThemeTokens.typography.title2,
            color = MotoristAIThemeTokens.colors.onBackground
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            QuickAccessCard(
                title = "IA MotoristAI",
                subtitle = "Análises e insights",
                icon = Icons.Default.Star,
                tintColor = Color(0xFFA78BFA),
                onClick = onAiClick,
                modifier = Modifier.weight(1f)
            )
            QuickAccessCard(
                title = "Odômetro",
                subtitle = "Controlar km",
                icon = Icons.Default.Build,
                tintColor = MotoristAIThemeTokens.colors.accent,
                onClick = onOdometerClick,
                modifier = Modifier.weight(1f)
            )
            QuickAccessCard(
                title = "Importação",
                subtitle = "Extratos e ganhos",
                icon = Icons.Default.ShoppingCart,
                tintColor = MotoristAIThemeTokens.colors.success,
                onClick = onImportClick,
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Composable
private fun QuickAccessCard(
    title: String,
    subtitle: String,
    icon: ImageVector,
    tintColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .clickable(onClick = onClick)
            .wrapContentHeight(), // Altura flexível para suportar fontes ampliadas sem sobreposição
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MotoristAIThemeTokens.colors.surface),
        border = androidx.compose.foundation.BorderStroke(1.dp, MotoristAIThemeTokens.colors.border)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .background(tintColor.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = tintColor,
                    modifier = Modifier.size(18.dp)
                )
            }

            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
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
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }
    }
}

@Composable
private fun HomeTransactionsSection(
    transactions: List<HomeTransactionItem>,
    onTransactionClick: (String) -> Unit,
    onViewAll: () -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Movimentações recentes",
                style = MotoristAIThemeTokens.typography.title2,
                color = MotoristAIThemeTokens.colors.onBackground
            )

            Text(
                text = "Ver todas >",
                style = MotoristAIThemeTokens.typography.label,
                color = MotoristAIThemeTokens.colors.accent,
                modifier = Modifier
                    .clickable(onClick = onViewAll)
                    .padding(4.dp)
            )
        }

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MotoristAIThemeTokens.colors.surface),
            border = androidx.compose.foundation.BorderStroke(1.dp, MotoristAIThemeTokens.colors.border)
        ) {
            Column {
                transactions.forEachIndexed { index, tx ->
                    val valueColor = if (tx.cents >= 0) MotoristAIThemeTokens.colors.successText else MotoristAIThemeTokens.colors.errorText
                    MotoristAIListItem(
                        title = tx.title,
                        subtitle = tx.subtitle,
                        cents = tx.cents,
                        valueColor = valueColor,
                        onClick = { onTransactionClick(tx.id) },
                        icon = tx.icon,
                        showChevron = true
                    )
                    if (index < transactions.lastIndex) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp)
                                .height(1.dp)
                                .background(MotoristAIThemeTokens.colors.border)
                        )
                    }
                }
            }
        }
    }
}
