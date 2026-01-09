import React, { useState, useMemo } from 'react';
import { format, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { useEntryStore } from '../../store/entryStore';
import { useExpenseStore } from '../../store/expenseStore';
import { useGoalStore } from '../../store/goalStore';
import LucroCentral from './LucroCentral';
import SummaryCard from './SummaryCard';
import WeeklyChart from './WeeklyChart';
import QuickEntryModal from './QuickEntryModal';

function DashboardHome() {
    const [quickEntryType, setQuickEntryType] = useState<'revenue' | 'expense' | null>(null);

    const entries = useEntryStore((state) => state.entries);
    const expenses = useExpenseStore((state) => state.expenses);
    const { getGoalByMonth } = useGoalStore();

    const todayData = useMemo(() => {
        const today = new Date();
        const dayStart = startOfDay(today);
        const dayEnd = endOfDay(today);

        const todayEntries = entries.filter(
            (entry) => new Date(entry.date) >= dayStart && new Date(entry.date) <= dayEnd
        );
        const todayExpenses = expenses.filter(
            (expense) => new Date(expense.date) >= dayStart && new Date(expense.date) <= dayEnd
        );

        const revenue = todayEntries.reduce((sum, entry) => sum + entry.value, 0);
        const expenseTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const lucro = revenue - expenseTotal;

        // Get goal
        const currentMonthGoal = getGoalByMonth(today.getFullYear(), today.getMonth() + 1);
        const monthlyRevenueGoal = currentMonthGoal?.revenue || 0;
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const workingDaysInMonth = currentMonthGoal?.daysWorkedPerWeek
            ? (daysInMonth / 7) * currentMonthGoal.daysWorkedPerWeek
            : daysInMonth;
        const dailyGoal = monthlyRevenueGoal > 0 ? (monthlyRevenueGoal / workingDaysInMonth) : 300;

        return { revenue, expenseTotal, lucro, dailyGoal };
    }, [entries, expenses, getGoalByMonth]);

    const weekComparison = useMemo(() => {
        const today = new Date();

        // This week
        const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
        const thisWeekEnd = endOfWeek(today, { weekStartsOn: 1 });

        // Last week
        const lastWeekStart = subDays(thisWeekStart, 7);
        const lastWeekEnd = subDays(thisWeekEnd, 7);

        // This week totals
        const thisWeekRevenue = entries
            .filter(e => {
                const d = new Date(e.date);
                return d >= thisWeekStart && d <= thisWeekEnd;
            })
            .reduce((sum, e) => sum + e.value, 0);

        const thisWeekExpenses = expenses
            .filter(e => {
                const d = new Date(e.date);
                return d >= thisWeekStart && d <= thisWeekEnd;
            })
            .reduce((sum, e) => sum + e.amount, 0);

        // Last week totals
        const lastWeekRevenue = entries
            .filter(e => {
                const d = new Date(e.date);
                return d >= lastWeekStart && d <= lastWeekEnd;
            })
            .reduce((sum, e) => sum + e.value, 0);

        const lastWeekExpenses = expenses
            .filter(e => {
                const d = new Date(e.date);
                return d >= lastWeekStart && d <= lastWeekEnd;
            })
            .reduce((sum, e) => sum + e.amount, 0);

        // Calculate percentage change
        const revenueChange = lastWeekRevenue > 0
            ? ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100
            : 0;
        const expenseChange = lastWeekExpenses > 0
            ? ((thisWeekExpenses - lastWeekExpenses) / lastWeekExpenses) * 100
            : 0;

        return {
            thisWeekRevenue,
            thisWeekExpenses,
            revenueChange,
            expenseChange,
        };
    }, [entries, expenses]);

    const handleOpenQuickEntry = (type: 'revenue' | 'expense') => {
        setQuickEntryType(type);
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Profit Circle */}
            <LucroCentral
                lucroLiquido={todayData.lucro}
                meta={todayData.dailyGoal}
                periodoLabel="Hoje"
            />

            {/* Summary Cards */}
            <div className="flex gap-4 px-2">
                <SummaryCard
                    title="Faturamento"
                    value={weekComparison.thisWeekRevenue}
                    percentChange={weekComparison.revenueChange}
                    type="revenue"
                    onQuickAdd={() => handleOpenQuickEntry('revenue')}
                />
                <SummaryCard
                    title="Despesas"
                    value={weekComparison.thisWeekExpenses}
                    percentChange={weekComparison.expenseChange}
                    type="expense"
                    onQuickAdd={() => handleOpenQuickEntry('expense')}
                />
            </div>

            {/* Weekly Chart */}
            <div className="px-2">
                <WeeklyChart entries={entries} expenses={expenses} />
            </div>

            {/* Quick Entry Modal */}
            <QuickEntryModal
                isOpen={quickEntryType !== null}
                onClose={() => setQuickEntryType(null)}
                type={quickEntryType || 'revenue'}
            />
        </div>
    );
}

export default DashboardHome;
