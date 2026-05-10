# Post-Mortem: Google Auth Android — MotoristAI

> **Período**: Maio 2026  
> **Duração total**: 4+ sessões de desenvolvimento  
> **Status atual**: 🔴 OAuth via browser NÃO funcionando no dispositivo físico  
> **Próximo passo**: Implementar via Firebase (Abordagem A) — planejado para próxima sessão

---

## Resumo Executivo

A implementação do Google Auth no Android para o MotoristAI enfrentou múltiplos bloqueios causados principalmente por:

1. Projetos Firebase/Google Cloud duplicados com credenciais conflitantes
2. Download corrompido do `google-services.json` via Chrome (bug `blob:null`)
3. Tentativa de construir o `google-services.json` manualmente (impossível sem Firebase)
4. Code splitting do Vite causando erro de WebView antes mesmo do auth ser testado
5. Confusão entre PKCE flow e implicit flow no deep link handler
6. `windowName: '_self'` no `Browser.open()` possivelmente abrindo OAuth no WebView em vez do Chrome Custom Tab
7. Evento `appUrlOpen` possivelmente não disparando — deep link não chegando ao app

**Conclusão da Abordagem B** (OAuth via browser sem Firebase): Após 10 tentativas, o `appUrlOpen` não está sendo capturado de forma confiável no dispositivo físico. A decisão foi **encerrar esta abordagem** e partir para a **Abordagem A com Firebase** na próxima sessão, que é o método oficialmente suportado pelo Google para Android nativo.

---

## Linha do Tempo das Tentativas

### 🔴 Tentativa 1 — Plugin nativo sem inicialização

**O que foi feito**: Instalado `@codetrix-studio/capacitor-google-auth` e chamado diretamente `GoogleAuth.signIn()`.

**Erro**: App fechava imediatamente ao clicar no botão do Google.

**Causa raiz**: `GoogleAuth.signIn()` chamado sem `GoogleAuth.initialize()` antes. No Android, o `GoogleSignInClient` Java fica `null`, causando `NullPointerException` silencioso.

**Lição aprendida**:
> ⚠️ No Android, `@codetrix-studio/capacitor-google-auth` **EXIGE** que `GoogleAuth.initialize()` seja chamado antes de qualquer outra operação. Isso não é necessário no iOS.

---

### 🔴 Tentativa 2 — Plugin nativo com initialize(), mas sem google-services.json

**O que foi feito**: Adicionado `GoogleAuth.initialize({ clientId, scopes, grantOfflineAccess })` antes do `signIn()`.

**Erro**: `DEVELOPER_ERROR (code 10)` após o usuário selecionar a conta Google.

**Causa raiz**: O erro `10` no `GoogleSignIn` é gerado quando:
- O `google-services.json` está ausente
- O SHA-1 do app não está registrado no projeto Google Cloud/Firebase para o package name correto
- O `serverClientId` não pertence ao mesmo projeto que o `google-services.json`

**Lição aprendida**:
> ⚠️ `DEVELOPER_ERROR (code 10)` é um erro de configuração de identidade, não de código. O problema está sempre em um destes três: SHA-1, package name ou google-services.json.

---

### 🔴 Tentativa 3 — Code splitting do Vite impedindo qualquer teste

**O que foi feito**: Tentativa de testar no dispositivo físico.

**Erro**: Antes mesmo do Google Auth ser testado, a tela branca com `Failed to fetch dynamically imported module` aparecia.

**Causa raiz**: O Vite por padrão divide o bundle em chunks dinâmicos (`/assets/Login-xxx.js`, `/assets/Dashboard-xxx.js`). O Service Worker do PWA tenta interceptar esses carregamentos, mas no WebView do Capacitor (Android) o contexto de Service Worker falha, bloqueando o carregamento dos módulos.

