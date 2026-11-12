package com.motoristai.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.asPaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.List
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.motoristai.app.ui.theme.MotoristAIThemeTokens

enum class NavDestination(
    val title: String,
    val activeIcon: ImageVector,
    val inactiveIcon: ImageVector
) {
    INICIO("Início", Icons.Filled.Home, Icons.Outlined.Home),
    MOVIMENTACOES("Movim.", Icons.Filled.List, Icons.Outlined.List),
    RELATORIOS("Relatórios", Icons.Filled.List, Icons.Outlined.List),
    AJUSTES("Ajustes", Icons.Filled.Settings, Icons.Outlined.Settings)
}

/**
 * C14 - Custom Navigation Bar with Elevated Central FAB
 */
@Composable
fun MotoristAINavigationBar(
    currentDestination: NavDestination,
    onDestinationSelected: (NavDestination) -> Unit,
    onFabClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val navBarPaddingBottom = WindowInsets.navigationBars.asPaddingValues().calculateBottomPadding()

    Box(
        modifier = modifier
            .fillMaxWidth()
            .background(MotoristAIThemeTokens.colors.surface)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = navBarPaddingBottom)
        ) {
            HorizontalDivider(color = MotoristAIThemeTokens.colors.border, thickness = 1.dp)

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                horizontalArrangement = Arrangement.SpaceAround,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Slot 1 - Início
                NavSlot(
                    destination = NavDestination.INICIO,
                    isSelected = currentDestination == NavDestination.INICIO,
                    onClick = { onDestinationSelected(NavDestination.INICIO) }
                )

                // Slot 2 - Movimentações
                NavSlot(
                    destination = NavDestination.MOVIMENTACOES,
                    isSelected = currentDestination == NavDestination.MOVIMENTACOES,
                    onClick = { onDestinationSelected(NavDestination.MOVIMENTACOES) }
                )

                // Spacer para o FAB Central
                Spacer(modifier = Modifier.width(56.dp))

                // Slot 3 - Relatórios
                NavSlot(
                    destination = NavDestination.RELATORIOS,
                    isSelected = currentDestination == NavDestination.RELATORIOS,
                    onClick = { onDestinationSelected(NavDestination.RELATORIOS) }
                )

                // Slot 4 - Ajustes
                NavSlot(
                    destination = NavDestination.AJUSTES,
                    isSelected = currentDestination == NavDestination.AJUSTES,
                    onClick = { onDestinationSelected(NavDestination.AJUSTES) }
                )
            }
        }

        // Elevated Central FAB
        MotoristAIFab(
            onClick = onFabClick,
            modifier = Modifier
                .align(Alignment.TopCenter)
                .padding(bottom = navBarPaddingBottom + 28.dp)
        )
    }
}

@Composable
private fun NavSlot(
    destination: NavDestination,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val color = if (isSelected) MotoristAIThemeTokens.colors.accent else MotoristAIThemeTokens.colors.onSurfaceVariant
    val icon = if (isSelected) destination.activeIcon else destination.inactiveIcon

    Column(
        modifier = Modifier
            .width(72.dp)
            .clickable(onClick = onClick)
            .padding(vertical = 6.dp)
            .semantics { contentDescription = "${destination.title}, ${if (isSelected) "selecionado" else "não selecionado"}" },
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = color,
            modifier = Modifier.size(24.dp)
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = destination.title,
            style = MotoristAIThemeTokens.typography.label,
            color = color
        )
    }
}
