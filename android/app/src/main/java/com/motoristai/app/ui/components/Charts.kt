package com.motoristai.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import com.motoristai.app.ui.theme.MotoristAIThemeTokens

data class DonutSliceData(
    val categoryName: String,
    val value: Float,
    val percentageFormatted: String
)

/**
 * C19 - Donut Chart (Categorias)
 */
@Composable
fun DonutChart(
    slices: List<DonutSliceData>,
    totalFormatted: String,
    modifier: Modifier = Modifier
) {
    val palette = MotoristAIThemeTokens.colors.chartPalette
    val fallbackColor = MotoristAIThemeTokens.colors.textMuted
    val totalSum = slices.map { it.value }.sum().coerceAtLeast(1f)

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        // Canvas Donut
        Box(
            modifier = Modifier.size(140.dp),
            contentAlignment = Alignment.Center
        ) {
            Canvas(modifier = Modifier.size(140.dp)) {
                var startAngle = -90f
                val strokeWidth = 20.dp.toPx()
                val diameter = size.minDimension - strokeWidth
                val topLeft = Offset(strokeWidth / 2, strokeWidth / 2)
                val arcSize = Size(diameter, diameter)

                slices.forEachIndexed { index, slice ->
                    val sweepAngle = (slice.value / totalSum) * 360f
                    val color = palette.getOrElse(index) { fallbackColor }

                    drawArc(
                        color = color,
                        startAngle = startAngle,
                        sweepAngle = sweepAngle,
                        useCenter = false,
                        topLeft = topLeft,
                        size = arcSize,
                        style = Stroke(width = strokeWidth)
                    )
                    startAngle += sweepAngle
                }
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = totalFormatted,
                    style = MotoristAIThemeTokens.typography.title3,
                    color = MotoristAIThemeTokens.colors.onSurface
                )
                Text(
                    text = "Total",
                    style = MotoristAIThemeTokens.typography.caption,
                    color = MotoristAIThemeTokens.colors.textMuted
                )
            }
        }

        Spacer(modifier = Modifier.width(16.dp))

        // Legenda
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            slices.take(6).forEachIndexed { index, slice ->
                val color = palette.getOrElse(index) { fallbackColor }
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .clip(CircleShape)
                                .background(color)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = slice.categoryName,
                            style = MotoristAIThemeTokens.typography.bodySmall,
                            color = MotoristAIThemeTokens.colors.onSurface
                        )
                    }
                    Text(
                        text = slice.percentageFormatted,
                        style = MotoristAIThemeTokens.typography.label,
                        color = MotoristAIThemeTokens.colors.textMuted
                    )
                }
            }
        }
    }
}

/**
 * C20 - Bar Chart (Evolução Mensal / Receitas)
 */
@Composable
fun BarChart(
    values: List<Float>,
    labels: List<String>,
    modifier: Modifier = Modifier,
    barColor: Color? = null
) {
    val activeBarColor = barColor ?: MotoristAIThemeTokens.colors.accent
    val gridColor = MotoristAIThemeTokens.colors.chartGrid
    val maxValue = values.maxOrNull()?.coerceAtLeast(1f) ?: 1f

    Column(
        modifier = modifier
            .fillMaxWidth()
            .height(160.dp)
            .padding(8.dp)
    ) {
        Canvas(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
        ) {
            val width = size.width
            val height = size.height
            val numBars = values.size
            val barWidth = (width / (numBars * 2)).coerceAtMost(32.dp.toPx())
            val spacing = (width - (barWidth * numBars)) / (numBars + 1)

            // Canvas Grid Lines
            drawLine(
                color = gridColor,
                start = Offset(0f, height),
                end = Offset(width, height),
                strokeWidth = 1.dp.toPx()
            )

            values.forEachIndexed { index, value ->
                val barHeight = (value / maxValue) * height
                val left = spacing + index * (barWidth + spacing)
                val top = height - barHeight

                drawRoundRect(
                    color = activeBarColor,
                    topLeft = Offset(left, top),
                    size = Size(barWidth, barHeight),
                    cornerRadius = CornerRadius(4.dp.toPx(), 4.dp.toPx())
                )
            }
        }

        Spacer(modifier = Modifier.height(4.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceAround
        ) {
            labels.forEach { label ->
                Text(
                    text = label,
                    style = MotoristAIThemeTokens.typography.caption,
                    color = MotoristAIThemeTokens.colors.textMuted
                )
            }
        }
    }
}

/**
 * C21 - Line Chart (Receitas vs Despesas)
 */
@Composable
fun LineChart(
    revenueValues: List<Float>,
    expenseValues: List<Float>,
    modifier: Modifier = Modifier
) {
    val maxVal = (revenueValues + expenseValues).maxOrNull()?.coerceAtLeast(1f) ?: 1f
    val successColor = MotoristAIThemeTokens.colors.success
    val errorColor = MotoristAIThemeTokens.colors.errorText
    val gridColor = MotoristAIThemeTokens.colors.chartGrid

    Canvas(
        modifier = modifier
            .fillMaxWidth()
            .height(140.dp)
            .padding(8.dp)
    ) {
        val width = size.width
        val height = size.height

        drawLine(color = gridColor, start = Offset(0f, height), end = Offset(width, height), strokeWidth = 1.dp.toPx())

        fun drawSeries(data: List<Float>, color: Color) {
            if (data.size < 2) return
            val path = Path()
            val stepX = width / (data.size - 1)

            data.forEachIndexed { i, valY ->
                val x = i * stepX
                val y = height - ((valY / maxVal) * height)
                if (i == 0) path.moveTo(x, y) else path.lineTo(x, y)
            }

            drawPath(
                path = path,
                color = color,
                style = Stroke(width = 2.5.dp.toPx())
            )
        }

        drawSeries(revenueValues, successColor)
        drawSeries(expenseValues, errorColor)
    }
}
