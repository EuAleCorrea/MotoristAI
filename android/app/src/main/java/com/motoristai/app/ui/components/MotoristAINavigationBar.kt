package com.motoristai.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.asPaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.offset
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
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.traversalIndex
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.motoristai.app.ui.navigation.NavBarMetrics
import com.motoristai.app.ui.navigation.NavigationMetrics
import com.motoristai.app.ui.theme.MotoristAIThemeTokens

enum class NavDestination(
    val title: String,
    val shortTitle: String,
    val activeIcon: ImageVector,
    val inactiveIcon: ImageVector
) {
    INICIO("Início", "Início", Icons.Filled.Home, Icons.Outlined.Home),
    MOVIMENTACOES("Movimentações", "Movim.", Icons.Filled.List, Icons.Outlined.List),
    RELATORIOS("Relatórios", "Relat.", Icons.Filled.List, Icons.Outlined.List),
    AJUSTES("Ajustes", "Ajustes", Icons.Filled.Settings, Icons.Outlined.Settings)
}

/**
 * C14 - Barra inferior com FAB central, adaptativa.
 *
 * - Largura dos slots calculada a partir da largura real disponível ([NavigationMetrics]).
 * - Inset do sistema lido de `WindowInsets.navigationBars` (gestos ~24 dp, 3 botões ~48 dp).
 * - Alvo de toque mínimo de 48 × 48 dp garantido por construção.
 * - Rótulos mudam para a forma curta quando o slot fica estreito ou a fonte do sistema cresce.
 * - Ordem de acessibilidade fixa: Início → Movimentações → FAB → Relatórios → Ajustes.
 */
@Composable
fun MotoristAINavigationBar(
    currentDestination: NavDestination,
    onDestinationSelected: (NavDestination) -> Unit,
    onFabClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val fontScale = LocalDensity.current.fontScale
    val bottomInset = WindowInsets.navigationBars.asPaddingValues().calculateBottomPadding()

    BoxWithConstraints(
        modifier = modifier
            .fillMaxWidth()
            .background(MotoristAIThemeTokens.colors.surface)
    ) {
        val metrics: NavBarMetrics =
            NavigationMetrics.compute(
                availableWidthDp = maxWidth.value,
                bottomInsetDp = bottomInset.value,
                fontScale = fontScale
            )

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = bottomInset)
        ) {
            HorizontalDivider(
                color = MotoristAIThemeTokens.colors.border,
                thickness = 1.dp
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(metrics.barHeightDp.dp),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                NavSlot(
                    destination = NavDestination.INICIO,
                    isSelected = currentDestination == NavDestination.INICIO,
                    useShortLabel = metrics.useShortLabels,
                    slotWidthDp = metrics.slotWidthDp,
                    orderIndex = 0f,
                    onClick = { onDestinationSelected(NavDestination.INICIO) }
                )
                NavSlot(
                    destination = NavDestination.MOVIMENTACOES,
                    isSelected = currentDestination == NavDestination.MOVIMENTACOES,
                    useShortLabel = metrics.useShortLabels,
                    slotWidthDp = metrics.slotWidthDp,
                    orderIndex = 1f,
                    onClick = { onDestinationSelected(NavDestination.MOVIMENTACOES) }
                )

                // Slot reservado ao FAB central
                Spacer(modifier = Modifier.width(metrics.fabSlotWidthDp.dp))

                NavSlot(
                    destination = NavDestination.RELATORIOS,
                    isSelected = currentDestination == NavDestination.RELATORIOS,
                    useShortLabel = metrics.useShortLabels,
                    slotWidthDp = metrics.slotWidthDp,
                    orderIndex = 3f,
                    onClick = { onDestinationSelected(NavDestination.RELATORIOS) }
                )
                NavSlot(
                    destination = NavDestination.AJUSTES,
                    isSelected = currentDestination == NavDestination.AJUSTES,
                    useShortLabel = metrics.useShortLabels,
                    slotWidthDp = metrics.slotWidthDp,
                    orderIndex = 4f,
                    onClick = { onDestinationSelected(NavDestination.AJUSTES) }
                )
            }
        }

        // FAB sobreposto: 28 dp acima da barra, sempre acima do inset do sistema.
        MotoristAIFab(
            onClick = onFabClick,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .offset(y = -(metrics.fabBottomOffsetDp).dp)
                .semantics { traversalIndex = 2f }
        )
    }
}

@Composable
private fun NavSlot(
    destination: NavDestination,
    isSelected: Boolean,
    useShortLabel: Boolean,
    slotWidthDp: Float,
    orderIndex: Float,
    onClick: () -> Unit
) {
    val color = if (isSelected) {
        MotoristAIThemeTokens.colors.accent
    } else {
        MotoristAIThemeTokens.colors.onSurfaceVariant
    }
    val icon = if (isSelected) destination.activeIcon else destination.inactiveIcon
    val label = if (useShortLabel) destination.shortTitle else destination.title

    Column(
        modifier = Modifier
            .width(maxOf(slotWidthDp, NavigationMetrics.MIN_TOUCH_TARGET_DP).dp)
            .height(NavigationMetrics.BAR_HEIGHT_DP.dp)
            .clickable(onClick = onClick)
            .semantics {
                traversalIndex = orderIndex
                contentDescription =
                    "${destination.title}, ${if (isSelected) "selecionado" else "não selecionado"}"
            },
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
            text = label,
            style = MotoristAIThemeTokens.typography.label,
            color = color,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}
