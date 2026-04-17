# 🛠️ Guia de Manutenção e Suporte - MotoristAI

Este documento serve como a "Fonte Única da Verdade" para a manutenção técnica do ecossistema MotoristAI.

---

## 🖥️ Infraestrutura (Hostinger VPS)

| Recurso | Detalhes |
| :--- | :--- |
| **Hostname** | `srv561524.hstgr.cloud` |
| **IP IPv4** | `195.200.4.198` |
| **Acesso SSH** | `ssh root@195.200.4.198` |
| **Painel de Controle** | EasyPanel (Nixpacks) |

---

## 🚀 Fluxo de Deploy (EasyPanel + Nixpacks)

O deploy é baseado em **Nixpacks** e utiliza a saída `standalone` do Next.js para máxima performance.

### Configurações Obrigatórias
1. **Protocolo**: O domínio no EasyPanel deve estar configurado como **HTTP** (Porta 8000).
2. **Saída**: `next.config.ts` deve conter `output: "standalone"`.
3. **Build**: O arquivo `nixpacks.toml` na raiz garante a cópia dos arquivos estáticos.

### Comando de Rebuild
Sempre que fizer um `git push` para a branch principal no remote do projeto, execute o Rebuild no painel do EasyPanel.

---

## 🔐 Segurança e Banco de Dados (Supabase)

### Row Level Security (RLS)
Todas as tabelas possuem RLS ativado. O acesso é restrito ao `user_id` vinculado ao `auth.uid()`.
- **Script de Referência**: `supabase/migrations/20260417000000_security_hardening.sql`.

### Variáveis de Ambiente
- **Frontend**: Utiliza apenas a `Anon Key`.
- **AVISO**: Nunca exponha a `service_role` key no código cliente.

---

## 💳 Pagamentos (Stripe)

Configuração padrão de trial:
- **Período**: 14 dias.
- **Implementação**: Via API (Payment Links), evitando falhas do dashboard manual.
- **Webhook**: `/api/webhooks/stripe`.

---

## 🧹 Rotinas de Limpeza (Antigravity)

Execute estes comandos periodicamente no PowerShell para manter o espaço em disco:

```powershell
# Limpar gravações do browser com mais de 7 dias
Get-ChildItem -Path "$HOME\.gemini\antigravity\browser_recordings" -Directory | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Remove-Item -Recurse -Force

# Limpar memória do 'brain' com mais de 15 dias
Get-ChildItem -Path "$HOME\.gemini\antigravity\brain" -Directory | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-15) } | Remove-Item -Recurse -Force
```

---

## 📝 Check de Pré-Deploy
Antes de realizar o deploy, execute o script de validação:
`powershell ./scripts/pre-deploy-check.ps1`
