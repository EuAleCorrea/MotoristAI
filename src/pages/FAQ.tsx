import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, Calculator, Gauge, TrendingUp, Target, Clock } from 'lucide-react';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
    isDetailed?: boolean;
    detailedContent?: React.ReactNode;
}

const GoalsExplanation = () => (
    <div className="space-y-6">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            O MotoristAI possui um sistema inteligente que converte seus objetivos mensais em metas diárias realistas. Entenda como funciona:
        </p>

        {/* Cadastro Mensal */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/30">
            <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-bold text-emerald-700 dark:text-emerald-300">1. Cadastro Mensal</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                Você define quanto quer faturar no <strong>mês inteiro</strong> e quantos <strong>dias por semana</strong> pretende trabalhar.
            </p>
        </div>

        {/* Cálculo de Dias Úteis */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-bold text-blue-700 dark:text-blue-300">2. Cálculo de Dias Úteis</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                O sistema calcula quantos dias você trabalhará baseado no mês atual:
            </p>
            <div className="bg-white/50 dark:bg-black/20 p-2 rounded-lg text-xs font-mono text-gray-700 dark:text-gray-300">
                (Dias no Mês ÷ 7) × Dias Trabalhados na Semana
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                Ex: Em um mês de 31 dias, trabalhando 5 dias por semana, você terá 22,14 dias úteis.
            </p>
        </div>

        {/* Meta Diária */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/30">
            <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h4 className="font-bold text-amber-700 dark:text-amber-300">3. Meta Diária (Dashboard)</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                Sua meta exibida no círculo principal é:
            </p>
            <div className="bg-white/50 dark:bg-black/20 p-2 rounded-lg text-xs font-mono text-gray-700 dark:text-gray-300">
                Faturamento Mensal ÷ Dias Úteis
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 font-medium">
                💡 Isso garante que sua meta seja justa e leve em conta suas folgas semanais!
            </p>
        </div>

        {/* Histórico */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-700 dark:text-gray-300">
                📅 Você pode ver todo o seu <strong>Histórico de Metas</strong> clicando em <em>Ajustes {" > "} Metas</em>. Lá você consegue ver o que planejou para cada mês do ano.
            </p>
        </div>
    </div>
);

const MetricsExplanation = () => (
    <div className="space-y-6">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Com base nos seus lançamentos, o sistema calcula automaticamente métricas importantes para você entender sua performance. Veja o significado de cada uma:
        </p>

        {/* R$ / Hora */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-bold text-blue-700 dark:text-blue-300">R$ / Hora</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <strong>Cálculo:</strong> Faturamento Total ÷ Tempo Online
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Racional:</strong> Esta é a sua métrica de <em>Eficiência de Tempo</em>. Ela diz quanto vale cada hora que você passou logado no aplicativo.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                Exemplo: R$ 150,50 ÷ 6h = R$ 25,08/hora
            </p>
        </div>

        {/* R$ / KM */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/30">
            <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-bold text-emerald-700 dark:text-emerald-300">R$ / KM</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <strong>Cálculo:</strong> Faturamento Total ÷ Distância Percorrida
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Racional:</strong> Esta é a sua métrica de <em>Rentabilidade do Veículo</em>. Mostra quanto você faturou para cada quilômetro rodado.
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                💡 Dica: Motoristas experientes buscam manter acima de R$ 2,00 para compensar combustível e manutenção.
            </p>
        </div>

        {/* R$ / Viagem */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800/30">
            <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h4 className="font-bold text-purple-700 dark:text-purple-300">R$ / Viagem (Ticket Médio)</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <strong>Cálculo:</strong> Faturamento Total ÷ Total de Viagens
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Racional:</strong> Este é o seu <em>Ticket Médio</em>. Indica o valor médio de cada corrida aceita.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                Ajuda a entender se o dia foi de "corridinhas curtas" ou corridas longas.
            </p>
        </div>

        {/* KM / Hora */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/30">
            <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h4 className="font-bold text-amber-700 dark:text-amber-300">KM / Hora</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <strong>Cálculo:</strong> Distância Percorrida ÷ Tempo Online
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Racional:</strong> Esta é a <em>Métrica de Produtividade/Trânsito</em>. Indica quão rápido você está conseguindo se deslocar.
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 font-medium">
                ⚠️ Valor baixo pode indicar muito trânsito ou tempo parado esperando corrida.
            </p>
        </div>

        {/* Meta Diária */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 border border-rose-100 dark:border-rose-800/30">
            <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <h4 className="font-bold text-rose-700 dark:text-rose-300">Meta Diária (%)</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <strong>Cálculo:</strong> (Faturamento Total ÷ Meta Configurada) × 100
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Racional:</strong> É o seu <em>Progresso do Objetivo</em>. Mostra quanto você já completou da sua meta do dia.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                Exemplo: R$ 150,50 ÷ R$ 300,00 = 50% da meta
            </p>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                📊 <strong>Importante:</strong> Todas as métricas são calculadas em tempo real sempre que você abre o Dashboard!
            </p>
        </div>
    </div>
);

const faqData: FAQItem[] = [
    // Categoria: Métricas (A pergunta principal solicitada)
    {
        id: 'metrics-explanation',
        question: 'Como funcionam as métricas do Dashboard? O que significa cada uma?',
        answer: '',
        category: 'Métricas',
        isDetailed: true,
        detailedContent: <MetricsExplanation />,
    },
    // Categoria: Geral
    {
        id: '1',
        question: 'O que é o MotoristAI?',
        answer: 'O MotoristAI é uma plataforma inteligente de gestão financeira voltada para motoristas de aplicativo. Ele ajuda você a controlar suas receitas, despesas, metas e obter insights valiosos sobre sua performance financeira.',
        category: 'Geral',
    },
    {
        id: '2',
        question: 'Como funciona o controle de despesas?',
        answer: 'Você pode registrar todas as suas despesas de forma categorizada, incluindo combustível, manutenção do veículo, pedágios, estacionamentos e despesas pessoais. O sistema gera relatórios automáticos para facilitar sua análise.',
        category: 'Despesas',
    },
    {
        id: '3',
        question: 'Posso cadastrar mais de um veículo?',
        answer: 'Sim! O MotoristAI permite que você cadastre múltiplos veículos e gerencie as despesas de cada um separadamente, ideal para quem trabalha com mais de um carro.',
        category: 'Veículos',
    },
    {
        id: '4',
        question: 'Como as minhas metas são calculadas e onde vejo o histórico?',
        answer: '',
        category: 'Metas',
        isDetailed: true,
        detailedContent: <GoalsExplanation />,
    },
    {
        id: '5',
        question: 'Meus dados estão seguros?',
        answer: 'Absolutamente! Utilizamos criptografia de ponta e armazenamento seguro em nuvem. Seus dados são privados e nunca são compartilhados com terceiros.',
        category: 'Segurança',
    },
    {
        id: '6',
        question: 'Posso acessar o app offline?',
        answer: 'Algumas funcionalidades básicas estão disponíveis offline. Assim que você reconectar à internet, seus dados serão sincronizados automaticamente.',
        category: 'Geral',
    },
    {
        id: '7',
        question: 'Como registro minhas corridas e ganhos?',
        answer: 'Na seção de Entradas, você pode adicionar suas corridas manualmente ou, em breve, utilizar nossa IA para importar automaticamente seus ganhos através de prints de tela.',
        category: 'Receitas',
    },
    {
        id: '8',
        question: 'O que são despesas recorrentes?',
        answer: 'São despesas que se repetem regularmente, como parcelas de financiamento, seguro, IPVA, etc. O sistema pode lembrá-lo automaticamente quando elas estão próximas do vencimento.',
        category: 'Despesas',
    },
];

const FAQPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

    const categories = ['Todas', ...new Set(faqData.map((item) => item.category))];

    const filteredFAQ = faqData.filter((item) => {
        const matchesSearch =
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="min-h-screen pb-24">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
                        <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Perguntas Frequentes
                    </h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                    Encontre respostas para as dúvidas mais comuns
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Buscar pergunta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700 
                     bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                     transition-all duration-200"
                />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
              ${selectedCategory === category
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
                {filteredFAQ.length === 0 ? (
                    <div className="text-center py-12">
                        <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            Nenhuma pergunta encontrada
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                            Tente buscar por outro termo
                        </p>
                    </div>
                ) : (
                    filteredFAQ.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-300 overflow-hidden
                ${item.id === 'metrics-explanation'
                                    ? 'border-emerald-200 dark:border-emerald-800/50 shadow-md shadow-emerald-500/10'
                                    : 'border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md'}`}
                        >
                            <button
                                onClick={() => toggleExpand(item.id)}
                                className="w-full px-5 py-4 flex items-center justify-between text-left"
                            >
                                <div className="flex-1 pr-4">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium 
                      ${item.id === 'metrics-explanation'
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`}>
                                            {item.category}
                                        </span>
                                        {item.id === 'metrics-explanation' && (
                                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                                                ⭐ Importante
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-gray-900 dark:text-white font-semibold text-base">
                                        {item.question}
                                    </h3>
                                </div>
                                <div
                                    className={`p-2 rounded-full transition-all duration-300 flex-shrink-0
                    ${expandedId === item.id
                                            ? 'bg-emerald-500 text-white rotate-180'
                                            : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    {expandedId === item.id ? (
                                        <ChevronUp className="w-5 h-5" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5" />
                                    )}
                                </div>
                            </button>

                            {/* Answer */}
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out
                  ${expandedId === item.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-5 pb-5 pt-0">
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-600 to-transparent mb-4" />
                                    {item.isDetailed && item.detailedContent ? (
                                        item.detailedContent
                                    ) : (
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {item.answer}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Stats Footer */}
            <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20
                      border border-emerald-100 dark:border-emerald-800/30">
                <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <HelpCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                        {faqData.length} perguntas disponíveis
                    </span>
                </div>
                <p className="text-center text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                    Não encontrou sua dúvida? Entre em contato conosco!
                </p>
            </div>
        </div>
    );
};

export default FAQPage;
