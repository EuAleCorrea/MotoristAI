package com.motoristai.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.InputChip
import androidx.compose.material3.InputChipDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.motoristai.app.ui.theme.MotoristAIThemeTokens

/**
 * C06 - Campo de Texto
 */
@Composable
fun MotoristAITextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    placeholder: String = "",
    errorMessage: String? = null,
    isRequired: Boolean = false,
    readOnly: Boolean = false,
    enabled: Boolean = true,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    trailingIcon: @Composable (() -> Unit)? = null
) {
    val isError = !errorMessage.isNullOrBlank()

    Column(modifier = modifier) {
        // External label
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                text = label,
                style = MotoristAIThemeTokens.typography.label,
                color = MotoristAIThemeTokens.colors.textMuted
            )
            if (isRequired) {
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "obrigatório",
                    style = MotoristAIThemeTokens.typography.caption,
                    color = MotoristAIThemeTokens.colors.errorText
                )
            }
        }
        Spacer(modifier = Modifier.height(4.dp))

        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier
                .fillMaxWidth()
                .semantics {
                    contentDescription = "$label, ${if (isError) "com erro $errorMessage" else value}"
                },
            placeholder = {
                if (placeholder.isNotEmpty()) {
                    Text(
                        text = placeholder,
                        style = MotoristAIThemeTokens.typography.body,
                        color = MotoristAIThemeTokens.colors.textMuted
                    )
                }
            },
            readOnly = readOnly,
            enabled = enabled,
            isError = isError,
            keyboardOptions = keyboardOptions,
            shape = RoundedCornerShape(12.dp),
            trailingIcon = {
                if (readOnly) {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = "Somente leitura",
                        tint = MotoristAIThemeTokens.colors.textMuted,
                        modifier = Modifier.size(16.dp)
                    )
                } else if (trailingIcon != null) {
                    trailingIcon()
                }
            },
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = MotoristAIThemeTokens.colors.accent,
                unfocusedBorderColor = MotoristAIThemeTokens.colors.border,
                errorBorderColor = MotoristAIThemeTokens.colors.errorBorder,
                focusedContainerColor = MotoristAIThemeTokens.colors.surface,
                unfocusedContainerColor = MotoristAIThemeTokens.colors.surface,
                errorContainerColor = MotoristAIThemeTokens.colors.surface,
                disabledContainerColor = MotoristAIThemeTokens.colors.disabledSurface,
                disabledBorderColor = MotoristAIThemeTokens.colors.border
            ),
            textStyle = MotoristAIThemeTokens.typography.body
        )

        if (isError && errorMessage != null) {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = errorMessage,
                style = MotoristAIThemeTokens.typography.caption,
                color = MotoristAIThemeTokens.colors.errorText,
                modifier = Modifier.padding(start = 2.dp)
            )
        }
    }
}

/**
 * C07 - Dropdown (Select)
 */
@Composable
fun <T> MotoristAIDropdown(
    label: String,
    items: List<T>,
    selectedItem: T?,
    onItemSelected: (T) -> Unit,
    itemLabel: (T) -> String,
    modifier: Modifier = Modifier,
    placeholder: String = "Selecionar",
    errorMessage: String? = null,
    isRequired: Boolean = false,
    enabled: Boolean = true
) {
    var expanded by remember { mutableStateOf(false) }

    Box(modifier = modifier) {
        MotoristAITextField(
            value = selectedItem?.let(itemLabel) ?: "",
            onValueChange = {},
            label = label,
            placeholder = placeholder,
            errorMessage = errorMessage,
            isRequired = isRequired,
            readOnly = true,
            enabled = enabled,
            trailingIcon = {
                Icon(
                    imageVector = Icons.Default.ArrowDropDown,
                    contentDescription = "Expandir menu",
                    modifier = Modifier
                        .size(24.dp)
                        .clickable(enabled = enabled) { expanded = !expanded }
                )
            },
            modifier = Modifier.clickable(enabled = enabled) { expanded = !expanded }
        )

        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false },
            modifier = Modifier
                .background(MotoristAIThemeTokens.colors.surface)
                .fillMaxWidth(0.9f)
        ) {
            items.forEach { item ->
                DropdownMenuItem(
                    text = {
                        Text(
                            text = itemLabel(item),
                            style = MotoristAIThemeTokens.typography.body
                        )
                    },
                    onClick = {
                        onItemSelected(item)
                        expanded = false
                    }
                )
            }
        }
    }
}

/**
 * C08 - Chip de Filtro
 */
