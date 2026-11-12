package com.motoristai.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.motoristai.app.ui.DesignSystemGallery
import com.motoristai.app.ui.theme.MotoristAITheme

class DesignSystemActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MotoristAITheme {
                DesignSystemGallery()
            }
        }
    }
}
