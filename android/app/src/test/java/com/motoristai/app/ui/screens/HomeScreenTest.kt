package com.motoristai.app.ui.screens

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class HomeScreenTest {

    @Test
    fun `default home ui state has expected initial values`() {
        val state = HomeUiState()
        assertEquals("Alessandro", state.userName)
        assertEquals(HomePeriod.HOJE, state.selectedPeriod)
        assertTrue(state.isBalanceVisible)
        assertFalse(state.isLoading)
        assertFalse(state.hasError)
        assertEquals(3, state.recentTransactions.size)
    }

    @Test
    fun `home ui state handles empty transactions for empty state`() {
        val state = HomeUiState(recentTransactions = emptyList())
        assertTrue(state.recentTransactions.isEmpty())
    }

    @Test
    fun `home ui state handles loading and error flags`() {
        val loadingState = HomeUiState(isLoading = true)
        assertTrue(loadingState.isLoading)

        val errorState = HomeUiState(hasError = true)
        assertTrue(errorState.hasError)
    }
}
