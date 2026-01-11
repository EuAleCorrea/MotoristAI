import React, { useMemo } from 'react';
import { Sparkles, TrendingUp, Lightbulb, Target } from 'lucide-react';
import { useEntryStore } from '../../store/entryStore';
import { useGoalStore } from '../../store/goalStore';
import { startOfDay, endOfDay } from 'date-fns';

const AIInsightCard: React.FC = () => {
    const entries = useEntryStore((state) => state.entries);
    const { getGoalByMonth } = useGoalStore();

    const insight = useMemo(() => {
        const today = new Date();
        const dayStart = startOfDay(today);
        const dayEnd = endOfDay(today);

        const todayEntries = entries.filter(
            (entry) => new Date(entry.date) >= dayStart && new Date(entry.date) <= dayEnd
        );

        const revenue = todayEntries.reduce((sum, entry) => sum + entry.value, 0);

        // Get goal
        const currentMonthGoal = getGoalByMonth(today.getFullYear(), today.getMonth() + 1);
        const monthlyRevenueGoal = currentMonthGoal?.revenue || 0;
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const workingDaysInMonth = currentMonthGoal?.daysWorkedPerWeek
            ? (daysInMonth / 7) * currentMonthGoal.daysWorkedPerWeek
            : daysInMonth;
        const dailyGoal = monthlyRevenueGoal > 0 ? (monthlyRevenueGoal / workingDaysInMonth) : 0;

        // Platform analysis
        const platformStats: Record<string, number> = {};
        todayEntries.forEach(e => {
            platformStats[e.source] = (platformStats[e.source] || 0) + e.value;
        });
        const bestPlatform = Object.entries(platformStats).sort((a, b) => b[1] - a[1])[0];

        // Generation logic
        if (revenue === 0) {
            return {
                title: "Inicie seu dia!",
                message: dailyGoal > 0
                    ? `Sua meta hoje é de R$ ${dailyGoal.toFixed(2)}. Vamos buscar bater esse objetivo?`
                    : "Ainda não registrou ganhos hoje. Que tal começar?",
                type: 'info',
                icon: <Target className="w-5 h-5" />
            };
        }

        if (dailyGoal > 0 && revenue >= dailyGoal) {
            return {
                title: "Meta Batida! 🚀",
                message: `Parabéns! Você superou sua meta diária. Seu faturamento extra hoje já é de R$ ${(revenue - dailyGoal).toFixed(2)}.`,
                type: 'success',
                icon: <Sparkles className="w-5 h-5" />
            };
        }

        if (bestPlatform && bestPlatform[1] > (revenue * 0.7)) {
            return {
                title: "Foco no Volume",
                message: `Você está rendendo muito bem na ${bestPlatform[0]}. Mantenha o ritmo nela para atingir sua meta mais rápido!`,
                type: 'trend',
                icon: <TrendingUp className="w-5 h-5" />
            };
        }

        return {
            title: "Dica do MotoristAI",
            message: dailyGoal > 0
                ? `Você já completou ${((revenue / dailyGoal) * 100).toFixed(0)}% da sua meta diária. Faltam R$ ${(dailyGoal - revenue).toFixed(2)}.`
                : "Seu faturamento está crescendo. Lembre-se de registrar suas despesas para ver seu lucro real!",
            type: 'tip',
            icon: <Lightbulb className="w-5 h-5" />
        };
    }, [entries, getGoalByMonth]);

    const colors = {
        success: 'from-emerald-500 to-teal-600 shadow-emerald-500/20 text-white',
        info: 'from-blue-500 to-indigo-600 shadow-blue-500/20 text-white',
        trend: 'from-amber-500 to-orange-600 shadow-amber-500/20 text-white',
        tip: 'from-purple-500 to-pink-600 shadow-purple-500/20 text-white',
        warning: 'from-rose-500 to-red-600 shadow-rose-500/20 text-white',
    };

    return (
        <div className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br transition-all duration-300 shadow-xl ${colors[insight.type as keyof typeof colors]}`}>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 p-2 opacity-15">
                <Sparkles className="w-24 h-24" />
            </div>

            <div className="relative z-10 flex gap-4 items-start">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 shrink-0">
                    {insight.icon}
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-1 flex items-center gap-2">
                        {insight.title}
                    </h4>
                    <p className="text-sm font-medium text-white/90 leading-relaxed">
                        {insight.message}
                    </p>
                </div>
            </div>

            {/* Micro-animation indicator */}
            <div className="absolute bottom-2 right-4 flex gap-1">
                <div className="w-1 h-1 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-1 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-1 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
};

export default AIInsightCard;