@Composable
fun MotoristAIFilterChip(
    text: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    FilterChip(
        selected = selected,
        onClick = onClick,
        label = {
            Text(
                text = text,
                style = MotoristAIThemeTokens.typography.label
            )
        },
        modifier = modifier.height(32.dp),
        enabled = enabled,
        shape = RoundedCornerShape(8.dp),
        colors = FilterChipDefaults.filterChipColors(
            containerColor = MotoristAIThemeTokens.colors.surface,
            labelColor = MotoristAIThemeTokens.colors.onSurfaceVariant,
            selectedContainerColor = MotoristAIThemeTokens.colors.accentSubtle,
            selectedLabelColor = MotoristAIThemeTokens.colors.primary
        ),
        border = FilterChipDefaults.filterChipBorder(
            enabled = enabled,
            selected = selected,
            borderColor = MotoristAIThemeTokens.colors.border,
            selectedBorderColor = MotoristAIThemeTokens.colors.accent
        )
    )
}

/**
 * C09 - Chip com remoção (X)
 */
@Composable
fun MotoristAIMultiChip(
    text: String,
    onRemove: () -> Unit,
    modifier: Modifier = Modifier
) {
    InputChip(
        selected = true,
        onClick = onRemove,
        label = {
            Text(
                text = text,
                style = MotoristAIThemeTokens.typography.label
            )
        },
        trailingIcon = {
            Icon(
                imageVector = Icons.Default.Close,
                contentDescription = "Remover $text",
                modifier = Modifier
                    .size(16.dp)
                    .clickable { onRemove() }
            )
        },
        modifier = modifier.height(32.dp),
        shape = RoundedCornerShape(8.dp),
        colors = InputChipDefaults.inputChipColors(
            containerColor = MotoristAIThemeTokens.colors.accentSubtle,
            labelColor = MotoristAIThemeTokens.colors.primary,
            trailingIconColor = MotoristAIThemeTokens.colors.primary
        )
    )
}

/**
 * C10 - Segmented Control (Ex: Veículo | Família)
 */
@Composable
fun MotoristAISegmentedControl(
    options: List<String>,
    selectedIndex: Int,
    onOptionSelected: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(40.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(MotoristAIThemeTokens.colors.surfaceVariant)
            .border(1.dp, MotoristAIThemeTokens.colors.border, RoundedCornerShape(12.dp))
            .padding(2.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        options.forEachIndexed { index, option ->
            val isSelected = index == selectedIndex
            Box(
                modifier = Modifier
                    .weight(1f)
                    .height(36.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(
                        if (isSelected) MotoristAIThemeTokens.colors.accentSubtle else Color.Transparent
                    )
                    .clickable { onOptionSelected(index) }
                    .semantics { contentDescription = "$option, ${if (isSelected) "selecionado" else "não selecionado"}" },
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = option,
                    style = MotoristAIThemeTokens.typography.label,
                    color = if (isSelected) MotoristAIThemeTokens.colors.primary else MotoristAIThemeTokens.colors.onSurfaceVariant
                )
            }
        }
    }
}

/**
 * C11 - Checkbox
 */
@Composable
fun MotoristAICheckbox(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    Row(
        modifier = modifier
            .clickable(enabled = enabled) { onCheckedChange(!checked) }
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Checkbox(
            checked = checked,
            onCheckedChange = onCheckedChange,
            enabled = enabled,
            colors = CheckboxDefaults.colors(
                checkedColor = MotoristAIThemeTokens.colors.accent,
                uncheckedColor = MotoristAIThemeTokens.colors.border
            )
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = label,
            style = MotoristAIThemeTokens.typography.body
        )
    }
}

/**
 * C12 - Radio Button
 */
@Composable
fun MotoristAIRadioButton(
    selected: Boolean,
    onClick: () -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    Row(
        modifier = modifier
            .clickable(enabled = enabled) { onClick() }
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        RadioButton(
            selected = selected,
            onClick = onClick,
            enabled = enabled,
            colors = RadioButtonDefaults.colors(
                selectedColor = MotoristAIThemeTokens.colors.accent,
                unselectedColor = MotoristAIThemeTokens.colors.border
            )
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = label,
            style = MotoristAIThemeTokens.typography.body
        )
    }
}

/**
 * C13 - Switch
 */
@Composable
fun MotoristAISwitch(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable(enabled = enabled) { onCheckedChange(!checked) }
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            style = MotoristAIThemeTokens.typography.body
        )
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            enabled = enabled,
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = MotoristAIThemeTokens.colors.accent,
                uncheckedThumbColor = MotoristAIThemeTokens.colors.textMuted,
                uncheckedTrackColor = MotoristAIThemeTokens.colors.border
            )
        )
    }
}
