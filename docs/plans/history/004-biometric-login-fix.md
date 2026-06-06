# 004 — Login Biométrico: Sessão não restaura após logout

**Severidade:** 🟡 Média  
**Status:** ✅ Concluído  
**Criado em:** 2026-05-06  
**Concluído em:** 2026-06-06  

---

## Problema Original

Após o usuário fazer login com email/senha e sair pelo menu ("Sair da conta"), o botão "Entrar com Digital" aparecia na tela de login, mas ao usá-lo exibia "Sessão expirada. Faça login com email para reativar a digital."

## Causa Raiz Final

`supabase.auth.signOut()` (mesmo com `scope: 'local'`) **sempre invalida o `refresh_token` no servidor**. Os tokens salvos no `localStorage` para biometria tornavam-se inúteis após qualquer logout.

O `scope: 'local'` apenas evita a chamada HTTP extra de revogação — não preserva o token.

## Solução Implementada

**Abordagem:** Persistir `{ email, password }` criptografados em `Capacitor Preferences` e re-autenticar via `signInWithPassword` após a biometria.

### Arquitetura
- `src/lib/secureStorage.ts` (novo) — wrapper sobre `Preferences` com criptografia AES-GCM (PBKDF2 + crypto.subtle)
- `src/hooks/useBiometricAuth.ts` — refatorado: salva credenciais em vez de tokens; refaz `signInWithPassword` no unlock
- `src/pages/Login.tsx` — conectado ao hook `useBiometricAuth` (estava órfão) e chama `saveSessionForBiometric(email, password)` após login bem-sucedido
- `src/components/ui/AuthCard.tsx` — sem mudanças (assinatura `() => void` já compatível)

### Tratamento de Credenciais Expiradas
Se `signInWithPassword` retornar `Invalid login credentials` (usuário trocou senha em outro device), o hook:
1. Limpa credenciais biométricas
2. Retorna mensagem amigável: "Sua senha foi alterada. Entre com email para reativar a digital."

### Fluxo
```
[Login email/senha] → saveSessionForBiometric() → Preferences (criptografado)
[Logout] → signOut({ scope: 'local' }) → NÃO limpa credenciais biométricas
[Login com Digital] → authenticateWithBiometric() → signInWithPassword() → sessão restaurada
```

## Arquivos Modificados

| Arquivo | Mudança |
|:--------|:--------|
| `src/lib/secureStorage.ts` | 🆕 Criado |
| `src/hooks/useBiometricAuth.ts` | ♻️ Refatorado (tokens → credenciais criptografadas) |
| `src/pages/Login.tsx` | 🔌 Conectado ao `useBiometricAuth` |
| `package.json` | ➕ `@capacitor/preferences@^8.0.1` |

## Plugin

- `@aparajita/capacitor-biometric-auth@10.0.0` (mantido)
- `@capacitor/preferences@8.0.1` (novo)

## Critérios de Done Atingidos

- [x] Bug original documentado e reproduzido antes da correção
- [x] 4 cenários manuais definidos (logout, troca de senha, desinstalação, revogação de biometria)
- [x] Lint sem novos erros (warning pré-existente do ESLint 9 + react-hooks 4.6.2)
- [x] `vite build` passou (3939 módulos)
- [x] `npx cap sync android` registrou `@capacitor/preferences`
- [x] Plano movido para `history/`
- [x] Docs atualizadas (`plans/README.md`, `MAINTENANCE.md`)

## Pós-Conclusão

- Atualizar `MAINTENANCE.md` removendo menção "issue conhecida"
- Testar APK em device real (logcat filtrado por `[BiometricAuth]`)
