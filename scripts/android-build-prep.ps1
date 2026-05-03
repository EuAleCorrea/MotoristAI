Write-Host "🔍 Verificando JDK..."
java -version

Write-Host "🏗️ Gerando build web..."
npm run build

Write-Host "📦 Fazendo backup dos recursos Android..."
Copy-Item -Recurse android\app\src\main\res android_res_backup -Force

Write-Host "🗑️ Removendo projeto Android incompleto..."
Remove-Item -Recurse -Force android

Write-Host "⚡ Recriando projeto Android com Capacitor..."
npx cap add android

Write-Host "🎨 Restaurando recursos personalizados..."
Copy-Item -Recurse android_res_backup\* android\app\src\main\res\ -Force
Remove-Item -Recurse -Force android_res_backup

Write-Host "🔄 Sincronizando assets web..."
npx cap sync android

Write-Host "📝 Criando local.properties..."
"sdk.dir=C\:\\Users\\aless\\AppData\\Local\\Android\\Sdk" | Out-File -FilePath android\local.properties -Encoding UTF8

Write-Host ""
Write-Host "✅ Pronto! Projeto Android preparado para o Android Studio."
Write-Host "👉 Abra a pasta android/ no Android Studio e aguarde o Gradle sync."
