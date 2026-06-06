# Script de Verificacao Pre-Deploy (MotoristAI)
# Adaptado para build Android via Capacitor (sem Next.js/Nixpacks/Netlify)

$ErrorActionPreference = "Stop"
$Pass = $true

Write-Host "--- Iniciando Verificacao Pre-Deploy (Android/Capacitor) ---" -ForegroundColor Cyan

# 1. Vite config existe
if (-not (Test-Path "vite.config.ts")) {
    Write-Host "[ERRO] vite.config.ts nao encontrado!" -ForegroundColor Red
    $Pass = $false
} else {
    Write-Host "[OK] vite.config.ts presente." -ForegroundColor Green
    $viteContent = Get-Content "vite.config.ts" -Raw
    if ($viteContent -match "inlineDynamicImports\s*:\s*true") {
        Write-Host "[OK] inlineDynamicImports: true (essencial para WebView Android)." -ForegroundColor Green
    } else {
        Write-Host "[AVISO] inlineDynamicImports nao esta true. Pode causar erro no WebView." -ForegroundColor Yellow
    }
}

# 2. Capacitor config existe
if (-not (Test-Path "capacitor.config.ts")) {
    Write-Host "[ERRO] capacitor.config.ts nao encontrado!" -ForegroundColor Red
    $Pass = $false
} else {
    Write-Host "[OK] capacitor.config.ts presente." -ForegroundColor Green
    $capContent = Get-Content "capacitor.config.ts" -Raw
    if ($capContent -match "appId.*com\.motoristai\.app") {
        Write-Host "[OK] appId = com.motoristai.app." -ForegroundColor Green
    } else {
        Write-Host "[AVISO] appId esperado com.motoristai.app, nao encontrado." -ForegroundColor Yellow
    }
}

# 3. Supabase env vars
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "VITE_SUPABASE_URL") {
        Write-Host "[OK] VITE_SUPABASE_URL presente." -ForegroundColor Green
    } else {
        Write-Host "[ERRO] VITE_SUPABASE_URL ausente no .env!" -ForegroundColor Red
        $Pass = $false
    }
    if ($envContent -match "VITE_SUPABASE_ANON_KEY") {
        Write-Host "[OK] VITE_SUPABASE_ANON_KEY presente." -ForegroundColor Green
    } else {
        Write-Host "[ERRO] VITE_SUPABASE_ANON_KEY ausente no .env!" -ForegroundColor Red
        $Pass = $false
    }
} else {
    Write-Host "[AVISO] .env nao encontrado. Crie a partir de .env.example." -ForegroundColor Yellow
}

# 4. dist/ existe (resultado de vite build)
if (Test-Path "dist/index.html") {
    Write-Host "[OK] dist/index.html presente (build Vite executado)." -ForegroundColor Green
} else {
    Write-Host "[AVISO] dist/index.html ausente. Execute 'npm run build' antes de 'npx cap sync android'." -ForegroundColor Yellow
}

# Final
Write-Host ""
if ($Pass) {
    Write-Host "PRONTO PARA BUILD ANDROID!" -ForegroundColor Green -BackgroundColor Black
    Write-Host "Proximo passo: npx cap sync android && npx cap open android" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "ERRO: Corrija os problemas acima antes de sincronizar com Android." -ForegroundColor Red
    exit 1
}
