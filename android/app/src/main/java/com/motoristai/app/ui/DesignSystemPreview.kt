package com.motoristai.app.ui

import android.content.res.Configuration
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.motoristai.app.ui.components.BalanceCard
import com.motoristai.app.ui.components.BarChart
import com.motoristai.app.ui.components.ContextualTip
import com.motoristai.app.ui.components.DayHeader
import com.motoristai.app.ui.components.DonutChart
import com.motoristai.app.ui.components.DonutSliceData
import com.motoristai.app.ui.components.EmptyState
import com.motoristai.app.ui.components.GoalCard
import com.motoristai.app.ui.components.IndicatorCard
import com.motoristai.app.ui.components.IndicatorCardData
import com.motoristai.app.ui.components.IndicatorGroup
import com.motoristai.app.ui.components.LineChart
import com.motoristai.app.ui.components.MotoristAICheckbox
import com.motoristai.app.ui.components.MotoristAIDropdown
import com.motoristai.app.ui.components.MotoristAIFab
import com.motoristai.app.ui.components.MotoristAIFilterChip
import com.motoristai.app.ui.components.MotoristAIListItem
import com.motoristai.app.ui.components.MotoristAIMultiChip
import com.motoristai.app.ui.components.MotoristAINavigationBar
import com.motoristai.app.ui.components.MotoristAIRadioButton
import com.motoristai.app.ui.components.MotoristAISegmentedControl
import com.motoristai.app.ui.components.MotoristAISwitch
import com.motoristai.app.ui.components.MotoristAITextField
import com.motoristai.app.ui.components.NavDestination
import com.motoristai.app.ui.components.PasswordTextField
import com.motoristai.app.ui.components.PrimaryButton
import com.motoristai.app.ui.components.SearchTextField
import com.motoristai.app.ui.components.SecondaryButton
import com.motoristai.app.ui.components.SectionDivider
import com.motoristai.app.ui.components.SkeletonItem
import com.motoristai.app.ui.components.TextActionButton
import com.motoristai.app.ui.components.TonalButton
import com.motoristai.app.ui.components.UndoSnackbarHost
import com.motoristai.app.ui.components.rememberUndoHostState
import com.motoristai.app.ui.screens.HomePeriod
import com.motoristai.app.ui.screens.HomeScreen
import com.motoristai.app.ui.screens.HomeUiState
import com.motoristai.app.ui.theme.MotoristAITheme
import com.motoristai.app.ui.theme.MotoristAIThemeTokens

