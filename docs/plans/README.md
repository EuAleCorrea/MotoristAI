# 📋 Painel de Controle: Backlog de Planos

Este documento centraliza todos os planos de implementação técnica projetados para o MotoristAI. Utilize este índice para navegar entre as estratégias e acompanhar o progresso de desenvolvimento.

## 📋 Backlog de Planos (Aguardando Execução)

| ID | Plano | Origem | Próximo Passo |
|:---|:---|:---|:---|
| 008 | [Redução do Tamanho do APK Android](backlog/008-apk-size-reduction.md) | Investigação 2026-06-08 (APK 41.4MB) | Habilitar R8 + remover @capgo/capacitor-social-login |

## ✅ Histórico de Planos (Concluídos)

| ID | Plano | Data Conclusão | Resultado |
|:---|:---|:---|:---|
| 001 | [Auditoria de Segurança](history/001-security-audit.md) | 2026-04-16 | Bloqueio de Credentials Leak & RLS Ativo |
| 002 | [Organização do GitHub](history/002-github-organization.md) | 2026-04-16 | Repositório Limpo e Padronizado (via Opus) |
| 003 | [Manutenção e Suporte](history/003-project-maintenance.md) | 2026-04-16 | Guia Técnico e Script de Verificação Criados |
| 004 | [Login Biométrico — Sessão não restaura após logout](history/004-biometric-login-fix.md) | 2026-06-06 | Credenciais criptografadas em Preferences + re-auth via signInWithPassword |
| 005 | [Padronização de Dropdowns e Otimização Premium](history/005-shadcn-dropdowns-migration.md) | 2026-05-31 | Dropdowns unificados (shadcn) acoplados com check à direita |
| 009 | [Expiração de Sessão, Políticas Públicas e Parsing Monetário](history/009-session-policy-fixes.md) | 2026-06-18 | Inatividade 5min + sessão 24h, páginas públicas, parseAmount pt-BR |

---

## 🛠️ Como usar este Sistema
1. **Novas Ideias**: Devem ser documentadas primeiro na pasta `backlog/`.
2. **Execução**: Ao iniciar um plano, marque-o como `In Progress` no Dashboard.
3. **Conclusão**: Após o deploy bem-sucedido, mova o arquivo `.md` para a pasta `history/`.

---

## 📚 Documentos de Conhecimento (Knowledge Base)

Documentos técnicos e post-mortems para referência em projetos futuros.

| Documento | Descrição |
|:---|:---|
| [GOOGLE_AUTH_ANDROID_GUIDE.md](../GOOGLE_AUTH_ANDROID_GUIDE.md) | Guia completo: como implementar Google Auth no Android (Firebase + OAuth browser) |
| [GOOGLE_AUTH_POST_MORTEM.md](../GOOGLE_AUTH_POST_MORTEM.md) | Post-mortem: todas as tentativas, erros e lições aprendidas na implementação do MotoristAI |
