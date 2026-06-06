# 🛠️ Guia de Manutenção - MotoristAI

Documento de manutenção técnica do **MotoristAI**. O app é **Android-first**: pré-validação em `localhost` e destino final via **Android Studio** + Capacitor.

> Estado real do projeto: Vite + React 18 + TypeScript + Supabase + Capacitor 8 (Android).

---

## 🎯 Visão Geral do Fluxo

```
[ Código ] --> [ Pré-validação localhost ] --> [ Build Vite ] --> [ Capacitor sync ] --> [ Android Studio ] --> [ APK ]
   npm dev         npm run dev                  npm run build     npx cap sync android     npx cap open android
```

**Pré-validação** (rápida, hot-reload): `npm run dev` em `http://localhost:5173/`
**Build produção** (gera `dist/`): `npm run build`
**Sync para Android**: `npm run build:android` (= `vite build && npx cap sync android`)
**Compilação final**: abrir em Android Studio → Build → APK / install

---

## 🖥️ Pré-Validação em Localhost

Antes de levar para Android Studio, valide tudo no browser local:

```powershell
npm install
npm run dev
```

Acesse `http://localhost:5173/` no browser. Verifique:
- Login (email/senha, magic link, biometria se disponível)
- Dashboard carrega
- Lançamentos de entradas e despesas funcionam
- Insights renderiza gráficos
- Dark/light mode alterna corretamente
- Navegação entre abas (Início, Receitas, Insights, Despesas, Ajustes)

**Cenários para testar** antes de cada mudança significativa:
1. Lançar uma entrada (corrida)
2. Lançar uma despesa veicular
3. Editar/excluir um lançamento
4. Criar uma meta mensal
5. Visualizar insights
6. Configurar uma regra de manutenção
7. Trocar tema

---

## 🏗️ Build de Produção (Vite)

```powershell
npm run build
```

Saída: pasta `dist/` (assets, index.html, sw.js, manifest).

**Importante**: `vite.config.ts` define `build.inlineDynamicImports: true`. Isso é **essencial** para o WebView do Android — sem isso, o Capacitor apresenta erro `Failed to fetch dynamically imported module` ao navegar entre rotas lazy-loaded.

---

## 📱 Build Android (Capacitor)

### Pré-requisitos
- Android Studio instalado
- JDK 17+ (`java -version`)
- Android SDK (configurado no Android Studio)
- Variável `ANDROID_HOME` apontando para o SDK

### Comandos

```powershell
# Build + sync (forma abreviada)
npm run build:android

# Ou passo a passo:
npm run build
npx cap sync android

# Abrir no Android Studio
npx cap open android

# Rodar no device/emulador conectado
npx cap run android
```

### Estrutura
- `capacitor.config.ts` na raiz: `appId = com.motoristai.app`, `webDir = dist`
- `android/`: projeto Android gerado pelo Capacitor (NÃO editar manualmente; mudanças são sobrescritas no `cap sync`)
- Splash screen: `#0A0F1C` por 3000 ms
- `androidScheme`: `https`

### Adicionando um plugin Capacitor

```powershell
npm install @capacitor/NOME_DO_PLUGIN
npx cap sync android
```

---

## 🔐 Segurança e Banco de Dados (Supabase)

### Row Level Security (RLS)
Todas as tabelas possuem RLS ativado. O acesso é restrito ao `user_id` vinculado ao `auth.uid()`.
- **Script de referência**: `supabase/migrations/20260417000000_security_hardening.sql`.
- Migrations em `supabase/migrations/` (7 arquivos + `add_goals_unique_constraint.sql`).

### Variáveis de Ambiente
- **Frontend** (cliente): utiliza apenas a `VITE_SUPABASE_ANON_KEY` (lida em `src/services/supabase.ts`).
- **Backend** (server-side, se aplicável): `SUPABASE_SERVICE_ROLE_KEY` — **NUNCA** expor no código cliente (resolvido em SEC-001, ver `docs/vulnerabilities.md`).

### Autenticação
- Email/senha (Supabase Auth)
- Biometria no Android (Capacitor `@aparajita/capacitor-biometric-auth` v10) — ver `docs/plans/backlog/004-biometric-login-fix.md` (issue conhecida)
- Google Auth (em transição, ver `docs/GOOGLE_AUTH_POST_MORTEM.md`)

---

## 💳 Pagamentos (Stripe)

Configuração padrão de trial:
- **Período**: 14 dias.
- **Implementação**: Via API (Payment Links), evitando falhas do dashboard manual.
- **Webhook**: `/api/webhooks/stripe`.

> Status: integração planejada. Sem dependência `@stripe/*` no `package.json` atual.

---

## 🧹 Rotinas de Limpeza Local

Execute periodicamente no PowerShell para manter o espaço em disco:

```powershell
# Limpar build artifacts antigos
Remove-Item -LiteralPath "dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath "android\app\build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath "android\build" -Recurse -Force -ErrorAction SilentlyContinue

# Limpar node_modules e reinstalar (quando há conflito de peer deps)
Remove-Item -LiteralPath "node_modules" -Recurse -Force
npm install --legacy-peer-deps
```

---

## 📝 Check de Pré-Deploy (Android)

Antes de sincronizar com o Android Studio, execute:

```powershell
powershell ./scripts/pre-deploy-check.ps1
```

Verifica:
- `vite.config.ts` existe e tem `inlineDynamicImports: true`
- `capacitor.config.ts` existe com `appId` correto
- `.env` tem `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- `dist/index.html` existe (vite build executado)

---

## 🐛 Troubleshooting Comum

### `Failed to fetch dynamically imported module` no WebView
Confirme que `vite.config.ts` tem `build.inlineDynamicImports: true`. O WebView do Android não implementa dynamic imports corretamente.

### `npm install` falha com `ERESOLVE`
Use `npm install --legacy-peer-deps`. O projeto tem conflitos conhecidos entre `eslint-plugin-react-hooks@4.6.2` (peer de eslint 3-8) e `eslint@9`.

### Splash screen infinito
- Verifique `android/app/src/main/res/values/styles.xml` (configuração do splash)
- O plugin `@capacitor/splash-screen` está configurado para auto-hide em 3000ms

### Build do Gradle falha no Android Studio
- File → Invalidate Caches / Restart
- Verifique se `local.properties` aponta para o Android SDK (`sdk.dir=C:\\Users\\...\\AppData\\Local\\Android\\Sdk`)
- Rode `npx cap sync android` para regenerar assets

### `Type errors` ao rodar `npx tsc --noEmit`
Há ~100 erros pré-existentes de incompatibilidade `date-fns` v3 (afeta ~30 arquivos). **Não impactam o build** porque o Vite só transpila TypeScript, não checa tipos. Tratar em frente separada.

---

## 📚 Documentação Relacionada

- `docs/GIT_WORKFLOW.md` — Passo a passo de commit/push
- `docs/vulnerabilities.md` — Histórico de vulnerabilidades e resoluções
- `docs/GOOGLE_AUTH_POST_MORTEM.md` — Post-mortem da tentativa de Google Auth
- `docs/FAQ.md` — Perguntas frequentes
- `docs/wiki/` — Wiki do projeto (formato: ver `00-indice.md`)