@Composable
fun DesignSystemGallery() {
    val scrollState = rememberScrollState()

    var textValue by remember { mutableStateOf("R$ 250,00") }
    var textErrorValue by remember { mutableStateOf("") }
    var isBalanceVisible by remember { mutableStateOf(true) }
    var selectedSegment by remember { mutableIntStateOf(0) }
    var checkboxState by remember { mutableStateOf(true) }
    var radioState by remember { mutableStateOf(true) }
    var switchState by remember { mutableStateOf(true) }
    var currentNav by remember { mutableStateOf(NavDestination.INICIO) }
    var selectedCategory by remember { mutableStateOf("Veículo") }

    val undoState = rememberUndoHostState()

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MotoristAIThemeTokens.colors.background
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                text = "MotoristAI — Design System",
                style = MotoristAIThemeTokens.typography.display,
                color = MotoristAIThemeTokens.colors.onBackground
            )
            Text(
                text = "Componentes nativos Material 3 · valor monetário sem truncamento",
                style = MotoristAIThemeTokens.typography.bodySmall,
                color = MotoristAIThemeTokens.colors.textMuted
            )

            SectionDivider()

            Text(
                text = "1. Botões",
                style = MotoristAIThemeTokens.typography.title2,
                color = MotoristAIThemeTokens.colors.onBackground
            )
            PrimaryButton(text = "Botão Primário", onClick = {})
            SecondaryButton(text = "Botão Secundário", onClick = {})
            TonalButton(text = "Botão Tonal", onClick = {})
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                TextActionButton(text = "Botão de Texto", onClick = {})
                MotoristAIFab(onClick = {})
            }

            SectionDivider()

            Text(
                text = "2. Campos e Formulário",
                style = MotoristAIThemeTokens.typography.title2,
                color = MotoristAIThemeTokens.colors.onBackground
            )

            MotoristAITextField(
                value = textValue,
                onValueChange = { textValue = it },
                label = "Valor",
                isRequired = true
            )

            MotoristAITextField(
                value = textErrorValue,
                onValueChange = { textErrorValue = it },
                label = "Valor do combustível",
                errorMessage = if (textErrorValue.isEmpty()) "Informe um valor válido" else null,
                isRequired = true
            )

            PasswordTextField(
                value = "123456",
                onValueChange = {},
                label = "Senha de acesso"
            )

            SearchTextField(query = "", onQueryChange = {})

            MotoristAIDropdown(
                label = "Categoria",
                items = listOf("Veículo", "Moradia", "Alimentação", "Saúde"),
                selectedItem = selectedCategory,
                onItemSelected = { selectedCategory = it },
                itemLabel = { it }
            )

            MotoristAISegmentedControl(
                options = listOf("Veículo", "Família"),
                selectedIndex = selectedSegment,
                onOptionSelected = { selectedSegment = it }
            )

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                MotoristAIFilterChip(text = "Todas", selected = true, onClick = {})
                MotoristAIFilterChip(text = "Receitas", selected = false, onClick = {})
                MotoristAIMultiChip(text = "Combustível", onRemove = {})
            }

            MotoristAICheckbox(
                checked = checkboxState,
                onCheckedChange = { checkboxState = it },
                label = "Lembrar deste pagamento"
            )

            MotoristAIRadioButton(
                selected = radioState,
                onClick = { radioState = !radioState },
                label = "Opção selecionada"
            )

            MotoristAISwitch(
                checked = switchState,
                onCheckedChange = { switchState = it },
                label = "Notificações ativas"
            )

            ContextualTip(text = "O odômetro atualiza os cálculos de custo por km em Relatórios.")

            SectionDivider()

            Text(
                text = "3. Cards e Indicadores",
                style = MotoristAIThemeTokens.typography.title2,
                color = MotoristAIThemeTokens.colors.onBackground
            )

            BalanceCard(
                balanceCents = 248_000L,
                isBalanceVisible = isBalanceVisible,
                onToggleVisibility = { isBalanceVisible = !isBalanceVisible }
            )

            IndicatorGroup(
                items = listOf(
                    IndicatorCardData("Receitas", 165_000L, MotoristAIThemeTokens.colors.successText),
                    IndicatorCardData("Despesas", 83_000L, MotoristAIThemeTokens.colors.errorText),
                    IndicatorCardData("Saldo", 82_000L, MotoristAIThemeTokens.colors.onSurface)
                )
            )

            GoalCard(
                title = "Reserva de emergência",
                targetCents = 900_000L,
                progressFraction = 0.68f
            )

            DayHeader(dateFormatted = "Hoje", subtotalFormatted = "− R$ 250,00")

            MotoristAIListItem(
                title = "Combustível",
                subtitle = "Posto Shell · Veículo",
                cents = -25_000L,
                valueColor = MotoristAIThemeTokens.colors.errorText,
                onClick = {},
                icon = Icons.Default.ShoppingCart
            )

            MotoristAIListItem(
                title = "Corrida (Uber)",
                subtitle = "12,4 km · Receita",
                cents = 7_800L,
                valueColor = MotoristAIThemeTokens.colors.successText,
                onClick = {},
                icon = Icons.Default.Place
            )

            SectionDivider()

            Text(
                text = "4. Valores extremos (sem truncamento)",
                style = MotoristAIThemeTokens.typography.title2,
                color = MotoristAIThemeTokens.colors.onBackground
            )

            IndicatorGroup(
                items = listOf(
                    IndicatorCardData("Negativo", -123_456L, MotoristAIThemeTokens.colors.errorText),
                    IndicatorCardData("Centavos", 1L, MotoristAIThemeTokens.colors.onSurface),
                    IndicatorCardData("Milhão", 987_654_321L, MotoristAIThemeTokens.colors.onSurface)
                )
            )

            SectionDivider()

            Text(
                text = "5. Gráficos (Canvas)",
                style = MotoristAIThemeTokens.typography.title2,
                color = MotoristAIThemeTokens.colors.onBackground
            )

            DonutChart(
                slices = listOf(
                    DonutSliceData("Combustível", 830f, "42%"),
                    DonutSliceData("Manutenção", 560f, "28%"),
                    DonutSliceData("Pedágio", 360f, "18%"),
                    DonutSliceData("Outros", 240f, "12%")
                ),
                totalFormatted = "R$ 830,00"
            )

            BarChart(
                values = listOf(4200f, 5800f, 6100f, 5900f, 6800f, 8420f),
                labels = listOf("Mai", "Jun", "Jul", "Ago", "Set", "Out")
            )

            LineChart(
                revenueValues = listOf(4000f, 5200f, 6000f, 5800f, 7200f, 8420f),
                expenseValues = listOf(3000f, 4100f, 4800f, 4500f, 5200f, 6002f)
            )

            SectionDivider()

            Text(
                text = "6. Feedbacks (Desfazer 5.000 ms)",
                style = MotoristAIThemeTokens.typography.title2,
                color = MotoristAIThemeTokens.colors.onBackground
            )

            PrimaryButton(
                text = "Simular lançamento salvo",
                onClick = {
                    undoState.show(
                        id = "demo-${System.currentTimeMillis()}",
                        message = "Lançamento salvo com sucesso!",
                        onConfirm = { true },
                        onUndo = {}
                    )
                }
            )

            UndoSnackbarHost(state = undoState)

            SectionDivider()

            Text(
                text = "7. Estados e Skeleton",
                style = MotoristAIThemeTokens.typography.title2,
                color = MotoristAIThemeTokens.colors.onBackground
            )

            SkeletonItem(height = 64.dp)
            SkeletonItem(height = 96.dp)

            EmptyState(modifier = Modifier.height(220.dp))

            SectionDivider()

            Text(
                text = "8. Barra de Navegação + FAB Central",
                style = MotoristAIThemeTokens.typography.title2,
                color = MotoristAIThemeTokens.colors.onBackground
            )

            MotoristAINavigationBar(
                currentDestination = currentNav,
                onDestinationSelected = { currentNav = it },
                onFabClick = {}
            )

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@Preview(name = "Light Mode - Galeria", showBackground = true, uiMode = Configuration.UI_MODE_NIGHT_NO, widthDp = 360)
@Composable
fun DesignSystemGalleryLightPreview() {
    MotoristAITheme(darkTheme = false) {
        DesignSystemGallery()
    }
}

