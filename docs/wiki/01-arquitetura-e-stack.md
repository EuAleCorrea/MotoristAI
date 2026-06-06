---
title: "Arquitetura e Stack Tecnológica"
description: "Visão geral da arquitetura e stack do MotoristAI"
category: "arquitetura"
last_updated: "2026-06-05"
status: "pronto"
tags: [arquitetura, stack, motoristai]
---

# 🏗️ Arquitetura e Stack Tecnológica

Documento de referência técnica. Reflete o estado real do repositório (verificado em `package.json`, `vite.config.ts`, `capacitor.config.ts` e `netlify.toml`).

---

## 🎯 Visão Geral

SPA (Single Page Application) para gestão financeira de motoristas de aplicativo, com:

- **Frontend** React 18 + TypeScript buildado com Vite
- **Backend** Supabase (Postgres + Auth + Row Level Security)
- **Mobile** Android via Capacitor 8 (WebView empacotando o bundle Vite)
- **PWA** opcional via `vite-plugin-pwa` (desativado em build Capacitor)

```
[ Browser / Android WebView ]
            │
            ▼
   Vite SPA (React 18)
            │
            ▼
   Supabase (Postgres + Auth)
```

---

## 💻 Stack por Camada

### Frontend
| Camada | Tecnologia | Versão |
|---|---|---|
| Build | Vite | ^5.3 |
| Framework | React | ^18.3 |
| Linguagem | TypeScript | ^5.5 |
| Roteamento | react-router-dom | ^6.24 |

### UI / Design System
| Camada | Tecnologia | Versão |
|---|---|---|
| Estilização | Tailwind CSS | ^3.4 |
| Primitivos | Radix UI + shadcn (style `radix-nova`) | ^1.4 / ^2.x |
| Ícones | lucide-react | ^0.400 |
| Animações | framer-motion | ^11.18 |
| Utilitários | clsx, tailwind-merge, class-variance-authority | — |

### Estado
| Camada | Tecnologia | Versão |
|---|---|---|
| Store global | Zustand | ^4.5 |
| Persistência local | `zustand/persist` (localStorage) | — |

### Dados / Visualização
| Camada | Tecnologia | Versão |
|---|---|---|
| Cliente Supabase | @supabase/supabase-js | ^2.90 |
| HTTP | axios | ^1.7 |
| Gráficos | echarts + echarts-for-react | ^5.5 / ^3.0 |
| Datas | date-fns | ^3.6 |
| PDF | jsPDF | ^4.2 |
| Captura de tela | html2canvas | ^1.4 |

### Mobile / PWA
| Camada | Tecnologia | Versão |
|---|---|---|
| Wrapper nativo | @capacitor/core / cli / android | ^8.3 |
| Autenticação biométrica | @aparajita/capacitor-biometric-auth | ^10 |
| Login social (em transição) | @capgo/capacitor-social-login | ^8.3 |
| Splash screen | @capacitor/splash-screen | ^8.0 |
| Browser in-app | @capacitor/browser | ^8.0 |
| PWA | vite-plugin-pwa | ^0.20 |

### Qualidade
| Camada | Tecnologia | Versão |
|---|---|---|
| Lint | ESLint 9 (config flat) | ^9.5 |
| Tipos | TypeScript 5 + plugin TS-ESLint 7 | — |
| Hooks React | eslint-plugin-react-hooks 4 | — |

> ⚠️ O lint apresenta erro pré-existente `ConfigError: Unexpected key "0"` em `eslint.config.js` (não impacta build/runtime).
> ⚠️ O type-check apresenta ~100 erros pré-existentes (incompatibilidade `date-fns` v3 em ~30 arquivos — não impacta build/runtime porque Vite só transpila).

---

## 🗄️ Backend (Supabase)

- **Auth**: Supabase Auth (email/senha, magic link opcional)
- **Banco**: PostgreSQL com RLS obrigatório em todas as tabelas
- **Storage**: bucket `note_photos` (com RLS por pasta)
- **Migrations**: 7 arquivos em `supabase/migrations/` + `add_goals_unique_constraint.sql`

Tabelas: `entries`, `expenses`, `trips`, `goals`, `vehicles`, `vehicle_expenses`, `platforms`, `family_expenses`, `expense_categories`, `recurrences`, `installments`, `maintenance_rules`, `maintenance_history`, `odometer_entries`, `photo_notes`, `user_preferences`.

Variáveis de ambiente (somente `VITE_`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

> ⚠️ A `service_role` key **nunca** é exposta no cliente (resolvido em SEC-001, ver `docs/vulnerabilities.md`).

---

## 📱 Mobile (Capacitor)

`capacitor.config.ts`:
- `appId`: `com.motoristai.app`
- `appName`: `MotoristAI`
- `webDir`: `dist` (após `vite build`)
- `androidScheme`: `https`
- `allowMixedContent`: `false`
- Splash: `#0A0F1C` por 3000 ms
- `scaleType`: `CENTER_CROP`

Build Android: `npm run build:android` → `npx cap sync android` → abrir em Android Studio.

---

## 🏗️ Build

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "build:android": "vite build && npx cap sync android",
  "android:open": "npx cap open android",
  "android:sync": "npx cap sync android",
  "android:run": "npx cap run android",
  "preview": "vite preview",
  "lint": "eslint ."
}
```

**Importante**: `vite.config.ts` define `build.inlineDynamicImports: true` para contornar o erro `Failed to fetch dynamically imported module` no WebView Android (Capacitor não implementa dynamic imports corretamente).

---

## 🚀 Deploy

Definido em `netlify.toml`:
```toml
[build]
  command = "yarn build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

> ⚠️ O `command = "yarn build"` está inconsistente com o restante do projeto que usa `npm` (`package-lock.json` versionado). Veja `docs/vulnerabilities.md` ou abra frente de débitos de config.

---

## 🗂️ Estrutura de Pastas

```
src/
├── components/        # Layout, Header, modais, dashboard, insights, forms
├── pages/             # Páginas de rota + forms em pages/forms/
├── store/             # 19+ stores Zustand
├── hooks/             # useBiometricAuth, useInsightsData, useOnboarding...
├── contexts/          # AuthContext, ThemeContext
├── services/          # supabase client, pdfReport
├── utils/             # dateHelpers, formatters, exportCsv
├── App.tsx            # Definição de rotas
├── main.tsx           # Bootstrap
└── index.css          # Design system iOS premium (CSS vars)
supabase/migrations/   # Schema e RLS
android/               # Projeto Android gerado pelo Capacitor
docs/                  # Documentação técnica
```

---

## 🧭 Roteamento

Declarado em `src/App.tsx`. Todas as rotas (exceto `/`, `/login` e políticas) passam por `<ProtectedRoute><Layout>...</Layout></ProtectedRoute>`.

Convenções:
- `/despesas/veiculo/{tipo}` → form de criar
- `/despesas/veiculo/{tipo}/:id/editar` → form de editar
- `/despesas/veiculo/{tipo}/lista` → listagem (quando existe)
- `/despesas/veiculo` → listagem agregada (`VehicleExpensesList`)
- `/despesas/familia/*` → análogo para família
- `/cadastros/*` → telas de cadastro (veículos, plataformas, recorrências, preferências)
- `/alertas/*` → alertas de manutenção e despesas recorrentes
