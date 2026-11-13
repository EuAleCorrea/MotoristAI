package com.motoristai.app.ui.demo

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.hasText
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performScrollTo
import org.junit.Rule
import org.junit.Test

/**
 * Testes instrumentados (Compose UI Test) da Home nativa renderizada em [DemoHomeActivity].
 *
 * Todos os testes interagem com a árvore de semântica renderizada — não há simulação de
 * callbacks sobre objetos de estado.
 */
class DemoHomeUiTest {

    @get:Rule
    val composeRule = createAndroidComposeRule<DemoHomeActivity>()

    private fun waitForIdle() = composeRule.waitForIdle()

    // 1 ──────────────────────────────────────────────────────────────────────
    @Test
    fun home_renders_main_blocks() {
        waitForIdle()
        // "Início" também é o rótulo da barra inferior; o cabeçalho usa uma tag dedicada.
        composeRule.onNodeWithTag("home_header_title").assertIsDisplayed()
        composeRule.onNodeWithText("Resumo das suas operações").assertIsDisplayed()
        composeRule.onNodeWithText("Acessos rápidos").performScrollTo().assertIsDisplayed()
        composeRule.onNodeWithText("Movimentações recentes").performScrollTo().assertIsDisplayed()
        composeRule.onNodeWithTag("demo_state_normal").assertIsDisplayed()
    }

    // 2 ──────────────────────────────────────────────────────────────────────
    @Test
    fun period_selector_switches_between_hoje_and_mes() {
        waitForIdle()

        // Estado inicial: hoje → "Ganhos líquidos do dia"
        composeRule.onNodeWithText("Ganhos líquidos do dia").assertIsDisplayed()

        composeRule.onNodeWithText("Mês").performClick()
        waitForIdle()
        composeRule.onNodeWithText("Faturamento mensal").assertIsDisplayed()

        composeRule.onNodeWithText("Hoje").performClick()
        waitForIdle()
        composeRule.onNodeWithText("Ganhos líquidos do dia").assertIsDisplayed()
    }

    // 3 ──────────────────────────────────────────────────────────────────────
    @Test
    fun month_navigation_changes_the_month_label() {
        waitForIdle()

        composeRule.onNodeWithText(labelFor(0)).assertIsDisplayed()

        composeRule.onNodeWithContentDescription("Próximo mês").performClick()
        waitForIdle()
        composeRule.onNodeWithText(labelFor(1)).assertIsDisplayed()

        composeRule.onNodeWithContentDescription("Mês anterior").performClick()
        waitForIdle()
        composeRule.onNodeWithText(labelFor(0)).assertIsDisplayed()
    }

    private fun labelFor(offset: Int): String {
        val calendar = java.util.Calendar.getInstance()
        calendar.add(java.util.Calendar.MONTH, offset)
        val names = listOf(
            "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
            "Jul", "Ago", "Set", "Out", "Nov", "Dez"
        )
        return "${names[calendar.get(java.util.Calendar.MONTH)]}/${calendar.get(java.util.Calendar.YEAR)}"
    }

    // 4 ──────────────────────────────────────────────────────────────────────
    @Test
    fun balance_visibility_toggles() {
        waitForIdle()

        composeRule.onNodeWithContentDescription("Ocultar saldo").assertIsDisplayed()
        composeRule.onNodeWithContentDescription("Ocultar saldo").performClick()
        waitForIdle()

        composeRule.onNodeWithContentDescription("Mostrar saldo").assertIsDisplayed()

        composeRule.onNodeWithContentDescription("Mostrar saldo").performClick()
        waitForIdle()
        composeRule.onNodeWithContentDescription("Ocultar saldo").assertIsDisplayed()
    }

    // 5 ──────────────────────────────────────────────────────────────────────
    @Test
    fun quick_access_buttons_report_unavailability() {
        waitForIdle()

        composeRule.onNodeWithText("IA MotoristAI").performScrollTo().performClick()
        waitForIdle()
        composeRule.onNodeWithText("IA MotoristAI ainda não está disponível nesta demonstração.")
            .assertIsDisplayed()
    }

