import React, { useMemo } from 'react';
import { format, addDays, startOfWeek, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';


interface WeeklyChartProps {
    entries: Array<{ date: string; value: number }>;
    expenses: Array<{ date: string; amount: number }>;
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ entries, expenses }) => {
    const weekData = useMemo(() => {
        const today = new Date();
        // Obtém a segunda-feira da semana atual (0 = Domingo, 1 = Segunda, ...)
        const monday = startOfWeek(today, { weekStartsOn: 1 });
        const days = [];

        for (let i = 0; i < 7; i++) {
            const date = addDays(monday, i);
            const dayStart = startOfDay(date);
            const dayEnd = endOfDay(date);

            const dayRevenue = entries
                .filter(e => {
                    const entryDate = new Date(e.date.split('T')[0] + 'T00:00:00');
                    return entryDate >= dayStart && entryDate <= dayEnd;
                })
                .reduce((sum, e) => sum + e.value, 0);

            const dayExpenses = expenses
                .filter(e => {
                    const expenseDate = new Date(e.date.split('T')[0] + 'T00:00:00');
                    return expenseDate >= dayStart && expenseDate <= dayEnd;
                })
                .reduce((sum, e) => sum + e.amount, 0);

            days.push({
                label: format(date, 'EEEE', { locale: ptBR }).split('-')[0],
                revenue: dayRevenue,
                expense: dayExpenses,
                date: date,
            });
        }

        return days;
    }, [entries, expenses]);

    const maxValue = useMemo(() => {
        const allValues = weekData.flatMap(d => [d.revenue, d.expense]);
        return Math.max(...allValues, 100);
    }, [weekData]);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Semana Atual
                </h3>
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-slate-500 dark:text-slate-400">Faturamento</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-slate-500 dark:text-slate-400">Despesas</span>
                    </div>
                </div>
            </div>

            <div className="flex items-end justify-between gap-2 h-32">
                {weekData.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                        <div className="relative w-full flex items-end justify-center gap-0.5 h-24">
                            {/* Revenue bar */}
                            <div
                                className="w-3 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t transition-all duration-300"
                                style={{
                                    height: `${maxValue > 0 ? (day.revenue / maxValue) * 100 : 0}%`,
                                    minHeight: day.revenue > 0 ? '4px' : '0'
                                }}
                            />
                            {/* Expense bar */}
                            <div
                                className="w-3 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t transition-all duration-300"
                                style={{
                                    height: `${maxValue > 0 ? (day.expense / maxValue) * 100 : 0}%`,
                                    minHeight: day.expense > 0 ? '4px' : '0'
                                }}
                            />
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                            {day.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklyChart;
