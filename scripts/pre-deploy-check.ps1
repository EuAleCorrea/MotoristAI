# Script de Verificacao Pre-Deploy (MotoristAI)
# Versao simplificada para evitar erros de codificacao

$ErrorActionPreference = "Stop"
$Pass = $true

Write-Host "--- Iniciando Verificacao ---" -ForegroundColor Cyan

# 1. Standalone
if (Test-Path "next.config.ts") {
    $content = Get-Content "next.config.ts" -Raw
    if ($content -match 'output:\s*"standalone"') {
        Write-Host "[OK] Next.js Standalone configurado." -ForegroundColor Green
    } else {
        Write-Host "[ERRO] Next.js NAO esta em modo standalone!" -ForegroundColor Red
        $Pass = $false
    }
}

# 2. Nixpacks
if (Test-Path "nixpacks.toml") {
    $content = Get-Content "nixpacks.toml" -Raw
    if ($content -contains 'providers = ["node"]') {
        Write-Host "[OK] Nixpacks Node provider configurado." -ForegroundColor Green
    } else {
        Write-Host "[ERRO] nixpacks.toml sem provider node!" -ForegroundColor Red
        $Pass = $false
    }
}

# 3. Supabase
if (Test-Path ".env") {
    $content = Get-Content ".env" -Raw
    if ($content -match "VITE_SUPABASE_ANON_KEY") {
        Write-Host "[OK] Supabase Anon Key presente." -ForegroundColor Green
    }
}

# Final
if ($Pass) {
    Write-Host ""
    Write-Host "PRONTO PARA DEPLOY!" -ForegroundColor Green -BackgroundColor Black
    exit 0
} else {
    Write-Host ""
    Write-Host "ERRO: Corrija os problemas acima antes de subir." -ForegroundColor Red
    exit 1
}