@Preview(name = "Dark Mode - Galeria", showBackground = true, uiMode = Configuration.UI_MODE_NIGHT_YES, widthDp = 360)
@Composable
fun DesignSystemGalleryDarkPreview() {
    MotoristAITheme(darkTheme = true) {
        DesignSystemGallery()
    }
}

@Preview(name = "Light Mode - Tela Início", showBackground = true, uiMode = Configuration.UI_MODE_NIGHT_NO, widthDp = 360, heightDp = 800)
@Composable
fun HomeScreenLightPreview() {
    MotoristAITheme(darkTheme = false) {
        HomeScreen(
            state = HomeUiState(selectedPeriod = HomePeriod.HOJE),
            onPeriodSelected = {},
            onMonthChanged = {},
            onToggleBalanceVisibility = {},
            onNotificationClick = {},
            onProfileClick = {},
            onAiClick = {},
            onOdometerClick = {},
            onImportClick = {},
            onTransactionClick = {},
            onViewAllTransactions = {},
            onFabClick = {},
            onDestinationSelected = {}
        )
    }
}

@Preview(name = "Dark Mode - Tela Início", showBackground = true, uiMode = Configuration.UI_MODE_NIGHT_YES, widthDp = 360, heightDp = 800)
@Composable
fun HomeScreenDarkPreview() {
    MotoristAITheme(darkTheme = true) {
        HomeScreen(
            state = HomeUiState(selectedPeriod = HomePeriod.MES, balanceCents = 284_650L),
            onPeriodSelected = {},
            onMonthChanged = {},
            onToggleBalanceVisibility = {},
            onNotificationClick = {},
            onProfileClick = {},
            onAiClick = {},
            onOdometerClick = {},
            onImportClick = {},
            onTransactionClick = {},
            onViewAllTransactions = {},
            onFabClick = {},
            onDestinationSelected = {}
        )
    }
}
