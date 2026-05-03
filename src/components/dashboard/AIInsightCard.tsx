import React, { useMemo } from 'react';
import { Sparkles, TrendingUp, Lightbulb, Target } from 'lucide-react';
import { useEntryStore } from '../../store/entryStore';
import { useGoalStore } from '../../store/goalStore';
import { startOfDay, endOfDay } from 'date-fns';
import { formatCurrency, formatPercent } from '../../utils/formatters';

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

 const currentMonthGoal = getGoalByMonth(today.getFullYear(), today.getMonth() + 1);
 const monthlyRevenueGoal = currentMonthGoal?.revenue || 0;
 const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
 const workingDaysInMonth = currentMonthGoal?.daysWorkedPerWeek
 ? (daysInMonth / 7) * currentMonthGoal.daysWorkedPerWeek
 : daysInMonth;
 const dailyGoal = monthlyRevenueGoal > 0 ? (monthlyRevenueGoal / workingDaysInMonth) : 0;

 const platformStats: Record<string, number> = {};
 todayEntries.forEach(e => {
 platformStats[e.source] = (platformStats[e.source] || 0) + e.value;
 });
 const bestPlatform = Object.entries(platformStats).sort((a, b) => b[1] - a[1])[0];

 if (revenue === 0) {
 return {
 title: "Inicie seu dia!",
 message: dailyGoal > 0
 ? `Sua meta hoje é de ${formatCurrency(dailyGoal)}. Vamos buscar batter esse objetivo?`
 : "Ainda não registrou ganhos hoje. Que tal começar?",
 type: 'info' as const,
 icon: <Target className="w-5 h-5" />,
 };
 }

 if (dailyGoal > 0 && revenue >= dailyGoal) {
 return {
 title: "Meta Batida! 🚀",
 message: `Parabéns! Você superou sua meta diária em ${formatCurrency(revenue - dailyGoal)}.`,
 type: 'success' as const,
 icon: <Sparkles className="w-5 h-5" />,
 };
 }

 if (bestPlatform && bestPlatform[1] > (revenue * 0.7)) {
 return {
 title: "Foco no Volume",
 message: `Você está rendendo muito bem na ${bestPlatform[0]}. Mantenha o ritmo!`,
 type: 'trend' as const,
 icon: <TrendingUp className="w-5 h-5" />,
 };
 }

 return {
 title: "Dica do MotoristAI",
 message: dailyGoal > 0
 ? `Você completou ${formatPercent((revenue / dailyGoal) * 100)} da meta. Faltam ${formatCurrency(dailyGoal - revenue)}.`
 : "Registre também suas despesas para ver seu lucro real!",
 type: 'tip' as const,
 icon: <Lightbulb className="w-5 h-5" />,
 };
 }, [entries, getGoalByMonth]);

 const colorMap: Record<string, { accent: string; bg: string }> = {
 success: { accent: 'var(--sys-green)', bg: 'rgba(52, 199, 89, 0.1)' },
 info: { accent: 'var(--sys-blue)', bg: 'rgba(0, 122, 255, 0.1)' },
 trend: { accent: 'var(--sys-orange)', bg: 'rgba(255, 149, 0, 0.1)' },
 tip: { accent: 'var(--sys-purple)', bg: 'rgba(175, 82, 222, 0.1)' },
 };

 const colors = colorMap[insight.type];

 return (
 <div
 className="ios-card p-4 flex gap-3 items-start"
 style={{ borderLeft: `3px solid ${colors.accent}` }}
 >
 <div
 className="flex-shrink-0 w-10 h-10 rounded-ios flex items-center justify-center"
 style={{ backgroundColor: colors.bg, color: colors.accent }}
 >
 {insight.icon}
 </div>

 <div className="min-w-0 flex-1">
 <h4
 className="text-ios-headline font-semibold mb-0.5"
 style={{ color: 'var(--ios-text)' }}
 >
 {insight.title}
 </h4>
 <p className="text-ios-subhead" style={{ color: 'var(--ios-text-secondary)' }}>
 {insight.message}
 </p>
 </div>
 </div>
 );
};

export default AIInsightCard;
