package com.motoristai.app.ui.demo

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Build
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import com.motoristai.app.ui.components.NavDestination
import com.motoristai.app.ui.icons.MotoristAIIcons
import com.motoristai.app.ui.screens.HomePeriod
import com.motoristai.app.ui.screens.HomeTransactionItem
import com.motoristai.app.ui.screens.HomeUiState
import java.util.Calendar

/**
 * Controlador de estado **exclusivo da demonstração**.
 *
 * Não acessa banco de dados, rede, autenticação ou qualquer regra financeira: todos os valores
 * são fictícios e derivados de constantes locais. Serve apenas para exercitar a Home nativa
 * (`HomeScreen`) em um emulador/dispositivo.
 */
class DemoHomeState(
    baseCalendar: Calendar = Calendar.getInstance()
) {

    private data class Figures(
        val revenue: Long,
        val expense: Long,
        val goalTarget: Long,
        val goalTitle: String
    )

    private val baseMonth: Int = baseCalendar.get(Calendar.MONTH)
    private val baseYear: Int = baseCalendar.get(Calendar.YEAR)

    var period by mutableStateOf(HomePeriod.HOJE)
        private set

    /** Deslocamento em meses em relação ao mês corrente da demonstração (0 = mês atual). */
    var monthOffset by mutableStateOf(0)
        private set

    var isBalanceVisible by mutableStateOf(true)
        private set

    var isLoading by mutableStateOf(false)
        private set

    var hasError by mutableStateOf(false)
        private set

    var isEmpty by mutableStateOf(false)
        private set

    /** Mensagem de indisponibilidade / feedback exibida na demonstração. */
    var message by mutableStateOf<String?>(null)

    var isSheetOpen by mutableStateOf(false)
        private set

    var currentDestination by mutableStateOf(NavDestination.INICIO)
        private set

    // ─────────────────────────── Ações de período ───────────────────────────

    fun selectPeriod(value: HomePeriod) {
        period = value
    }

    fun changeMonth(delta: Int) {
        monthOffset += delta
    }

    fun toggleBalanceVisibility() {
        isBalanceVisible = !isBalanceVisible
    }

    fun selectDestination(destination: NavDestination) {
        currentDestination = destination
    }

    fun openSheet() {
        isSheetOpen = true
    }

    fun closeSheet() {
        isSheetOpen = false
    }

    // ─────────────────────────── Estados de demonstração ───────────────────────────

    fun showNormal() {
        isLoading = false
        hasError = false
        isEmpty = false
    }

    fun showLoading() {
        isLoading = true
        hasError = false
    }

    fun showError() {
        isLoading = false
        hasError = true
    }

    fun showEmpty() {
        isLoading = false
        hasError = false
        isEmpty = true
    }

    // ─────────────────────────── Acessos rápidos ───────────────────────────

    fun onAiClick() {
        message = "IA MotoristAI ainda não está disponível nesta demonstração."
    }

    fun onOdometerClick() {
        message = "O odômetro ainda não está disponível nesta demonstração."
    }

    fun onImportClick() {
        message = "A importação de extratos ainda não está disponível nesta demonstração."
    }

    fun onTransactionClick(id: String) {
        message = "Movimentação $id selecionada (demonstração, nenhum dado foi alterado)."
    }

    fun onViewAllTransactions() {
        message = "A lista completa de movimentações virá em uma próxima entrega."
    }

    fun onSheetOption(label: String) {
        isSheetOpen = false
        message = "$label indisponível nesta demonstração (nada foi gravado)."
    }

    // ─────────────────────────── Dados fictícios ───────────────────────────

    val monthLabel: String
        get() = labelFor(monthOffset)

    val previousMonthLabel: String
        get() = labelFor(monthOffset - 1)

    private fun labelFor(offset: Int): String {
        val total = baseMonth + offset
        val year = baseYear + Math.floorDiv(total, 12)
        val month = Math.floorMod(total, 12)
        return "${MONTH_NAMES[month]}/$year"
    }

    private fun figuresFor(period: HomePeriod, growth: Float): Figures =
        if (period == HomePeriod.HOJE) {
            Figures(
                revenue = (59_200L * growth).toLong(),
                expense = (34_850L * growth).toLong(),
                goalTarget = 500_000L,
                goalTitle = "Ganhos líquidos do dia"
            )
        } else {
            Figures(
                revenue = (732_000L * growth).toLong(),
                expense = (447_350L * growth).toLong(),
                goalTarget = 1_000_000L,
                goalTitle = "Faturamento mensal"
            )
        }

    val uiState: HomeUiState
        get() {
            val growth = 1f + (monthOffset * 0.07f)
            val figures = figuresFor(period, growth)

            return HomeUiState(
                userName = "Alessandro",
                selectedPeriod = period,
                currentMonthLabel = monthLabel,
                balanceCents = figures.revenue - figures.expense,
                balanceSubtitle = if (period == HomePeriod.HOJE) {
                    "↑ +12,4% em relação a ontem"
                } else {
                    "↑ +12,4% em relação a $previousMonthLabel"
                },
                isBalanceVisible = isBalanceVisible,
                revenueCents = figures.revenue,
                revenueSubtitle = "↑ +8,9% no período",
                expenseCents = figures.expense,
                expenseSubtitle = "↑ +5,1% no período",
                goalTitle = figures.goalTitle,
                goalCurrentCents = figures.revenue,
                goalTargetCents = figures.goalTarget,
                recentTransactions = if (isEmpty) emptyList() else demoTransactions(),
                isLoading = isLoading,
                hasError = hasError
            )
        }

    private fun demoTransactions(): List<HomeTransactionItem> {
        val day = 12
        return if (period == HomePeriod.HOJE) {
            listOf(
                HomeTransactionItem("tx-1", "Corrida (App)", "Hoje, 18:52", 4_290L, MotoristAIIcons.Car),
                HomeTransactionItem("tx-2", "Combustível", "Hoje, 16:24", -12_000L, MotoristAIIcons.Fuel),
                HomeTransactionItem("tx-3", "Alimentação", "Hoje, 13:16", -2_850L, MotoristAIIcons.Food)
            )
        } else {
            listOf(
                HomeTransactionItem("tx-4", "Combustível", "Posto Alpha · $day/$monthLabel", -18_000L, MotoristAIIcons.Fuel),
                HomeTransactionItem("tx-5", "Corrida (App)", "Uber · $monthLabel", 42_000L, MotoristAIIcons.Car),
                HomeTransactionItem("tx-6", "Manutenção", "Auto Center · $monthLabel", -35_000L, Icons.Default.Build)
            )
        }
    }

    private companion object {
        val MONTH_NAMES = listOf(
            "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
            "Jul", "Ago", "Set", "Out", "Nov", "Dez"
        )
    }
}
