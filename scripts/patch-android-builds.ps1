# patch-android-builds.ps1
# Corrige avisos de Gradle em plugins do Capacitor dentro de node_modules
# Execute após npm install quando necessário

$filePath = "node_modules\@codetrix-studio\capacitor-google-auth\android\build.gradle"

if (Test-Path $filePath) {
    $content = Get-Content $filePath -Raw
    
    if ($content -match "proguard-android\.txt") {
        $patched = $content -replace "proguard-android\.txt", "proguard-android-optimize.txt"
        Set-Content $filePath -Value $patched -NoNewline
        Write-Host "✅ Patched: $filePath" -ForegroundColor Green
    } else {
        Write-Host "⏭️  Already patched or not found: $filePath" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  File not found: $filePath" -ForegroundColor Red
}

Write-Host "`nPatch complete." -ForegroundColor Cyan
