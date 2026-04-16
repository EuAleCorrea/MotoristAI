# 🚗 MotoristAI

Aplicativo de gestão financeira inteligente para **motoristas de aplicativo**. Controle suas receitas por plataforma, despesas do veículo, corridas, metas de ganhos e visualize análises detalhadas de desempenho — tudo em um só lugar.

🌐 **Produção:** [motoristai-v2.pages.dev](https://motoristai-v2.pages.dev)

---

## 📋 Índice

- [Stack Tecnológica](#-stack-tecnológica)
- [Pré-requisitos](#-pré-requisitos)
- [Setup Local](#-setup-local)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Branches e Versionamento](#-branches-e-versionamento)
- [Contribuindo](#-contribuindo)

---

## 🧰 Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| **Frontend** | React + TypeScript | 18.x |
| **Build Tool** | Vite | 5.x |
| **Styling** | Tailwind CSS | 3.x |
| **State Management** | Zustand | 4.x |
| **Backend / Auth** | Supabase (Auth + PostgreSQL + RLS) | — |
| **Charts** | ECharts (via echarts-for-react) | 5.x |
| **Animações** | Framer Motion | 11.x |
| **Ícones** | Lucide React | — |
| **Mobile** | Capacitor (Android) | 8.x |
| **Deploy** | Cloudflare Pages | — |

---

## ✅ Pré-requisitos

- **Node.js** ≥ 18.x
- **npm** (incluso com Node.js)
- Conta no [Supabase](https://supabase.com) (para o backend)

---

## 🚀 Setup Local

```bash
# 1. Clone o repositório
git clone https://github.com/EuAleCorrea/MotoristAI.git
cd MotoristAI

# 2. Copie o template de ambiente e preencha com suas credenciais
cp .env.example .env

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:5173`.

### Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run lint` | Executa o ESLint para verificar qualidade do código |
| `npm run preview` | Pré-visualiza o build de produção |

---

## 📁 Estrutura do Projeto

```
MotoristAI/
├── .github/                    # Templates de Issue e PR
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── pull_request_template.md
├── android/                    # Projeto Capacitor Android
├── docs/                       # Documentação do projeto
│   ├── sistema-de-metas.md
│   └── walkthrough-metas-v2.md
├── public/                     # Assets estáticos
├── src/
│   ├── components/             # Componentes reutilizáveis
│   │   ├── dashboard/          #   └── Componentes do Dashboard
│   │   ├── forms/              #   └── Campos de formulário
│   │   ├── layouts/            #   └── Layouts compartilhados
│   │   └── settings/           #   └── Componentes de configurações
│   ├── contexts/               # React Contexts (Theme, etc.)
│   ├── hooks/                  # Custom Hooks
│   ├── pages/                  # Páginas da aplicação
│   │   ├── forms/              #   └── Páginas de formulário
│   │   ├── policies/           #   └── Políticas e termos
│   │   └── settings/           #   └── Páginas de configuração
│   ├── services/               # Clientes de serviço (Supabase)
│   ├── store/                  # Stores Zustand
│   │   ├── entryStore.ts       #   └── Receitas
│   │   ├── expenseStore.ts     #   └── Despesas
│   │   ├── goalStore.ts        #   └── Metas
│   │   ├── tripStore.ts        #   └── Corridas
│   │   ├── platformStore.ts    #   └── Plataformas
│   │   ├── vehicleStore.ts     #   └── Veículos
│   │   └── ...                 #   └── Outros stores
│   └── utils/                  # Funções utilitárias
├── supabase/
│   └── migrations/             # Migrations SQL do banco
├── .env.example                # Template de variáveis de ambiente
├── CONTRIBUTING.md             # Guia de contribuição
├── capacitor.config.ts         # Configuração do Capacitor
├── tailwind.config.cjs         # Configuração do Tailwind CSS
├── vite.config.ts              # Configuração do Vite
└── package.json                # Dependências e scripts
```

---

## 🌿 Branches e Versionamento

### Branch Principal
- **`main`** — Branch de produção. Protegida. Recebe mudanças **apenas via Pull Request**.

### Padrão de Nomes para Branches

| Prefixo | Uso | Exemplo |
|---------|-----|---------|
| `feature/` | Nova funcionalidade | `feature/relatorio-mensal` |
| `fix/` | Correção de bug | `fix/calculo-km` |
| `refactor/` | Refatoração sem mudança funcional | `refactor/store-cleanup` |
| `docs/` | Documentação | `docs/api-reference` |

### Tags de Release
Versões são marcadas com tags no formato `vX.Y.Z`:
- `v2.0.4` — Versão atual
- Tags `-legacy` preservam o histórico de versões anteriores

---

## 🤝 Contribuindo

Leia o [CONTRIBUTING.md](./CONTRIBUTING.md) para entender:
- Convenção de commits
- Fluxo de Pull Requests
- Regras de código e estilo
- Padrões do Supabase (RLS, migrations)

---

## 📄 Licença

Projeto privado. Todos os direitos reservados.
