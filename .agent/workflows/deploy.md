---
description: Como fazer deploy do MotoristAI no Cloudflare Pages
---

# Regras de Deploy - MotoristAI

## Branch Padrão para Deploy

**IMPORTANTE:** Sempre usar o branch `MotoristAI_v2` para deploys no Cloudflare Pages.

## Comando de Deploy

```bash
# Antes de fazer deploy, sempre fazer build
npm run build

# Deploy no Cloudflare Pages - SEMPRE usar este comando exato:
npx wrangler pages deploy dist --project-name motoristai-v2 --branch MotoristAI_v2
```

## URLs de Acesso

- **Produção:** https://motoristai-v2.pages.dev
- **Branch específico:** https://motoristai-v2.motoristai-v2.pages.dev

## Histórico de Decisões

- **2026-01-11:** Estabelecido `MotoristAI_v2` como branch padrão. NÃO usar `Versao22` ou outros nomes de branch.

## Git - Branch de Desenvolvimento

O código deve ser commitado e pushado para o branch `MotoristAI_v2`:

```bash
git add .
git commit -m "mensagem do commit"
git push origin MotoristAI_v2
```
