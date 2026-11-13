package com.motoristai.app.ui.demo

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.isSystemInDarkTheme
import com.motoristai.app.ui.theme.MotoristAITheme

/**
 * Activity **exclusiva de demonstração** da Home nativa.
 *
 * A Activity de produção ([com.motoristai.app.MainActivity]) e o WebView permanecem intactos.
 * Esta tela não é a entrada do aplicativo: não declara `MAIN/LAUNCHER` no manifesto e existe
 * apenas para permitir abrir a Home diretamente pelo Android Studio ou por `adb`.
 *
 * Execução:
 * ```
 * adb shell am start -n com.motoristai.app/com.motoristai.app.ui.demo.DemoHomeActivity
 * ```
 */
class DemoHomeActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        setContent {
            MotoristAITheme(darkTheme = isSystemInDarkTheme()) {
                DemoHomeContent()
            }
        }
    }
}
