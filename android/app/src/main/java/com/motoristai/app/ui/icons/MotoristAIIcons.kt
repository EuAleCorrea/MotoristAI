package com.motoristai.app.ui.icons

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.vector.PathBuilder
import androidx.compose.ui.graphics.vector.path
import androidx.compose.ui.unit.dp

/**
 * Vetores próprios para os ícones que **não existem** em `material-icons-core`.
 *
 * Substituem o pacote `material-icons-extended`, removido na Entrega 02.1 por custo de build
 * e de tamanho de APK. Todos são desenhados com traço de 2 dp, seguindo a especificação
 * (`tokens.md` §8): contorno, cantos arredondados, cor herdada do container.
 */
object MotoristAIIcons {

    val Visibility: ImageVector by lazy {
        lineIcon("MotoristAIVisibility") {
            stroke {
                moveTo(2f, 12f)
                curveTo(7f, 7.5f, 17f, 7.5f, 22f, 12f)
                curveTo(17f, 16.5f, 7f, 16.5f, 2f, 12f)
                close()
            }
            stroke {
                moveTo(12f, 9.2f)
                curveTo(13.55f, 9.2f, 14.8f, 10.45f, 14.8f, 12f)
                curveTo(14.8f, 13.55f, 13.55f, 14.8f, 12f, 14.8f)
                curveTo(10.45f, 14.8f, 9.2f, 13.55f, 9.2f, 12f)
                curveTo(9.2f, 10.45f, 10.45f, 9.2f, 12f, 9.2f)
                close()
            }
        }
    }

    val VisibilityOff: ImageVector by lazy {
        lineIcon("MotoristAIVisibilityOff") {
            stroke {
                moveTo(2f, 12f)
                curveTo(7f, 7.5f, 17f, 7.5f, 22f, 12f)
                curveTo(17f, 16.5f, 7f, 16.5f, 2f, 12f)
                close()
            }
            stroke {
                moveTo(12f, 9.2f)
                curveTo(13.55f, 9.2f, 14.8f, 10.45f, 14.8f, 12f)
                curveTo(14.8f, 13.55f, 13.55f, 14.8f, 12f, 14.8f)
                curveTo(10.45f, 14.8f, 9.2f, 13.55f, 9.2f, 12f)
                curveTo(9.2f, 10.45f, 10.45f, 9.2f, 12f, 9.2f)
                close()
            }
            stroke { moveTo(4f, 20f); lineTo(20f, 4f) }
        }
    }

    val Mic: ImageVector by lazy {
        lineIcon("MotoristAIMic") {
            stroke {
                moveTo(12f, 3f)
                curveTo(13.1f, 3f, 14f, 3.9f, 14f, 5f)
                lineTo(14f, 11f)
                curveTo(14f, 12.1f, 13.1f, 13f, 12f, 13f)
                curveTo(10.9f, 13f, 10f, 12.1f, 10f, 11f)
                lineTo(10f, 5f)
                curveTo(10f, 3.9f, 10.9f, 3f, 12f, 3f)
                close()
            }
            stroke {
                moveTo(6f, 11f)
                curveTo(6f, 14.31f, 8.69f, 17f, 12f, 17f)
                curveTo(15.31f, 17f, 18f, 14.31f, 18f, 11f)
            }
            stroke { moveTo(12f, 17f); lineTo(12f, 21f) }
            stroke { moveTo(9f, 21f); lineTo(15f, 21f) }
        }
    }

    val TrendingUp: ImageVector by lazy {
        lineIcon("MotoristAITrendingUp") {
            stroke {
                moveTo(3f, 17f)
                lineTo(9f, 11f)
                lineTo(13f, 15f)
                lineTo(20f, 8f)
            }
            stroke {
                moveTo(15f, 8f)
                lineTo(21f, 8f)
                lineTo(21f, 14f)
            }
        }
    }

    val TrendingDown: ImageVector by lazy {
        lineIcon("MotoristAITrendingDown") {
            stroke {
                moveTo(3f, 7f)
                lineTo(9f, 13f)
                lineTo(13f, 9f)
                lineTo(20f, 16f)
            }
            stroke {
                moveTo(15f, 16f)
                lineTo(21f, 16f)
                lineTo(21f, 10f)
            }
        }
    }

    val Inbox: ImageVector by lazy {
        lineIcon("MotoristAIInbox") {
            stroke {
                moveTo(4f, 4f)
                lineTo(20f, 4f)
                lineTo(20f, 20f)
                lineTo(4f, 20f)
                close()
            }
            stroke {
                moveTo(4f, 14f)
                lineTo(9f, 14f)
                curveTo(9f, 15.66f, 10.34f, 17f, 12f, 17f)
                curveTo(13.66f, 17f, 15f, 15.66f, 15f, 14f)
                lineTo(20f, 14f)
            }
        }
    }

    val ErrorOutline: ImageVector by lazy {
        lineIcon("MotoristAIErrorOutline") {
            stroke {
                moveTo(12f, 3f)
                curveTo(16.97f, 3f, 21f, 7.03f, 21f, 12f)
                curveTo(21f, 16.97f, 16.97f, 21f, 12f, 21f)
                curveTo(7.03f, 21f, 3f, 16.97f, 3f, 12f)
                curveTo(3f, 7.03f, 7.03f, 3f, 12f, 3f)
                close()
            }
            stroke { moveTo(12f, 7.5f); lineTo(12f, 13f) }
            stroke { moveTo(12f, 16.2f); lineTo(12f, 16.3f) }
        }
    }

