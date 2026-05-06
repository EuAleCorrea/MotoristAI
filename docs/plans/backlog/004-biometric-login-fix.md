# 004 — Login Biométrico: Sessão não restaura após logout

**Severidade:** 🟡 Média  
**Status:** Backlog  
**Criado em:** 2026-05-06  

---

## Problema

Após o usuário fazer login com email/senha e sair pelo menu ("Sair da conta"), o botão "Entrar com Digital" aparece corretamente na tela de login, mas ao usá-lo exibe a mensagem "Sessão expirada. Faça login com email para reativar a digital."

## Causa Raiz Identificada

O `supabase.auth.signOut()` **revoga o refresh_token no servidor do Supabase**. Os tokens salvos no localStorage para biometria ficam inválidos imediatamente após o logout.

## Tentativas Realizadas (06/05/2026)

1. **Corrigir `getBiometricTypeName`** — enum v10 do plugin usa valor `3` para fingerprint Android, não `1`. ✅ Corrigido.
2. **Usar `refreshSession()` em vez de `setSession()`** — para renovar access_token expirado via refresh_token. ✅ Implementado, mas não resolve porque o token está revogado.
3. **Usar `scope: 'local'` no `signOut()`** — para não revogar o token no servidor. ✅ Implementado em `AuthContext.tsx` e `Header.tsx`. **Não resolveu** — motivo a investigar.

## Arquivos Envolvidos

| Arquivo | Papel |
|:--------|:------|
| `src/hooks/useBiometricAuth.ts` | Hook principal — verifica hardware, salva/recupera tokens, autentica |
| `src/pages/Login.tsx` | Usa o hook, implementa `handleBiometricLogin` |
| `src/components/ui/AuthCard.tsx` | UI do botão "Entrar com Digital" |
| `src/contexts/AuthContext.tsx` | `signOut()` global |
| `src/components/Header.tsx` | `handleLogout()` direto |

## Próximos Passos Sugeridos

1. **Debug com Logcat**: Verificar no Android Studio o log `[BiometricAuth]` para ver os valores exatos de `available`, `isEnabled`, `hasSession` após o logout.
2. **Verificar se o localStorage está sendo limpo**: O Supabase SDK pode estar limpando TODAS as chaves do localStorage no signOut, incluindo as biométricas (`motoristai_biometric_*`).
3. **Alternativa: usar Capacitor Preferences** em vez de localStorage para salvar os tokens biométricos — mais confiável e isolado do WebView.
4. **Alternativa: usar Android Keystore** via plugin nativo para armazenar tokens de forma verdadeiramente segura.

## Plugin

- `@aparajita/capacitor-biometric-auth@10.0.0`
- Enum `BiometryType`: 0=none, 1=touchId, 2=faceId, 3=fingerprintAuthentication, 4=faceAuthentication, 5=irisAuthentication
