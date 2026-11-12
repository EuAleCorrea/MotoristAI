package com.motoristai.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.motoristai.app.ui.icons.MotoristAIIcons
import com.motoristai.app.ui.theme.MotoristAIThemeTokens

/**
 * C31 - Campo de Busca
 */
@Composable
fun SearchTextField(
    query: String,
    onQueryChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Buscar lançamento, categoria ou plataforma..."
) {
    OutlinedTextField(
        value = query,
        onValueChange = onQueryChange,
        modifier = modifier
            .fillMaxWidth()
            .semantics { contentDescription = "Campo de busca, $query" },
        placeholder = {
            Text(
                text = placeholder,
                style = MotoristAIThemeTokens.typography.bodySmall,
                color = MotoristAIThemeTokens.colors.textMuted
            )
        },
        leadingIcon = {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = null,
                tint = MotoristAIThemeTokens.colors.textMuted,
                modifier = Modifier.size(20.dp)
            )
        },
        trailingIcon = {
            if (query.isNotEmpty()) {
                IconButton(onClick = { onQueryChange("") }) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Limpar busca",
                        tint = MotoristAIThemeTokens.colors.textMuted,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        },
        shape = RoundedCornerShape(12.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = MotoristAIThemeTokens.colors.accent,
            unfocusedBorderColor = MotoristAIThemeTokens.colors.border,
            focusedContainerColor = MotoristAIThemeTokens.colors.surface,
            unfocusedContainerColor = MotoristAIThemeTokens.colors.surface
        ),
        textStyle = MotoristAIThemeTokens.typography.bodySmall,
        singleLine = true
    )
}

/**
 * C32 - Campo de Senha com Olho
 */
@Composable
fun PasswordTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    errorMessage: String? = null,
    isRequired: Boolean = false
) {
    var passwordVisible by remember { mutableStateOf(false) }

    MotoristAITextField(
        value = value,
        onValueChange = onValueChange,
        label = label,
        modifier = modifier,
        errorMessage = errorMessage,
        isRequired = isRequired,
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
        trailingIcon = {
            IconButton(onClick = { passwordVisible = !passwordVisible }) {
                Icon(
                    imageVector = if (passwordVisible) MotoristAIIcons.Visibility else MotoristAIIcons.VisibilityOff,
                    contentDescription = if (passwordVisible) "Ocultar senha" else "Mostrar senha",
                    tint = MotoristAIThemeTokens.colors.textMuted,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    )
}

/**
 * C34 - Cabeçalho de Dia em Lista Agrupada
 */
@Composable
fun DayHeader(
    dateFormatted: String,
    subtotalFormatted: String,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(MotoristAIThemeTokens.colors.background)
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = dateFormatted,
            style = MotoristAIThemeTokens.typography.caption,
            color = MotoristAIThemeTokens.colors.textMuted
        )
        Text(
            text = subtotalFormatted,
            style = MotoristAIThemeTokens.typography.caption,
            color = MotoristAIThemeTokens.colors.onSurface
        )
    }
}

/**
 * C35 - Divisor de Seção
 */
@Composable
fun SectionDivider(
    modifier: Modifier = Modifier
) {
    HorizontalDivider(
        modifier = modifier.padding(vertical = 12.dp),
        color = MotoristAIThemeTokens.colors.border,
        thickness = 1.dp
    )
}

/**
 * C36 - Dica Contextual
 */
@Composable
fun ContextualTip(
    text: String,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(MotoristAIThemeTokens.colors.accentSubtle)
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = Icons.Default.Info,
            contentDescription = null,
            tint = MotoristAIThemeTokens.colors.accent,
            modifier = Modifier.size(16.dp)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = text,
            style = MotoristAIThemeTokens.typography.caption,
            color = MotoristAIThemeTokens.colors.primary
        )
    }
}
