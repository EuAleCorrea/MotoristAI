# Google Auth no Android com Capacitor — Guia de Implementação

> **Stack**: React + TypeScript + Vite + Capacitor + Supabase  
> **Última revisão**: Maio 2026

---

## Visão Geral: Duas Abordagens

| | Abordagem A — Plugin Nativo (Firebase) | Abordagem B — OAuth via Browser (Supabase) |
|---|---|---|
| **Plugin** | `@codetrix-studio/capacitor-google-auth` | `@capacitor/browser` |
| **Dependências** | Firebase project + `google-services.json` | Apenas `@capacitor/browser` |
| **UX** | Picker nativo do Android (mais rápido) | Chrome Custom Tab (browser nativo) |
| **Complexidade** | Alta (Firebase, SHA-1, OAuth clients) | Baixa (apenas Supabase + deep link) |
| **Recomendado para** | Apps que já usam Firebase SDK | Apps que usam apenas Supabase |
| **ID Token para Supabase** | `signInWithIdToken()` | Automático via `exchangeCodeForSession()` |

---

## Abordagem A: Plugin Nativo com Firebase (Implementação Completa)

### Pré-requisitos
1. Conta Google com acesso ao **Firebase Console** e **Google Cloud Console**
2. SHA-1 do keystore de debug do Android Studio
3. Package name do app (`com.seuapp.app`)

---

### Passo 1: Obter o SHA-1 do Keystore de Debug

No terminal (Mac/Linux/Windows):
```bash
# Windows PowerShell
keytool -list -v -keystore "$env:USERPROFILE\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android

# Mac/Linux
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Anote o valor `SHA1:`, ex: `3D:E5:81:9E:93:9C:99:7D:97:60:0D:46:51:EE:DC:72:0E:76:31:75`

> ⚠️ **IMPORTANTE**: Para produção, use o SHA-1 do keystore de release, não o de debug.

---

### Passo 2: Criar Projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique **"Adicionar projeto"**
3. **CRÍTICO**: Na tela de criação, se o seu projeto já existir no Google Cloud Console, você verá uma opção para **selecionar um projeto existente**. Selecione-o. Isso evita criar projetos duplicados com OAuth clients conflitantes.
4. Ative o **Google Analytics** se desejado → Criar projeto

---

### Passo 3: Registrar o App Android no Firebase

1. Na tela inicial do projeto Firebase, clique no ícone **Android** (adicionar app)
2. Preencha:
   - **Package name**: `com.seuapp.app` (deve ser idêntico ao `applicationId` no `android/app/build.gradle`)
   - **Apelido do app**: opcional
   - **SHA-1**: cole o valor obtido no Passo 1
3. Clique **"Registrar app"**
4. **Baixe o `google-services.json`** e salve em `android/app/google-services.json`

> ⚠️ **NUNCA** construa o `google-services.json` manualmente. O campo `mobilesdk_app_id` é gerado internamente pelo Firebase e não pode ser derivado do número do projeto. Um valor incorreto ou placeholder causará `DEVELOPER_ERROR (code 10)`.

---

### Passo 4: Configurar Authentication no Firebase

1. No menu lateral: **Authentication → Método de login → Google**
2. Ative o provedor Google
3. Adicione o **e-mail de suporte**
4. Salve
5. O Firebase pode avisar "cliente OAuth idêntico já existe" — isso é **normal** se o projeto Google Cloud já tinha um cliente Android. Clique **Concluir** mesmo assim.
6. Após salvar, **baixe o `google-services.json` novamente** — ele será atualizado com o novo cliente OAuth do Google Auth.

---

### Passo 5: Configurar o Google Cloud Console

1. Acesse [console.cloud.google.com](https://console.cloud.google.com) → selecione o mesmo projeto
2. **APIs e Serviços → Tela de permissão OAuth**:
   - Configure o tipo: **Externo**
   - Preencha nome do app, e-mail de suporte, logo
   - Em **"Domínios autorizados"**, adicione o domínio do Supabase: `mogjcgnhohxinzeicjwv.supabase.co`
3. **APIs e Serviços → Credenciais**:
   - Verifique que existe um cliente do tipo **Android** com o SHA-1 correto
   - Verifique que existe um cliente do tipo **Aplicativo da Web**
   - Anote o **Client ID** do cliente Web — será o `serverClientId`

---

### Passo 6: Configurar o Supabase para Google Auth

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard) → seu projeto → **Authentication → Providers → Google**
2. Ative o provedor Google
3. Preencha:
   - **Client ID**: ID do cliente Web (tipo "Aplicativo da Web") do Google Cloud
   - **Client Secret**: Secret do mesmo cliente Web
4. Salve

---

### Passo 7: Instalar e Configurar o Plugin

```bash
npm install @codetrix-studio/capacitor-google-auth
npx cap sync android
```

**`capacitor.config.ts`**:
```typescript
const config: CapacitorConfig = {
  // ...
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: 'SEU_WEB_CLIENT_ID.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};
```

**`android/app/src/main/res/values/strings.xml`**:
```xml
<resources>
    <string name="app_name">SeuApp</string>
    <string name="server_client_id">SEU_WEB_CLIENT_ID.apps.googleusercontent.com</string>
</resources>
```

> ⚠️ O `serverClientId` deve ser o **Web Client ID**, não o Android Client ID.

---

### Passo 8: Implementar o Login no Código

**`src/pages/Login.tsx`**:
```typescript
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';

const handleGoogleLogin = async () => {
  if (Capacitor.isNativePlatform()) {
    // OBRIGATÓRIO: initialize() antes de signIn() no Android
    // Sem isso, NullPointerException no Java
    await GoogleAuth.initialize({
      clientId: 'SEU_WEB_CLIENT_ID.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });
    
    const googleUser = await GoogleAuth.signIn();
    const idToken = googleUser.authentication.idToken;
    
    // Envia o ID Token para o Supabase para autenticação
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
    
    if (error) throw error;
    navigate('/dashboard');
  }
};
```

**`android/app/build.gradle`** — verificar que o plugin está aplicado:
```groovy
// Deve estar presente (adicionado automaticamente pelo Capacitor quando google-services.json existe)
apply plugin: 'com.google.gms.google-services'
```

---

### Passo 9: Verificação Final

```
✅ SHA-1 registrado no Firebase para o package name correto
✅ google-services.json em android/app/ (baixado do Firebase, NUNCA manual)
✅ Authentication Google ativo no Firebase
✅ serverClientId é o Web Client ID (não o Android Client ID)
✅ initialize() chamado antes de signIn()
✅ Supabase configurado com Client ID e Secret do Google
```

---

## Abordagem B: OAuth via Browser com @capacitor/browser (Sem Firebase)

Esta é a abordagem implementada no MotoristAI. Recomendada quando:
- O app não usa Firebase para outros fins
- Simplicidade é prioridade sobre a experiência nativa do picker

### Instalação

```bash
npm install @capacitor/browser
npx cap sync android
```

### AndroidManifest.xml — Deep Link

```xml
<!-- Dentro do <activity android:name=".MainActivity"> -->
<intent-filter android:label="@string/title_activity_main">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="com.seuapp.app" />
</intent-filter>
```

### Supabase Dashboard

Em **Authentication → URL Configuration → Redirect URLs**, adicionar:
```
com.seuapp.app://login-callback
```

### Login.tsx

```typescript
import { Browser } from '@capacitor/browser';

const handleGoogleLogin = async () => {
  if (Capacitor.isNativePlatform()) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'com.seuapp.app://login-callback',
        skipBrowserRedirect: true,
      },
    });
    
    if (error) throw error;
    await Browser.open({ url: data.url!, windowName: '_self' });
  }
};
```

### App.tsx — DeepLinkHandler

```typescript
import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';

function DeepLinkHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    CapApp.addListener('appUrlOpen', async ({ url }) => {
      if (!url.includes('login-callback')) return;

      // Normaliza URL para usar a API URL nativa
      const normalized = url.replace('com.seuapp.app://', 'https://app.dummy/');
      const urlObj = new URL(normalized);

      // PKCE flow (padrão no Supabase v2): ?code=xxx
      const code = urlObj.searchParams.get('code');
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          await Browser.close().catch(() => {});
          navigate('/dashboard', { replace: true });
        }
        return;
      }

      // Implicit flow (fallback): #access_token=xxx
      const hash = new URLSearchParams(urlObj.hash.replace('#', ''));
      const accessToken = hash.get('access_token');
      const refreshToken = hash.get('refresh_token');
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        if (!error) {
          await Browser.close().catch(() => {});
          navigate('/dashboard', { replace: true });
        }
      }
    });

    return () => { CapApp.removeAllListeners(); };
  }, [navigate]);

  return null;
}
```

---

## Erros Comuns e Soluções

| Erro | Causa | Solução |
|---|---|---|
| `DEVELOPER_ERROR (code 10)` | SHA-1 errado, package name errado, ou `google-services.json` inválido | Verificar SHA-1, package name e redownload do `google-services.json` |
| `mobilesdk_app_id` inválido | `google-services.json` construído manualmente | **Sempre** baixar do Firebase Console |
| `Failed to fetch dynamically imported module` | Vite code splitting em WebView | Configurar `inlineDynamicImports: true` no vite.config.ts |
| Volta sem login após OAuth | DeepLink captura `?code=` mas código espera `#access_token=` | Usar `exchangeCodeForSession(code)` para PKCE flow |
| `NullPointerException` no Android | `GoogleAuth.signIn()` chamado sem `initialize()` | Chamar `GoogleAuth.initialize()` antes de `signIn()` |
| blob:null no download do Firebase | Bug do browser ao baixar via Chrome | Usar Firefox ou Safari para o download |
