# Git Workflow - MotoristAI

Guia definitivo para commit, push e atualizacao do repositorio GitHub.
Qualquer agente AI ou desenvolvedor deve seguir EXATAMENTE estes passos.

---

## Informacoes do Repositorio

| Campo        | Valor                                                |
| :----------- | :--------------------------------------------------- |
| **Remote**   | `origin`                                             |
| **URL**      | `https://github.com/EuAleCorrea/MotoristAI.git`     |
| **Branch**   | `main`                                               |
| **Diretorio**| `z:\Documentos\Projetos\MotoristAI`                 |

---

## Passo a Passo (Copiar e Colar)

### 1. Verificar o estado atual

```powershell
cd z:\Documentos\Projetos\MotoristAI
git status
```

Isso mostra quais arquivos foram modificados, adicionados ou removidos.

### 2. Adicionar TODOS os arquivos ao staging

```powershell
git add -A
```

> O `-A` adiciona arquivos novos, modificados e deletados de uma vez.

### 3. Verificar o que sera commitado

```powershell
git status --short
```

Confirme que os arquivos listados sao os corretos. Arquivos com `A` sao novos, `M` sao modificados, `D` sao deletados.

### 4. Criar o commit com mensagem descritiva

```powershell
git commit -m "tipo: descricao curta do que foi feito"
```

**Tipos de commit padrao:**
- `feat:` nova funcionalidade
- `fix:` correcao de bug
- `docs:` alteracao em documentacao
- `refactor:` refatoracao de codigo
- `chore:` tarefas de manutencao

**Exemplo com corpo detalhado (multiplas linhas):**

```powershell
git commit -m "feat: descricao principal" -m "- Detalhe 1" -m "- Detalhe 2" -m "- Detalhe 3"
```

### 5. Enviar para o GitHub (push)

```powershell
git push origin main
```

### 6. Confirmar que deu certo

```powershell
git log -1 --oneline
```

Deve mostrar o hash e a mensagem do ultimo commit.

---

## Exemplo Completo (Copie e Execute)

```powershell
cd z:\Documentos\Projetos\MotoristAI
git add -A
git status --short
git commit -m "feat: descricao do que foi feito"
git push origin main
git log -1 --oneline
```

---

## Regras Importantes

1. **NUNCA** commite a pasta `.agent/` (ja esta no `.gitignore`).
2. **NUNCA** commite o arquivo `.env` (ja esta no `.gitignore`).
3. **SEMPRE** use mensagens de commit descritivas em ingles.
4. **SEMPRE** faca `git status` antes do commit para revisar o que sera enviado.
5. O diretorio de trabalho e SEMPRE `z:\Documentos\Projetos\MotoristAI`.
6. O remote e SEMPRE `origin` e a branch e SEMPRE `main`.