**Fix aplicado**:
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      inlineDynamicImports: true, // Bundle único — sem chunks dinâmicos
    },
  },
},
```

**Lição aprendida**:
> ⚠️ Apps Capacitor com Vite **PRECISAM** de `inlineDynamicImports: true` ou outra estratégia para evitar code splitting. O WebView do Android não suporta bem o carregamento dinâmico de módulos via Service Worker.

---

### 🔴 Tentativa 4 — Criação de novo projeto Firebase (projeto errado)

**O que foi feito**: Tentativa de criar um projeto Firebase para hospedar o `google-services.json`. Usuário clicou em "Criar novo projeto" em vez de "Selecionar projeto existente".

**Problema**: O Google Cloud já tinha um projeto `motoristai` (número: `582220214551`) com os clientes OAuth registrados (incluindo o SHA-1). O novo projeto Firebase `motoristai-c591b` era um projeto completamente diferente.

**Consequência**: Ao tentar registrar o SHA-1 no novo projeto Firebase, apareceu o erro:
> "Não foi possível ativar o Login do Google — Um cliente OAuth idêntico já existe"

Isso significa que o SHA-1 `3D:E5:81:9E:93:9C:99:7D:97:60:0D:46:51:EE:DC:72:0E:76:31:75` estava vinculado ao projeto `motoristai` original, e o Firebase não permite registrar o mesmo SHA-1 em dois projetos diferentes.

**Lição aprendida**:
> ⚠️ Ao criar um projeto Firebase, **SEMPRE verificar se já existe um projeto Google Cloud** com o mesmo nome/finalidade. Se existir, usar **"Selecionar projeto existente"** na criação do Firebase — isso importa o projeto Google Cloud para o Firebase sem perder as credenciais existentes.

---

### 🔴 Tentativa 5 — Download corrompido do google-services.json

**O que foi feito**: Tentativa de baixar o `google-services.json` no Firebase Console usando o Chrome.

**Erro**: O botão de download gerava uma URL `blob:null/c2912e7b-ac7e-4e71-9225-47e0acc1767e` em vez de iniciar o download. Repetindo 3x, o mesmo resultado.

**Causa raiz**: Bug do Chrome em determinadas configurações de segurança/popup quando o Firebase Console tenta iniciar um download via blob URL dinâmico. Pode ocorrer com extensões de bloqueio de popups ou configurações de segurança avançadas.

**Workarounds possíveis**:
- Usar Firefox ou Safari para o download
- Abrir o DevTools (F12) → Network → clicar no botão de download → copiar o response body da requisição
- Usar a Firebase Management API com autenticação para baixar o arquivo programaticamente

**Lição aprendida**:
> ⚠️ O Chrome pode ter bugs ao baixar o `google-services.json` do Firebase Console. Se o download falhar com URL `blob:null`, use outro browser. **NUNCA construir o arquivo manualmente.**

---

### 🔴 Tentativa 6 — Construção manual do google-services.json

**O que foi feito**: Com o download falhando, tentativa de construir o `google-services.json` manualmente a partir dos dados disponíveis no Google Cloud Console (project number, client IDs, etc.).

**Erro gerado**:
```json
{
  "mobilesdk_app_id": "1:582220214551:android:0000000000000000"
}
```

O campo `mobilesdk_app_id` foi preenchido com placeholder `0000000000000000`.

**Por que falhou**: O `mobilesdk_app_id` é um hash interno gerado pelo Firebase ao registrar o app. Ele não é derivável do project number nem de qualquer informação pública. Um valor inválido neste campo faz o Google Play Services rejeitar a identidade do app, resultando em `DEVELOPER_ERROR (code 10)`.

**Lição aprendida**:
> 🚫 **NUNCA construir o `google-services.json` manualmente.** O campo `mobilesdk_app_id` é gerado internamente pelo Firebase e não pode ser derivado de outras informações. Este arquivo **só pode ser obtido via download no Firebase Console** após o app estar devidamente registrado.

---

### 🔴 Tentativa 7 — serverClientId com typo

**Descoberta durante revisão de código**: O `clientId` passado para `GoogleAuth.initialize()` continha um typo:

```typescript
// ❌ ERRADO (typo na URL — rrf9r em vez de rrfj9r)
clientId: '582220214551-hg82u3ns7rrf9r1e0hpgeeq3oh8q27.apps.googleusercontent.com'

// ✅ CORRETO
clientId: '582220214551-hg82u3ns7rrfj9rl1e0hpgeeq3oh8q27.apps.googleusercontent.com'
```

**Lição aprendida**:
> ⚠️ Client IDs do Google OAuth são longos e propensos a typos. Sempre copiar/colar do Console, nunca digitar manualmente. Após configurar, verificar o ID no código contra o Console.

---

### 🟡 Tentativa 8 — OAuth via Browser sem Firebase (Parcialmente funcional)

**Decisão**: Abandonar a abordagem do plugin nativo que exigia Firebase e adotar o fluxo OAuth padrão do Supabase via browser.

**O que funcionou**:
- O browser abria corretamente com a tela de seleção de conta Google ✅
- O usuário conseguia ver e selecionar a conta ✅

**O que NÃO funcionou**:
- Após selecionar a conta, o app voltava para a tela de login sem autenticar ❌
- O `appUrlOpen` provavelmente não estava disparando ❌

**Implementação aplicada**:
1. `@capacitor/browser` instalado
2. `intent-filter` para `com.motoristai.app://` no `AndroidManifest.xml`
3. `com.motoristai.app://login-callback` nas Redirect URLs do Supabase
4. `Login.tsx`: `signInWithOAuth({ skipBrowserRedirect: true })` + `Browser.open({ url, windowName: '_self' })`
5. `App.tsx`: `DeepLinkHandler` escutando `appUrlOpen`

