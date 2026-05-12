# MotoristAI — FAQ da Tela de Insights
> Guia completo de todos os indicadores, métricas e gráficos disponíveis na seção de análise inteligente da operação.

---

## Sumário

1. [Visão Geral](#visão-geral)
2. [Painel de Resumo](#painel-de-resumo)
3. [Alertas Inteligentes](#alertas-inteligentes)
4. [Progresso da Meta](#progresso-da-meta)
5. [Evolução Diária](#evolução-diária)
6. [Tendência de Performance](#tendência-de-performance)
7. [Mapa de Calor Horário](#mapa-de-calor-horário)
8. [Eficiência Operacional](#eficiência-operacional)
9. [Análise por Plataforma](#análise-por-plataforma)
10. [Composição do Faturamento](#composição-do-faturamento)
11. [Análise de Custos](#análise-de-custos)
12. [Comparativo de Período](#comparativo-de-período)
13. [Ponto de Equilíbrio](#ponto-de-equilíbrio)
14. [Projeção Mensal](#projeção-mensal)
15. [Score do Motorista](#score-do-motorista)

---

## Visão Geral

**O que é a tela de Insights do MotoristAI?**

É o centro de inteligência do app. Ela transforma os dados brutos das suas corridas — valores, horários, distâncias e despesas — em informações visuais e acionáveis. Em vez de somar planilhas no final do mês, você enxerga em tempo real o que está funcionando e o que precisa mudar para ganhar mais.

**Para quem essa tela foi feita?**

Para qualquer motorista de aplicativo que queira parar de trabalhar no escuro. Seja você que roda na Uber, na 99, no InDriver ou em todas ao mesmo tempo, os Insights consolidam tudo num único lugar e mostram exatamente como maximizar o lucro por hora trabalhada.

**Como o app obtém esses dados?**

De duas formas. A primeira é o registro manual: você cadastra cada corrida, receita e despesa diretamente no app. A segunda é a captura automática via Serviço de Acessibilidade do Android, que lê as informações diretamente dos apps da Uber e da 99 cada vez que uma corrida é concluída, sem que você precise digitar nada.

**Os dados ficam no meu celular ou vão para a nuvem?**

Todos os cálculos e exibições são feitos localmente, no seu dispositivo. Seus dados de corrida são seus.

**Posso filtrar os Insights por período?**

Sim. No topo da tela há um seletor de período com as opções: Hoje, Semana, Mês e Personalizado. Todos os indicadores da tela atualizam simultaneamente ao trocar o período.

---

## Painel de Resumo

> Faixa com quatro números no topo da tela, sempre visível.

**O que é o Faturamento?**

É o total bruto recebido de todas as corridas no período selecionado. Inclui o valor base de cada viagem mais qualquer bônus ou gorjeta registrado. É o número que as plataformas mostram para você — antes de descontar qualquer custo.

**O que são as Despesas?**

É a soma de todos os gastos que você registrou no período: combustível, lavagem, manutenção, multas, depreciação ou qualquer outra categoria que você criar. Quanto mais detalhado for o registro, mais precisa será a análise de custos.

**O que é o Lucro?**

É o que sobra de verdade no seu bolso. Calculado como Faturamento menos Despesas. Esse é o número que realmente importa — não o faturamento bruto. Dois motoristas com o mesmo faturamento podem ter lucros completamente diferentes dependendo de como controlam os custos.

**O que é o R$/Hora?**

É o seu rendimento líquido por cada hora efetivamente trabalhada. Calculado dividindo o Lucro pelo total de horas registradas no período. Esse indicador é a melhor forma de comparar dois dias, duas semanas ou dois períodos diferentes, independente de quantas horas você trabalhou em cada um.

---

## Alertas Inteligentes

> Aparecem sempre no topo da seção de análise, antes de qualquer gráfico.

**O que são os Alertas Inteligentes?**

São notificações geradas automaticamente pelo app a partir dos seus próprios dados históricos. Eles não são genéricos — são calculados com base no seu padrão de operação específico e avisam sobre oportunidades e riscos em tempo real.

**Que tipo de alerta o app gera?**

O app monitora seis situações automaticamente:

- **Pico próximo:** quando o horário atual é próximo de uma janela historicamente lucrativa no seu histórico, o app avisa para você se posicionar antes que a demanda comece.
- **Despesas em alta:** quando seus gastos do período estão mais de 20% acima da sua média dos últimos 7 dias, o app sinaliza para você investigar a causa.
- **Meta em risco:** quando a projeção do ritmo atual indica que você vai fechar o período abaixo da meta cadastrada, o app calcula exatamente quanto você precisa ganhar por dia nos dias restantes para ainda bater a meta.
- **KM vazio alto:** quando mais de 35% dos quilômetros rodados estão sendo percorridos sem passageiro, o app alerta porque isso significa combustível sendo queimado sem retorno.
- **Plataforma ineficiente:** quando uma das plataformas que você usa está gerando um R$/hora mais de 30% abaixo das demais, o app sugere priorizar as outras.
- **Pausa recomendada:** quando o app detecta mais de 4 horas de trabalho contínuo sem intervalo registrado.

**Por que os alertas aparecem antes dos gráficos?**

Porque são acionáveis agora. Um alerta de pico em 40 minutos só é útil se você o vê antes de o horário passar. Os gráficos são para análise; os alertas são para decisão imediata.

**Os alertas são personalizados para mim ou são iguais para todo mundo?**

São calculados individualmente para você, com base no seu próprio histórico. O "horário de pico" que o app identifica é baseado nos seus melhores horários, não em uma média genérica de outros motoristas.

---

## Progresso da Meta

**Como funciona a meta de período?**

Você cadastra uma meta de faturamento ou lucro para o período (semana ou mês). O app acompanha seu progresso em tempo real e mostra, na forma de uma barra visual, o quanto você já realizou versus o quanto ainda falta.

**O que significa "Abaixo do ritmo"?**

Significa que, mantendo o ritmo atual de ganhos, você não vai atingir a meta até o final do período. O app calcula automaticamente quanto você precisaria ganhar por dia nos dias restantes para ainda fechar no alvo.

**Como o app calcula o valor necessário por dia?**

Simples: (Meta − Lucro atual) ÷ Dias restantes no período. Se você tem uma meta de R$ 2.250, já ganhou R$ 258 e ainda tem 9 dias de trabalho planejados, o app mostra que você precisa de R$ 281 por dia para bater a meta.

**E se eu trabalhar menos dias do que o planejado?**

O cálculo atualiza. Quando você registra os dias que realmente trabalhou, o denominador muda e o valor necessário por dia é recalculado automaticamente.

**A meta serve só para pressionar ou tem outra função?**

Ela é principalmente um calibrador de ritmo. Muitos motoristas trabalham "até sentir que ganhou o suficiente", o que é subjetivo e inconsistente. Com a meta e o indicador de ritmo, você sabe objetivamente se pode encerrar o dia ou se precisa de mais algumas corridas.

---

## Evolução Diária

**O que mostra o gráfico de evolução diária?**

Um gráfico de barras com o lucro líquido de cada dia do período selecionado. Dias já trabalhados aparecem com barras sólidas e coloridas. O melhor dia do período é destacado em verde. Dias futuros aparecem com barras tracejadas, representando a projeção baseada no ritmo atual.

**Por que o melhor dia fica em verde?**

Para você identificar rapidamente o que foi diferente naquele dia — horário em que saiu, quantas horas trabalhou, se foi fim de semana ou dia de chuva — e tentar replicar as condições.

**Como funciona a projeção dos dias futuros?**

O app usa a média de lucro dos dias já trabalhados no período para projetar os dias restantes. Não é uma previsão do futuro, é uma extrapolação do seu ritmo atual — útil para visualizar onde você vai chegar se nada mudar.

**O gráfico muda se eu adicionar uma corrida retroativamente?**

Sim. Sempre que novos dados são registrados, todos os gráficos recalculam e redesenham.

---

## Tendência de Performance

**O que é a sparkline de tendência?**

É um gráfico de linha que mostra a evolução do seu R$/hora ao longo dos dias do mês. A linha sobe quando você está ficando mais eficiente e desce quando está perdendo rendimento por hora.

**Por que acompanhar R$/hora e não só o lucro total?**

Porque o lucro total é afetado por quantas horas você trabalhou — um dia com 12h de trabalho naturalmente tem mais lucro que um dia com 4h. O R$/hora normaliza isso e mostra se sua eficiência está melhorando ou piorando, independente da carga horária.

**O que significa o badge "Melhorando"?**

O app compara a inclinação da linha nos últimos dias com o início do período. Se a tendência é de alta, aparece "Melhorando" em verde. Se está estável, "Estável" em âmbar. Se está caindo, "Caindo" em vermelho.

**O que eu faço quando a tendência está caindo?**

Esse é o momento de olhar para os outros indicadores e entender a causa. Despesas subindo? Você está saindo em horários menos lucrativos? O mapa de calor horário e a análise de custos ajudam a responder isso.

---

## Mapa de Calor Horário

**O que é o mapa de calor horário?**

É uma visualização com 8 faixas horárias do dia (das 6h às 22h), colorida por intensidade de rendimento. Verde escuro significa a faixa mais lucrativa, cinza escuro significa a menos lucrativa. Abaixo de cada faixa está o R$/hora médio que você obteve naquele horário.

**Esses dados são meus ou são de outros motoristas?**

São exclusivamente seus. O mapa é calculado com base no seu histórico dos últimos 30 dias. A faixa que aparece como "melhor horário" é a que funcionou melhor para você, na sua cidade, com sua estratégia.

**O que é o insight automático no rodapé do mapa?**

É uma frase gerada automaticamente que traduz o dado visual em ação concreta. Por exemplo: "Saia às 17h — vale R$ 30/h a mais que o turno da manhã." Ela compara a melhor faixa com a pior para mostrar o custo de oportunidade de trabalhar no horário errado.

**O mapa muda com o tempo?**

Sim, ele é atualizado continuamente à medida que você registra novas corridas. Nos primeiros dias de uso, os dados são poucos e menos confiáveis. Após 30 dias de uso consistente, ele se torna um retrato preciso do seu padrão de demanda.

**Por que há diferença tão grande entre horários?**

Porque a demanda por transporte não é uniforme ao longo do dia. Há picos claros no horário de entrada e saída de escritórios, em eventos, em períodos de chuva e em determinados dias da semana. O mapa mostra como esses padrões se traduzem em dinheiro real para você.

---

## Eficiência Operacional

**O que é a Taxa de Ocupação?**

É o percentual do tempo trabalhado em que você estava efetivamente transportando um passageiro. Se você trabalhou 7,5 horas e rodou com passageiro por 5,1 horas, sua taxa de ocupação é de 68%. O restante é tempo ocioso — esperando corridas, deslocando vazio ou fazendo pausa.

**Uma taxa de ocupação de 68% é boa ou ruim?**

Acima de 65% é considerado bom para a maioria das cidades brasileiras. Abaixo de 50% indica que você está passando mais tempo esperando do que rodando, o que geralmente significa que a estratégia de posicionamento ou o horário de trabalho pode ser melhorado.

**O que é KM Vazio?**

São os quilômetros rodados sem passageiro — o deslocamento até um passageiro após aceitar uma corrida, mais qualquer movimentação feita à procura de demanda. KM vazio gera custo (combustível, desgaste) sem gerar receita. Quanto menor, melhor.

**Por que o KM Vazio importa tanto?**

Porque ele afeta diretamente seu custo por km e, consequentemente, seu lucro real. Se você rodou 115 km no dia mas 37 deles foram vazios (32%), significa que quase um terço do seu combustível e desgaste foi gasto sem retorno. Reduzir o KM vazio é uma das formas mais eficientes de aumentar o lucro sem trabalhar mais horas.

**O que são Corridas por Hora?**

É a quantidade média de corridas concluídas por hora trabalhada. Um valor de 2,3 corridas/hora significa que, em cada hora ligado, você completou 2,3 viagens em média. Esse indicador mede sua cadência de operação — útil para comparar entre diferentes horários e plataformas.

**O que é o Tempo Médio por Corrida?**

É o tempo médio decorrido desde o aceite da corrida até o desembarque do passageiro, incluindo o deslocamento até ele. Corridas mais longas tendem a ter ticket maior mas reduzem o número de viagens por hora. Entender esse equilíbrio ajuda a decidir se vale aceitar corridas de longa distância.

---

## Análise por Plataforma

**O que mostra a análise por plataforma?**

Uma comparação visual do faturamento e da eficiência de cada plataforma que você usa — Uber, 99, InDriver ou outras. Você vê, lado a lado, quanto cada plataforma está contribuindo para o seu faturamento total e qual delas gera mais por hora trabalhada.

**Por que é importante comparar plataformas?**

Porque plataformas diferentes têm dinâmicas distintas: valores de corrida, frequência de chamadas, áreas de cobertura e políticas de bônus variam bastante. Um motorista que descobre que a 99 gera R$ 10/hora a mais que a Uber no seu horário de operação tem uma informação valiosa para ajustar sua estratégia.

**O app me diz qual plataforma devo priorizar?**

Sim. O badge "Mais eficiente" é atribuído automaticamente à plataforma com o maior R$/hora no período. E o alerta de "plataforma ineficiente" acende quando uma delas está gerando rendimento muito abaixo das demais.

**Preciso usar mais de uma plataforma para essa análise funcionar?**

Não. Se você usa só a Uber, a análise de plataforma mostra os dados da Uber em detalhe. O recurso fica mais poderoso quando há pelo menos duas plataformas para comparar.

---

## Composição do Faturamento

**O que mostra o gráfico de composição?**

Um gráfico de rosca (donut) que divide o faturamento total em três categorias: valor base das corridas, bônus pagos pelas plataformas e gorjetas ou receitas extras. Cada fatia mostra o percentual e o valor absoluto da categoria.

**Para que serve saber de onde vem o dinheiro?**

Para tomar decisões estratégicas. Se uma parte significativa do seu faturamento vem de bônus sazonais ou de metas de corridas, você sabe que esse valor pode desaparecer e que seu faturamento base real é menor. Isso é essencial para calcular uma meta mensal realista.

**O que são os "bônus de plataforma"?**

São valores extras pagos pelas plataformas além do valor da corrida: bônus por atingir número de corridas numa janela de tempo, incentivos em horários de alta demanda (surge/preço dinâmico que repassa parte ao motorista), bônus de novos cadastros, entre outros.

**O que entra em "Gorjeta / Extra"?**

Qualquer receita registrada manualmente fora das corridas padrão: gorjetas em dinheiro, fretes avulsos, corridas combinadas diretamente com passageiros fixos, etc.

---

## Análise de Custos

**O que mostra a análise de custos?**

Um detalhamento das suas despesas por categoria — combustível, depreciação do veículo, manutenção e outros — com uma barra empilhada mostrando a proporção de cada uma. O objetivo é dar visibilidade sobre onde o dinheiro está saindo.

**O que é a depreciação e por que ela aparece como custo?**

Depreciação é a perda de valor do seu veículo pelo uso. Cada km rodado faz seu carro valer um pouco menos. Motoristas de aplicativo costumam ignorar esse custo porque ele não sai do bolso imediatamente, mas ele é real — quando você vender o carro, vai receber menos por ele do que se tivesse rodado menos. O app inclui um valor padrão de depreciação por km que você pode ajustar nas configurações.

**O que é o Custo Real por KM?**

É o total de despesas dividido pelo total de km rodados no período. Diferente do custo de combustível isolado, o custo real por km inclui todos os gastos — combustível, manutenção, depreciação e outros. É o custo verdadeiro de cada km que o seu carro percorre.

**Por que o badge de variação de custo é importante?**

Porque custos sobem silenciosamente. Uma alta de 33% nas despesas numa semana pode indicar manutenção extraordinária, aumento no preço do combustível ou mudança de hábito (mais km vazio, por exemplo). O badge alerta imediatamente quando os custos fogem do padrão.

**Como interpreto a barra empilhada de custos?**

Cada cor representa uma categoria. Quanto maior a fatia de combustível, mais sensível sua operação está ao preço da gasolina. Se a fatia de manutenção crescer, é sinal de que o veículo está precisando de mais atenção — o que pode piorar progressivamente se não tratado.

---

## Comparativo de Período

**O que é o comparativo de período?**

Uma tabela que coloca lado a lado as métricas do período atual e do período imediatamente anterior (semana atual vs. semana passada, ou mês atual vs. mês passado). O valor anterior aparece riscado em cinza e o atual aparece com a variação em percentual.

**Quais métricas são comparadas?**

Cinco indicadores principais: Lucro líquido, R$/hora, número de viagens, ticket médio por corrida e total de despesas.

**Por que as despesas aparecem em vermelho quando sobem, mas o lucro em verde quando sobe?**

Porque a lógica de cor é semântica — verde significa "bom para você" e vermelho significa "ruim para você". Despesas subindo são ruins (vermelho). Lucro subindo é bom (verde). Despesas caindo são boas (verde). O app aplica essa lógica invertida automaticamente para cada métrica.

**O que fazer se o ticket médio está caindo enquanto as viagens aumentam?**

Isso significa que você está fazendo mais corridas, mas cada uma vale menos. Pode ser sinal de que você está aceitando corridas curtas demais ou que as plataformas reduziram a tarifa na sua região. Vale cruzar essa informação com a análise por plataforma para identificar qual delas está puxando o ticket para baixo.

---

## Ponto de Equilíbrio

**O que é o ponto de equilíbrio (break-even)?**

É o valor que você precisa faturar para cobrir 100% das despesas do dia. A partir do momento em que suas corridas somam o valor do break-even, tudo que vier depois é lucro puro, sem descontar nenhum custo adicional.

**Por que isso é psicologicamente importante?**

Porque muda a forma como você enxerga o trabalho. Quando você sabe que, após as primeiras corridas do dia, já cobriu todos os custos, cada corrida adicional parece um bônus. Motoristas que acompanham o break-even tendem a ter mais motivação para continuar trabalhando depois que atingem esse ponto.

**O que significa "Lucro por corrida extra"?**

É o seu lucro médio por viagem após o break-even ter sido atingido. Como os custos fixos do dia já estão cobertos, cada corrida adicional gera esse valor de forma praticamente integral. Por exemplo, se seu lucro médio por viagem é R$ 15,17, é exatamente isso que entra no seu bolso em cada corrida após o break-even.

**O break-even muda ao longo do dia?**

Não — ele é calculado com base nas despesas totais registradas para o dia. O que muda é o seu progresso em relação a ele: o app mostra em tempo real se você já ultrapassou ou ainda está abaixo do ponto de equilíbrio.

---

## Projeção Mensal

**Como funciona a projeção mensal?**

O app pega o seu lucro médio por dia trabalhado no mês atual e multiplica pelo número de dias que você planejou trabalhar no mês. O resultado é a estimativa de fechamento do mês se o ritmo atual for mantido.

**A projeção leva em conta que alguns meses têm mais dias úteis?**

Sim. O cálculo usa o número de dias que você configurou como "dias planejados para trabalhar" no mês, não o total de dias do calendário. Você controla essa variável nas configurações.

**O que significa a barra de progresso da projeção?**

Ela mostra quantos dos dias planejados do mês já foram trabalhados. Se você planejou 22 dias e já trabalhou 3, a barra está em 14%. É uma referência temporal para contextualizar o lucro acumulado.

**O que acontece se a projeção ficar acima da meta mensal?**

Aparece um badge verde com o valor do excedente projetado — por exemplo, "+R$ 640 vs meta". Isso é um sinal positivo de que você pode trabalhar menos dias do que o planejado e ainda bater a meta, ou que vai superar a meta se mantiver o ritmo.

**A projeção é garantida?**

Não. É uma extrapolação matemática do ritmo atual. Condições reais — clima, eventos, flutuações de demanda — podem fazer o resultado final ser diferente. A projeção serve como referência para decisões de curto prazo, não como certeza.

---

## Score do Motorista

**O que é o Score do Motorista?**

É uma pontuação de 0 a 100 que mede a sua eficiência operacional de forma consolidada. Ele combina três dimensões: R$/hora (peso 40%), taxa de ocupação (peso 30%) e custo por km (peso 30%). A comparação é feita contra o seu próprio histórico, não contra outros motoristas.

**Como interpretar a pontuação?**

- **0 a 40:** Iniciante — há oportunidades claras de melhoria em várias dimensões
- **41 a 65:** Bom — operação saudável com pontos específicos para otimizar
- **66 a 85:** Ótimo — eficiência acima da média do seu histórico
- **86 a 100:** Expert — operação nos seus melhores padrões históricos

**"Top 15% dos seus próprios dias" — o que significa?**

Significa que a performance do dia atual está entre os 15% melhores dias que você já teve desde que começou a usar o app. A comparação é sempre interna — o objetivo é você superar a si mesmo, não um benchmark externo arbitrário.

**O que são as tags abaixo do score?**

São rótulos automáticos que traduzem o score em itens concretos. As verdes indicam o que está contribuindo positivamente para a pontuação — por exemplo, "Alta eficiência/hora" ou "Pico bem aproveitado". As âmbares e vermelhas indicam os pontos que estão puxando o score para baixo, como "Reduzir KM vazio" ou "Despesas em alta". Elas funcionam como um diagnóstico rápido.

**O score muda ao longo do dia?**

Sim. Ele recalcula sempre que novos dados são registrados. Uma corrida muito lucrativa no final do dia pode subir o score; uma despesa inesperada pode baixá-lo.

**Por que comparar com meu próprio histórico em vez de com outros motoristas?**

Porque contextos são diferentes. Um motorista em São Paulo opera em condições completamente diferentes de alguém em Porto Alegre ou em uma cidade do interior. Comparar com você mesmo é mais justo e mais útil: o que importa é se você está melhorando, não se é melhor que um desconhecido.

---

*MotoristAI — Análise inteligente para motoristas de aplicativo.*
*Versão do documento: 1.0*
