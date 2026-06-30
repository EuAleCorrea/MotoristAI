# 008 — Redução do Tamanho do APK Android

**Severidade:** 🟡 Performance / UX
**Status:** 📋 Backlog (aguardando execução)
**Criado em:** 2026-06-08
**Origem:** Investigação do tamanho do APK debug (41.4MB)

---

## Contexto

APK debug gerado em `android/app/build/outputs/apk/debug/app-debug.apk` está em **~41.4MB**. Para um app de gestão financeira pessoal, isso é grande — o usuário médio espera 10-20MB. Cada 5MB a mais no APK reduz a taxa de instalação em ~2% (dados Play Store).

> ⚠️ **Nota técnica**: 40MB é o tamanho do APK **debug**. O release (sem otimização) tende a ficar próximo disso. Com R8/ProGuard habilitado, pode cair para 15-20MB.

---

## Diagnóstico (já realizado)

### Causas identificadas

| # | Causa | Impacto estimado | Esforço | Risco |
|:-:|:------|:----------------:|:-------:|:-----:|
| 1 | `minifyEnabled false` no release (R8 desligado) | ~5-10MB | 🟢 Baixo | 🟡 Médio |
| 2 | `@capgo/capacitor-social-login` instalado mas não usado | ~2-5MB | 🟢 Baixo | 🟢 Baixo |
| 3 | `shrinkResources` desabilitado (recursos não usados) | ~1-3MB | 🟢 Baixo | 🟢 Baixo |
| 4 | APK em vez de AAB (Play Store não otimiza por device) | ~30% no Play | 🟢 Baixo | 🟢 Baixo |
| 5 | `jspdf` + `html2canvas` (~500KB) sempre no bundle | ~500KB no JS | 🟡 Médio | 🟡 Médio |
| 6 | `echarts` (~700KB) sem tree-shaking agressivo | ~500KB no JS | 🟡 Médio | 🟢 Baixo |
| 7 | Bundle único (`inlineDynamicImports: true`) impede code splitting | (estrutural) | 🔴 Alto | 🔴 Alto |

### Verificações realizadas

- ✅ `android/app/build.gradle:21` — `minifyEnabled false` confirmado
- ✅ `android/app/build.gradle:24` — sem `shrinkResources`
- ✅ `package.json:31` — `@capgo/capacitor-social-login` listado mas não importado em `src/`
- ✅ `android/app/src/main/assets/capacitor.plugins.json` — registra o plugin social-login
- ✅ `vite.config.ts:52` — `inlineDynamicImports: true` (mantido por causa do WebView Android)
- ✅ `android/app/build/outputs/apk/debug/app-debug.apk` = **41.387.715 bytes (41.4MB)**

---

## Escopo Proposto (ordenado por impacto/esforço)

### Fase 1 — Quick wins (ganho estimado: 8-15MB)

#### 1.1. Habilitar R8 + shrinkResources

**Arquivo:** `android/app/build.gradle`