    /** Carro — identidade da marca no cabeçalho da Home e lançamentos de corrida. */
    val Car: ImageVector by lazy {
        lineIcon("MotoristAICar") {
            stroke {
                moveTo(3.5f, 16.5f)
                lineTo(3.5f, 12.2f)
                curveTo(3.5f, 11.4f, 4f, 10.7f, 4.8f, 10.5f)
                lineTo(6.5f, 6.9f)
                curveTo(6.8f, 6.2f, 7.4f, 5.8f, 8.1f, 5.8f)
                lineTo(15.9f, 5.8f)
                curveTo(16.6f, 5.8f, 17.2f, 6.2f, 17.5f, 6.9f)
                lineTo(19.2f, 10.5f)
                curveTo(20f, 10.7f, 20.5f, 11.4f, 20.5f, 12.2f)
                lineTo(20.5f, 16.5f)
                close()
            }
            stroke { moveTo(3.5f, 13f); lineTo(20.5f, 13f) }
            stroke {
                moveTo(6.8f, 16.5f)
                lineTo(6.8f, 18.6f)
                curveTo(6.8f, 19.2f, 7.2f, 19.6f, 7.8f, 19.6f)
                curveTo(8.4f, 19.6f, 8.8f, 19.2f, 8.8f, 18.6f)
                lineTo(8.8f, 16.5f)
            }
            stroke {
                moveTo(15.2f, 16.5f)
                lineTo(15.2f, 18.6f)
                curveTo(15.2f, 19.2f, 15.6f, 19.6f, 16.2f, 19.6f)
                curveTo(16.8f, 19.6f, 17.2f, 19.2f, 17.2f, 18.6f)
                lineTo(17.2f, 16.5f)
            }
        }
    }

    /** Bomba de combustível — categoria de abastecimento. */
    val Fuel: ImageVector by lazy {
        lineIcon("MotoristAIFuel") {
            stroke {
                moveTo(4f, 20f)
                lineTo(4f, 5f)
                curveTo(4f, 4.4f, 4.4f, 4f, 5f, 4f)
                lineTo(11f, 4f)
                curveTo(11.6f, 4f, 12f, 4.4f, 12f, 5f)
                lineTo(12f, 20f)
            }
            stroke { moveTo(2.5f, 20f); lineTo(13.5f, 20f) }
            stroke {
                moveTo(6f, 8f)
                lineTo(10f, 8f)
                lineTo(10f, 11f)
                lineTo(6f, 11f)
                close()
            }
            stroke {
                moveTo(12f, 9f)
                lineTo(16f, 9f)
                lineTo(16f, 14.5f)
                curveTo(16f, 15.9f, 17.1f, 17f, 18.5f, 17f)
                curveTo(19.9f, 17f, 21f, 15.9f, 21f, 14.5f)
                lineTo(21f, 9.5f)
                lineTo(19f, 7.5f)
            }
        }
    }

    /** Talheres — categoria de alimentação. */
    val Food: ImageVector by lazy {
        lineIcon("MotoristAIFood") {
            stroke { moveTo(7f, 3f); lineTo(7f, 21f) }
            stroke {
                moveTo(4f, 3f)
                lineTo(4f, 9f)
                curveTo(4f, 10.7f, 5.3f, 12f, 7f, 12f)
                curveTo(8.7f, 12f, 10f, 10.7f, 10f, 9f)
                lineTo(10f, 3f)
            }
            stroke { moveTo(17f, 21f); lineTo(17f, 3f) }
            stroke {
                moveTo(17f, 3f)
                curveTo(15f, 3f, 14f, 5.2f, 14f, 8.5f)
                lineTo(14f, 11.5f)
                lineTo(17f, 11.5f)
            }
        }
    }

    // Novos ícones específicos para a Entrega 03.1.3
    val Sparkles: ImageVector by lazy {
        lineIcon("MotoristAISparkles") {
            stroke {
                moveTo(12f, 2f)
                lineTo(13.5f, 8.5f)
                lineTo(20f, 10f)
                lineTo(13.5f, 11.5f)
                lineTo(12f, 18f)
                lineTo(10.5f, 11.5f)
                lineTo(4f, 10f)
                lineTo(10.5f, 8.5f)
                close()
            }
        }
    }

    val Odometer: ImageVector by lazy {
        lineIcon("MotoristAIOdometer") {
            stroke {
                moveTo(12f, 3f)
                curveTo(7.03f, 3f, 3f, 7.03f, 3f, 12f)
                curveTo(3f, 16.97f, 7.03f, 21f, 12f, 21f)
                curveTo(16.97f, 21f, 21f, 16.97f, 21f, 12f)
                curveTo(21f, 7.03f, 16.97f, 3f, 12f, 3f)
                close()
            }
            stroke {
                moveTo(12f, 7f)
                lineTo(12f, 12f)
                lineTo(15f, 15f)
            }
        }
    }

    val Import: ImageVector by lazy {
        lineIcon("MotoristAIImport") {
            stroke {
                moveTo(12f, 3f)
                lineTo(12f, 15f)
            }
            stroke {
                moveTo(7f, 10f)
                lineTo(12f, 15f)
                lineTo(17f, 10f)
            }
            stroke {
                moveTo(4f, 19f)
                lineTo(20f, 19f)
            }
        }
    }
}

private fun lineIcon(
    name: String,
    block: ImageVector.Builder.() -> Unit
): ImageVector =
    ImageVector.Builder(
        name = name,
        defaultWidth = 24.dp,
        defaultHeight = 24.dp,
        viewportWidth = 24f,
        viewportHeight = 24f
    ).apply(block).build()

private fun ImageVector.Builder.stroke(
    strokeWidth: Float = 2f,
    block: PathBuilder.() -> Unit
) {
    path(
        fill = null,
        stroke = SolidColor(Color.Black),
        strokeLineWidth = strokeWidth,
        strokeLineCap = StrokeCap.Round,
        strokeLineJoin = StrokeJoin.Round,
        pathBuilder = block
    )
}
