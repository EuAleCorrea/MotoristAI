package com.motoristai.app.ui.components

import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.sp
import com.motoristai.app.ui.util.Money
import com.motoristai.app.ui.util.MoneyTextSizing

/**
 * Valor monetário que **nunca é truncado**.
 *
 * O tamanho da fonte é escolhido pela largura real disponível (e pela escala de fonte do
 * sistema). Se o valor não couber em uma linha no menor degrau, ele quebra em duas linhas —
 * o espaço entre "R$" e o número é não separável, então a quebra nunca corta dígitos.
 *
 * O TalkBack sempre recebe o valor integral via `contentDescription`.
 */
@Composable
fun MoneyText(
    cents: Long,
    color: Color,
    modifier: Modifier = Modifier,
    label: String? = null,
    textAlign: TextAlign = TextAlign.Start
) {
    val text = Money.format(cents)
    val fontScale = LocalDensity.current.fontScale

    BoxWithConstraints(modifier = modifier.fillMaxWidth()) {
        val availableWidthDp = this.maxWidth.value
        val tier = MoneyTextSizing.pickTier(text, availableWidthDp, fontScale)

        Text(
            text = text,
            color = color,
            textAlign = textAlign,
            maxLines = MoneyTextSizing.MAX_LINES,
            softWrap = true,
            overflow = TextOverflow.Clip,
            style = TextStyle(
                fontSize = tier.sizeSp.sp,
                lineHeight = tier.lineHeightSp.sp,
                fontWeight = FontWeight.Bold
            ),
            modifier = Modifier
                .fillMaxWidth()
                .semantics {
                    contentDescription = Money.accessibilityLabel(label, cents)
                }
        )
    }
}