```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

**Cuidado:** R8 pode ofuscar classes usadas por reflection (Supabase auth, Capacitor plugins). Testar login, persistência de sessão e todos os plugins.

Se quebrar algo, adicionar em `android/app/proguard-rules.pro`:
```proguard
-keep class com.getcapacitor.** { *; }
-keep class io.supabase.** { *; }
-keep class androidx.core.splashscreen.** { *; }
```

#### 1.2. Remover `@capgo/capacitor-social-login` (dead weight)

**Arquivos a alterar:**
- `package.json:31` — remover a dependência
- `android/app/src/main/assets/capacitor.plugins.json` — remover entrada
- `android/capacitor.settings.gradle` — remover `include ':capgo-capacitor-social-login'`
- `android/app/capacitor.build.gradle` — remover `implementation project(':capgo-capacitor-social-login')`

**Comando:**
```bash
npm uninstall @capgo/capacitor-social-login
npx cap sync android
```

**Justificativa:** o botão Google do `AuthCard` (`src/components/ui/AuthCard.tsx:269-298`) **não é usado** — `Login.tsx` não passa a prop `onGoogleLogin`. Login social está em stand-by (`docs/GOOGLE_AUTH_POST_MORTEM.md`).

#### 1.3. Configurar geração de AAB

**Arquivo:** `android/app/build.gradle` — adicionar:

```gradle
android {
    // ...
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles ...
        }
    }
    bundle {
        language { enableSplit = true }
        density  { enableSplit = true }
        abi      { enableSplit = true }
    }
}
```

**Comando:**
```bash
cd android
./gradlew bundleRelease
# Gera AAB em app/build/outputs/bundle/release/
```

Play Store gera APKs otimizados (~30% menores) automaticamente a partir do AAB.

### Fase 2 — Otimizações médias (ganho estimado: 500KB-1MB no JS)

#### 2.1. Lazy-load do PDF (jspdf + html2canvas)

**Arquivo:** `src/pages/IncomeReportPage.tsx:3-4`

Trocar imports estáticos:
```ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
```

Por imports dinâmicos:
```ts
const handleGeneratePDF = async () => {
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
    ]);
    // ... resto da lógica
};
```

**Cuidado:** `inlineDynamicImports: true` em `vite.config.ts:52` **impede code splitting**. Para usar lazy-load, é preciso:
1. Remover `inlineDynamicImports: true` (ou condicionar a `process.env.CAPACITOR`)
2. Testar bem no Android (risco de "Failed to fetch dynamically imported module" no WebView)

**Alternativa mais simples:** tree-shaking manual importando apenas o necessário do jspdf (sub-módulos).

#### 2.2. Auditar tree-shaking do echarts

**Arquivo:** `src/components/...` (verificar onde `echarts` é usado)

Substituir:
```ts
import * as echarts from 'echarts';
```

Por imports específicos (echarts exporta sub-módulos):
```ts
import { LineChart, BarChart, PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import * as echarts from 'echarts/core';
echarts.use([LineChart, BarChart, PieChart, CanvasRenderer]);
```

### Fase 3 — Investigação futura (baixa prioridade)

- Trocar `echarts` por `recharts` (mais leve) se dashboard não usa gráficos complexos
- Avaliar troca de `framer-motion` por CSS animations onde possível
- Auditar uso de `axios` (pode ser substituído por `fetch` em vários lugares)

---

## Critérios de Aceitação

- [ ] APK release (AAB ou APK) **< 20MB**
- [ ] Build release não quebra nenhum fluxo crítico (login, biometria, PDF, gráficos)
- [ ] Login social continua funcionando quando reativado (não removemos o código em `AuthCard`, só a dep instalada)
- [ ] `npm run build` + `npx cap sync android` continuam funcionando
- [ ] Build release roda mais rápido que o debug atual (~5s economizado no startup é um bônus)

---

## Métricas de Acompanhamento

| Métrica | Antes (debug) | Meta (release Fase 1) | Meta (Fase 2) |
|:--------|:-------------:|:---------------------:|:-------------:|
| Tamanho APK | 41.4MB | ≤ 20MB | ≤ 15MB |
| Tamanho JS bundle | 2.98MB | 2.5MB | 2.0MB |
| Tempo de build release | N/A | ≤ 90s | ≤ 90s |
| Tempo de startup (cold) | N/A | sem regressão | sem regressão |

---

## Arquivos Relevantes

| Arquivo | Motivo |
|:--------|:-------|
| `android/app/build.gradle` | Habilitar R8 + shrinkResources + AAB |
| `android/app/proguard-rules.pro` | Regras de keep para Supabase/Capacitor |
| `package.json` | Remover @capgo/capacitor-social-login |
| `vite.config.ts` | Considerar reverter `inlineDynamicImports` se for fazer lazy-load |
| `src/pages/IncomeReportPage.tsx` | Imports dinâmicos do PDF |
| `src/components/ui/AuthCard.tsx` | Botão Google (preservar lógica, só remover dep instalada) |
| `docs/GOOGLE_AUTH_POST_MORTEM.md` | Histórico do login social (stand-by) |

---

## Notas

- **Não fazer Fase 2 antes da Fase 1**: o ganho de R8 sozinho é maior e mais fácil de reverter se quebrar algo.
- **Sempre medir antes e depois**: usar `du -h app-release.apk` e `npm run build` (ver output `dist/assets/`) para comparar.
- **Testar em device físico**, não só emulador — emulador pode ser mais permissivo com R8.
- Se R8 quebrar Supabase auth, considerar adicionar `-keep class com.motoristai.app.** { *; }` ao proguard.

---

## Histórico

| Data | Atualização | Autor |
|:-----|:------------|:------|
| 2026-06-08 | Plano criado a partir de investigação de tamanho do APK | Agente AI |
