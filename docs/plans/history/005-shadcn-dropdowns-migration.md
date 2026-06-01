# Plano 005: Padronização de Dropdowns e Otimização Premium para Mobile

**Status:** ✅ Concluído
**Data de Conclusão:** 2026-05-31
**Autor:** Antigravity

## 🎯 Objetivo
Substituir todos os elementos de dropdown nativos (`<select>`) pelo componente unificado `AppSelect` baseado no `DropdownMenu` do shadcn, garantindo consistência visual premium (iOS HIG), contraste perfeito em temas Dark/Light e um posicionamento acoplado diretamente sob o botão disparador.

## 🚩 Ações Realizadas

1. **Criação do Componente Base Híbrido (`AppSelect`)**:
   * Desenvolvido um wrapper unificado baseado no `DropdownMenu` + `DropdownMenuRadioGroup` do shadcn.
   * Acoplado o menu suspenso diretamente abaixo do botão disparador utilizando a largura dinâmica `w-[var(--radix-dropdown-menu-trigger-width)]`.
   * Adicionada micro-animação na setinha (`ChevronDown`) que gira 180° e muda de cor para azul quando o menu está aberto.
   * Adicionado brilho e borda azul ativa no trigger quando aberto.
   * Implementada a seleção em círculo (radio) na direita da opção com fundo azul e check branco quando ativa.

2. **Varredura e Migração Global**:
   * Substituídos todos os `<select>` nativos do código de produção de forma cirúrgica, cobrindo:
     * Componentes compartilhados (`FormSelect`, `VehicleSelector`, `PlatformSelector`, `CategorySelector`).
     * Modais do dashboard (`GoalModal`, `TripModal`, `ExpenseModal`).
     * Filtros globais e telas de visualização (`GlobalFilters`, `MonthlyView`, `AnnualView`).
     * Páginas de formulários das seções *Vehicle* e *Family*.
     * Todas as páginas de configurações (*Settings*).

3. **Geração do Build Android**:
   * Compilados os novos arquivos em build de produção (`npm run build`).
   * Sincronizados os assets web e plugins nativos do Capacitor no projeto nativo Android (`npx cap sync android`).

## 📝 Notas de Execução & Lições Aprendidas

* **Bug de Visibilidade**: Durante a implementação do check à direita, o seletor amplo `[&>span]:hidden` ocultou acidentalmente o próprio texto das opções. O problema foi corrigido de forma precisa com a classe `[&>span.absolute]:hidden`, que oculta somente o marcador de bolinha nativo do Radix UI posicionado na esquerda.
* **Fundo Legível**: Evitamos o uso de transparências (`backdrop-filter`) na lista para impedir a sobreposição de textos do formulário de fundo, utilizando `bg-[var(--ios-sheet-bg)]` (fundo de folha opaco) que garante contraste ideal nos modos claro e escuro.
* **Atualização no Aparelho**: Documentada a necessidade de reinstalar o aplicativo no dispositivo móvel físico (`npx cap run android`) após a sincronização do Capacitor para que os assets web atualizados entrem em vigor.