    @Test
    fun quick_access_odometer_reports_unavailability() {
        waitForIdle()
        composeRule.onNodeWithText("Odômetro").performScrollTo().performClick()
        waitForIdle()
        composeRule.onNodeWithText("O odômetro ainda não está disponível nesta demonstração.")
            .assertIsDisplayed()
    }

    @Test
    fun quick_access_import_reports_unavailability() {
        waitForIdle()
        composeRule.onNodeWithText("Importação").performScrollTo().performClick()
        waitForIdle()
        composeRule.onNodeWithText("A importação de extratos ainda não está disponível nesta demonstração.")
            .assertIsDisplayed()
    }

    // 6 ──────────────────────────────────────────────────────────────────────
    @Test
    fun selecting_a_transaction_triggers_the_callback() {
        waitForIdle()
        composeRule.onNodeWithText("Combustível").performScrollTo().performClick()
        waitForIdle()
        composeRule.onNode(hasText("selecionada", substring = true)).assertIsDisplayed()
    }

    // 7 ──────────────────────────────────────────────────────────────────────
    @Test
    fun view_all_transactions_triggers_the_callback() {
        waitForIdle()
        composeRule.onNodeWithText("Ver todas >").performScrollTo().performClick()
        waitForIdle()
        composeRule.onNodeWithText("A lista completa de movimentações virá em uma próxima entrega.")
            .assertIsDisplayed()
    }

    // 8 ──────────────────────────────────────────────────────────────────────
    @Test
    fun fab_opens_and_closes_the_new_entry_sheet() {
        waitForIdle()

        composeRule.onNodeWithContentDescription("Novo lançamento").performClick()
        waitForIdle()

        composeRule.onNodeWithText("Novo lançamento").assertIsDisplayed()
        composeRule.onNodeWithText("Nova receita").assertIsDisplayed()
        composeRule.onNodeWithText("Nova despesa").assertIsDisplayed()
        composeRule.onNodeWithText("Lançamento por voz").assertIsDisplayed()

        composeRule.onNodeWithTag("demo_sheet_option_Nova receita").performClick()
        waitForIdle()

        composeRule.onNodeWithText("Nova receita indisponível nesta demonstração (nada foi gravado).")
            .assertIsDisplayed()
    }

    // 9 ──────────────────────────────────────────────────────────────────────
    @Test
    fun loading_state_is_displayed() {
        waitForIdle()
        composeRule.onNodeWithTag("demo_state_loading").performClick()
        waitForIdle()
        composeRule.onNodeWithText("Carregando operações do dia...").assertIsDisplayed()
    }

    // 10 ─────────────────────────────────────────────────────────────────────
    @Test
    fun error_state_is_displayed_and_retry_restores_content() {
        waitForIdle()
        composeRule.onNodeWithTag("demo_state_error").performClick()
        waitForIdle()

        composeRule.onNodeWithText("Falha ao sincronizar dados").assertIsDisplayed()
        composeRule.onNodeWithText("Tentar novamente").performClick()
        waitForIdle()

        composeRule.onNodeWithText("Acessos rápidos").assertIsDisplayed()
    }

    // 11 ─────────────────────────────────────────────────────────────────────
    @Test
    fun empty_state_is_displayed() {
        waitForIdle()
        composeRule.onNodeWithTag("demo_state_empty").performClick()
        waitForIdle()
        composeRule.onNodeWithText("Nenhuma movimentação hoje")
            .performScrollTo()
            .assertIsDisplayed()
    }

    // 12 ─────────────────────────────────────────────────────────────────────
    @Test
    fun bottom_navigation_switches_destination() {
        waitForIdle()

        composeRule.onNodeWithContentDescription("Movimentações, não selecionado").performClick()
        waitForIdle()
        composeRule.onNodeWithTag("demo_destination_placeholder").assertIsDisplayed()

        composeRule.onNodeWithContentDescription("Início, não selecionado").performClick()
        waitForIdle()
        composeRule.onNodeWithText("Acessos rápidos").assertIsDisplayed()
    }
}
