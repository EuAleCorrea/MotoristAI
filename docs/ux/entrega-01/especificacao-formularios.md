# Especificação de formulários — validação e desfazer

**Entrega 01 · revisão 02 (ajustes 1 e 2 solicitados na revisão da arquitetura)**
Escopo: regras de obrigatoriedade por categoria e comportamento da ação Desfazer.

---

## 1. Princípios

1. **Nenhum campo obrigatório fica escondido.** Se uma categoria exige um dado, o campo
   aparece na superfície do formulário — nunca atrás de "Mais detalhes". Campo obrigatório
   invisível é o erro mais caro em formulário progressivo.
2. **O essencial salva.** Segmento, categoria e valor bastam para gravar. Obrigatoriedade
   adicional é rara e sempre visível.
3. **Erro se mostra no momento certo**, não a cada tecla.
4. **Desfazer é conveniência, não garantia.** Toda ação destrutiva também tem confirmação
   própria — Desfazer não substitui confirmação.

---

## 2. Campos comuns a toda movimentação

| Campo | Obrigatório | Regra |
|:--|:--|:--|
| Segmento (Veículo / Família) | Sim | Pré-selecionado se houver só um veículo ativo |
| Categoria | Sim | Lista filtrada pelo segmento |
| Valor | Sim | Maior que zero, até 2 casas, máximo 999.999,99, máscara pt-BR |
| Data | Não | Padrão: hoje. Futura exige confirmação; anterior a 5 anos é bloqueada |
| Forma de pagamento | Não | Dinheiro, débito, crédito, pix, vale |
| Observação | Não | 200 caracteres |
| Anexo (nota por foto) | Não | Até 3 arquivos, 10 MB cada, JPEG/PNG/PDF |

---

## 3. Obrigatoriedade específica por categoria

### Despesas do veículo

| Categoria | Obrigatórios além dos comuns | Recomendados (aviso, não bloqueia) | Opcionais |
|:--|:--|:--|:--|
| Energia / Combustível | Tipo (gasolina, etanol, diesel, GNV, elétrico) e Litros ou kWh | Odômetro (km) — sem ele o custo por km fica impreciso | Posto, preço por litro (autocalculado) |
| Manutenção | Tipo de serviço | Odômetro (km) | Oficina, garantia |
| Pedágio / Estacionamento | — | Odômetro (km) | Local |
| Financiamento | Número da parcela (n de total) | Vencimento | Banco, taxa de juros |
| Depreciação | Período de apuração | Odômetro inicial e final do período | — |

### Despesas da família

| Categoria | Obrigatórios além dos comuns | Recomendados | Opcionais |
|:--|:--|:--|:--|
| Moradia | Tipo (aluguel, condomínio, energia, água, internet) | Vencimento | — |
| Alimentação | — | — | Estabelecimento |
| Saúde | — | — | Profissional ou plano |
| Educação | — | — | Instituição |
| Lazer | — | — | Estabelecimento |
| Outras | Descrição | — | — |

### Receitas

| Origem | Obrigatórios além dos comuns | Recomendados | Opcionais |
|:--|:--|:--|:--|
| Por plataforma (entrada agregada) | Plataforma | Número de corridas | Odômetro (km) |
| Corrida individual | Plataforma | Distância (km) — alimenta receita por km | Km inicial e final |

> **Sobre a corrida individual:** distância é recomendada, não obrigatória, para não travar
> o registro rápido. Quando ausente, o bloco "Receita por km" em Relatórios mostra cobertura
> parcial ("baseado em 78% das corridas do período").

### Regras de coerência entre campos

- Odômetro não pode retroceder em relação ao último registro do veículo. Diferença de até 5%
  para baixo pede confirmação; acima disso, bloqueia com mensagem.
- Preço por litro é derivado (valor ÷ litros) e somente leitura, a menos que o usuário edite
  o campo manualmente.
- Número da parcela deve estar entre 1 e o total informado.
- Ao trocar de segmento, categorias incompatíveis são limpas. Se havia valor preenchido,
  pedir confirmação antes de limpar.

---

## 4. Exibição de erros

| Situação | Comportamento |
|:--|:--|
| Digitação | Não valida a cada tecla |
| Saída do campo (blur) | Valida e mostra erro abaixo do campo |
| Toque em Salvar | Valida tudo, rola até o primeiro erro e o destaca |
| Campo obrigatório da categoria | Sempre visível; nunca é revelado por erro |
| Mensagem | 12 sp, cor `negative`, abaixo do campo, texto específico |
| Foco | O primeiro campo com erro recebe foco e o teclado correspondente |

**Estado do botão Salvar**

- Habilita quando segmento, categoria e valor estão válidos.
- Se existir obrigatório de categoria pendente, o toque não grava: marca o campo e rola até ele.
- Nunca fica permanentemente desabilitado sem explicação visível.

---

## 5. Ação Desfazer

### 5.1 Quando está disponível

| Ação | Desfazer | Janela | Efeito do desfazer |
|:--|:--|:--|:--|
| Criar lançamento (receita ou despesa) | Sim | 5 s | Remove o registro criado |
| Editar lançamento | Sim | 5 s | Restaura o estado anterior completo |
| Excluir lançamento | Sim | 5 s | Recria com o mesmo id e os mesmos dados |
| Importar extrato (lote) | Sim | 5 s | Remove o lote inteiro importado |
| Excluir veículo, conta ou categoria em uso | Não | — | Exige confirmação destrutiva |
| Exportar PDF ou CSV | Não | — | Efeito fora do app |
| Enviar suporte ou abrir link externo | Não | — | Efeito fora do app |
| Alterar tema, biometria ou preferências | Não | — | Reversível pelo próprio controle |
| Lançamento por voz antes de salvar | Não | — | Cancelar no formulário já descarta |

### 5.2 Regras

- **Janela de 5 segundos** (padrão Material). O snackbar some e o Desfazer expira junto.
- **Um Desfazer por vez.** Um novo snackbar substitui o anterior; a janela anterior é perdida.
- **Trocar de tela ou de destino encerra a janela.** Ao voltar, não existe mais Desfazer.
- **Desfazer de exclusão restaura o registro com o mesmo id**, preservando data de criação e
  vínculos (veículo, categoria, recorrência).
- **Desfazer não desfaz efeitos externos.** Se a ação agendou lembrete ou notificação, o
  desfazer cancela a operação local, mas não reenvia nada.
- **Sem confirmação dupla.** Após desfazer, exibir apenas snackbar informativo ("Desfeito"),
  sem botão.
- **Falha ao desfazer** (rede): manter o registro, informar erro e oferecer nova tentativa.

### 5.3 Copy

| Momento | Texto |
|:--|:--|
| Após criar | "Receita salva · Desfazer" |
| Após editar | "Lançamento atualizado · Desfazer" |
| Após excluir | "Lançamento excluído · Desfazer" |
| Após importar | "32 lançamentos importados · Desfazer" |
| Após desfazer | "Desfeito" |

---

## 6. Teclado e área segura

- Campo de valor abre teclado numérico decimal direto; foco no campo ao abrir a tela.
- A ação Salvar fica na TopAppBar, não em rodapé fixo — assim nunca é encoberta pelo teclado.
- O conteúdo aplica `imePadding`: nenhum campo obrigatório pode ficar sob o teclado.
- Botão físico de voltar com alterações pendentes pede confirmação de descarte.
