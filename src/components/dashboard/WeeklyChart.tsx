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
 label: format(date, 'EEE', { locale: ptBR }),
 revenue: dayRevenue,
 expense: dayExpenses,
 isToday: format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'),
 });
 }

 return days;
 }, [entries, expenses]);

 const maxValue = useMemo(() => {
 const allValues = weekData.flatMap(d => [d.revenue, d.expense]);
 return Math.max(...allValues, 100);
 }, [weekData]);

 return (
 <div className="ios-card p-4">
 {/* Header + Legend */}
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-ios-subhead font-semibold" style={{ color: 'var(--ios-text)' }}>
 Semana Atual
 </h3>
 <div className="flex items-center gap-3">
 <div className="flex items-center gap-1.5">
 <div className="w-2 h-2 rounded-full" style={{ background: 'var(--sys-green)' }} />
 <span className="text-ios-caption2" style={{ color: 'var(--ios-text-secondary)' }}>
 Receitas
 </span>
 </div>
 <div className="flex items-center gap-1.5">
 <div className="w-2 h-2 rounded-full" style={{ background: 'var(--sys-red)' }} />
 <span className="text-ios-caption2" style={{ color: 'var(--ios-text-secondary)' }}>
 Despesas
 </span>
 </div>
 </div>
 </div>

 {/* Bar chart */}
 <div className="flex items-end justify-between gap-1.5" style={{ height: '110px' }}>
 {weekData.map((day, index) => (
 <div key={index} className="flex-1 flex flex-col items-center gap-1.5">
 <div className="relative w-full flex items-end justify-center gap-[3px]" style={{ height: '80px' }}>
 <div
 className="w-[10px] rounded-t-[3px] transition-all duration-500"
 style={{
 height: `${maxValue > 0 ? (day.revenue / maxValue) * 100 : 0}%`,
 minHeight: day.revenue > 0 ? '3px' : '0',
 background: 'var(--sys-green)',
 }}
 />
 <div
 className="w-[10px] rounded-t-[3px] transition-all duration-500"
 style={{
 height: `${maxValue > 0 ? (day.expense / maxValue) * 100 : 0}%`,
 minHeight: day.expense > 0 ? '3px' : '0',
 background: 'var(--sys-red)',
 }}
 />
 </div>
 <span
 className="text-ios-caption2 capitalize"
 style={{
 color: day.isToday ? 'var(--ios-accent)' : 'var(--ios-text-tertiary)',
 fontWeight: day.isToday ? 600 : 400,
 }}
 >
 {day.label}
 </span>
 </div>
 ))}
 </div>
 </div>
 );
};

export default WeeklyChart;