---

### 🔴 Bug na Tentativa 8 — PKCE vs Implicit flow

**Diagnóstico**: O handler original buscava `#access_token=xxx` (implicit flow), mas Supabase v2 usa PKCE, retornando `?code=xxx`.

**Fix aplicado**:
```typescript
const code = urlObj.searchParams.get('code');
if (code) {
  await supabase.auth.exchangeCodeForSession(code);
}
```

**Resultado**: Mesmo com o fix de PKCE, o comportamento continuou idêntico — o `appUrlOpen` não chegava ao handler.

**Lição aprendida**:
> ⚠️ O Supabase JS SDK v2 usa **PKCE flow por padrão**. Sempre usar `exchangeCodeForSession(code)`, não `setSession()`.

---

### 🔴 Tentativa 9 — Remoção do `windowName: '_self'` (10/05/2026)

**Hipótese**: O `Browser.open({ url, windowName: '_self' })` estava forçando a abertura do OAuth **dentro do WebView** em vez do Chrome Custom Tab. No WebView, o redirect para `com.motoristai.app://` não é tratado como deep link — ele simplesmente falha silenciosamente, e o evento `appUrlOpen` nunca dispara.

**Fix aplicado**:
```typescript
// ❌ ANTES — abre no WebView (errado)
await Browser.open({ url: data.url, windowName: '_self' });

// ✅ DEPOIS — abre no Chrome Custom Tab (correto)
await Browser.open({ url: data.url });
```

**Resultado**: O comportamento no dispositivo físico continuou idêntico — volta para login sem autenticar. Não foi possível confirmar se o `appUrlOpen` estava disparando ou não sem Logcat.

**Lição aprendida**:
> ⚠️ Nunca usar `windowName: '_self'` no `Browser.open()` para OAuth no Android. Sem esse parâmetro, o Capacitor usa Chrome Custom Tab por padrão, que é o único contexto capaz de fazer o redirect de volta ao app via scheme customizado.

---

### 🔴 Tentativa 10 — Debug com `window.alert()` (10/05/2026)

**Hipótese**: O `appUrlOpen` pode não estar disparando de forma alguma, mas sem Logcat é impossível confirmar apenas com `console.log()`.

**Fix aplicado**: Substituídos todos os `console.log/error` por `window.alert()` para tornar o diagnóstico visível na tela do dispositivo sem precisar do Android Studio conectado.

```typescript
await CapApp.addListener('appUrlOpen', async ({ url }) => {
  window.alert('[DEBUG] appUrlOpen!\nURL: ' + url); // visível na tela
  // ...
});
```

**Resultado**: Nenhum alert apareceu na tela após selecionar a conta Google — confirmando que o `appUrlOpen` **não está disparando**.

**Causa provável**: O Chrome Custom Tab no Android não está redirecionando para o scheme `com.motoristai.app://` de forma que o sistema operacional intercepte e abra o app. Possíveis razões:
- Restrições de segurança do Android 12+ em redirects de Custom Tab para schemes não verificados
- O `intent-filter` pode precisar de configuração adicional (`android:host` específico)
- A versão do Chrome instalada pode ter comportamento diferente
- O Supabase pode estar redirecionando para uma URL intermediária antes de chegar ao scheme customizado

**Decisão final**: Encerrar a Abordagem B (OAuth via browser) e implementar a **Abordagem A com Firebase** na próxima sessão.

---

## Resumo de Erros e Soluções

