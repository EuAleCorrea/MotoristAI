---
title: "Schema do Banco de Dados"
description: "Modelagem de dados e schemas das tabelas do MotoristAI"
category: "banco-de-dados"
last_updated: "2026-05-22"
status: "rascunho"
---

# 🗄️ Schema do Banco de Dados

Descreva aqui o dicionário de dados do banco de dados do projeto **MotoristAI**.

## 📊 Diagrama ER (Sugerido)
```mermaid
erDiagram
    USERS ||--o{ TASKS : "create"
    USERS {
        uuid id PK
        string email
        timestamp created_at
    }
    TASKS {
        int id PK
        uuid user_id FK
        string title
        string status
    }
```