| # | Erro | Causa | Solução |
|---|---|---|---|
| 1 | App fecha ao clicar Google | `signIn()` sem `initialize()` | Chamar `initialize()` antes de `signIn()` |
| 2 | `DEVELOPER_ERROR (code 10)` | Sem `google-services.json` / SHA-1 não registrado | Registrar SHA-1 no Firebase e baixar o JSON |
| 3 | Tela branca no WebView | Vite code splitting com Service Worker | `inlineDynamicImports: true` no vite.config.ts |
| 4 | SHA-1 "já existe em outro projeto" | Projeto Firebase novo criado em vez de importar o existente | Ao criar Firebase, selecionar projeto Google Cloud existente |
| 5 | Download `blob:null` | Bug do Chrome no Firebase Console | Usar Firefox ou DevTools Network para copiar o JSON |
| 6 | `DEVELOPER_ERROR` com JSON manual | `mobilesdk_app_id` placeholder inválido | Nunca construir manualmente — sempre baixar do Firebase |
| 7 | Typo no Client ID | Digitação manual do ID longo | Sempre copiar/colar do Console |
| 8 | Volta sem login após OAuth | PKCE flow retorna `?code=` não `#access_token=` | Usar `exchangeCodeForSession(code)` |
| 9 | `appUrlOpen` não dispara | `windowName: '_self'` abre no WebView, não no Chrome Custom Tab | Remover `windowName` do `Browser.open()` |
| 10 | `appUrlOpen` confirmado como não disparando | Chrome Custom Tab não redireciona para scheme customizado no Android físico | **Migrar para Firebase** (Abordagem A) |

---

## Recomendações para Projetos Futuros

### ✅ Faça sempre

1. **Verifique se já existe um projeto Google Cloud** antes de criar um novo Firebase — use "selecionar projeto existente"
2. **Obtenha o SHA-1 antes de qualquer configuração** e registre no Firebase imediatamente
3. **Baixe o `google-services.json` usando Firefox** se Chrome falhar
4. **Copie e cole Client IDs** — nunca os digite manualmente
5. **Configure `inlineDynamicImports: true`** no Vite para apps Capacitor
6. **Adicione o redirect URI no Supabase** (`com.seuapp.app://login-callback`) antes de testar
7. Para PKCE flow (Supabase v2 padrão): use `exchangeCodeForSession(code)`, não `setSession()`

### 🚫 Nunca faça

1. **Nunca construa `google-services.json` manualmente** — o `mobilesdk_app_id` é único e gerado pelo Firebase
2. **Nunca crie um projeto Firebase paralelo** para um app que já tem projeto Google Cloud
3. **Nunca chame `GoogleAuth.signIn()` sem `GoogleAuth.initialize()` antes** no Android
4. **Nunca assuma que o Supabase usa implicit flow** — v2 usa PKCE por padrão

### ⚡ Decisão de arquitetura — REVISADA após 10 tentativas

> ⚠️ **CONCLUSÃO IMPORTANTE**: A Abordagem B (OAuth via browser sem Firebase) **não funcionou de forma confiável no Android físico** com o Capacitor. O evento `appUrlOpen` não disparou mesmo com o `intent-filter` configurado corretamente.

**Recomendação DEFINITIVA para Android + Capacitor + Supabase:**
→ Use sempre a **Abordagem A (Firebase + Plugin Nativo)**. É o método oficialmente suportado pelo Google e pela comunidade Capacitor para autenticação Google no Android.

**A Abordagem B (OAuth via browser)** pode funcionar em alguns cenários, mas demonstrou ser frágil em dispositivos físicos Android, possivelmente por restrições do Chrome Custom Tab em versões mais recentes do Android.

---

## Arquivos Modificados nesta Feature

| Arquivo | Modificação |
|---|---|
| `vite.config.ts` | `inlineDynamicImports: true` para bundle único |
| `src/pages/Login.tsx` | Substituído plugin nativo por `Browser.open()` com OAuth Supabase |
| `src/App.tsx` | Adicionado `DeepLinkHandler` para capturar `appUrlOpen` e processar PKCE |
| `android/app/src/main/AndroidManifest.xml` | `intent-filter` para scheme `com.motoristai.app://` |
| `android/app/google-services.json` | Arquivo presente mas com `mobilesdk_app_id` placeholder (solução final não usa Firebase) |
| `android/app/src/main/res/values/strings.xml` | `server_client_id` sincronizado (mantido para não quebrar build) |

---

## Referências

- [Supabase Mobile OAuth — Capacitor Guide](https://supabase.com/docs/guides/auth/social-login/auth-google?platform=android)
- [Capacitor Browser Plugin](https://capacitorjs.com/docs/apis/browser)
- [Capacitor App Plugin — appUrlOpen](https://capacitorjs.com/docs/apis/app#addlistenerappurlopen)
- [@codetrix-studio/capacitor-google-auth](https://github.com/CodetrixStudio/CapacitorGoogleAuth)
- [Firebase Console](https://console.firebase.google.com)
- [Google Cloud Console — Credenciais](https://console.cloud.google.com/apis/credentials)
