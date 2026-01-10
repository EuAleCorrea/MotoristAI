import React, { useMemo } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { useEntryStore } from '../../store/entryStore';
import { startOfWeek, endOfWeek } from 'date-fns';

interface PlatformStats {
    name: string;
    revenue: number;
    trips: number;
    hours: number;
}

// Helper to parse hours from "HH:MM" format
const parseHoursWorked = (hoursStr: string | undefined): number => {
    if (!hoursStr) return 0;
    const [hours, minutes] = hoursStr.split(':').map(Number);
    return hours + (minutes || 0) / 60;
};

function BestPlatformCard() {
    const entries = useEntryStore((state) => state.entries);

    const platformRanking = useMemo(() => {
        const today = new Date();
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

        // Filter entries for this week
        const weekEntries = entries.filter((e) => {
            const d = new Date(e.date);
            return d >= weekStart && d <= weekEnd;
        });

        // Aggregate by platform
        const platformMap: Record<string, PlatformStats> = {};

        weekEntries.forEach((entry) => {
            const platform = entry.source || 'Outros';
            if (!platformMap[platform]) {
                platformMap[platform] = { name: platform, revenue: 0, trips: 0, hours: 0 };
            }
            platformMap[platform].revenue += entry.value;
            platformMap[platform].trips += entry.tripCount || 0;
            platformMap[platform].hours += parseHoursWorked(entry.hoursWorked);
        });

        // Convert to array and sort by revenue
        const ranking = Object.values(platformMap).sort((a, b) => b.revenue - a.revenue);

        return ranking;
    }, [entries]);

    const bestPlatform = platformRanking[0];
    const totalRevenue = platformRanking.reduce((sum, p) => sum + p.revenue, 0);

    if (!bestPlatform || totalRevenue === 0) {
        return (
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 rounded-xl p-4 border border-amber-300 dark:border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Melhor App da Semana</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Nenhum dado registrado ainda.</p>
            </div>
        );
    }

    const percentage = ((bestPlatform.revenue / totalRevenue) * 100).toFixed(0);

    return (
        <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 rounded-xl p-4 border border-amber-300 dark:border-amber-500/30">
            <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Melhor App da Semana</h3>
            </div>

            {/* Best Platform Highlight */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{bestPlatform.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        R$ {bestPlatform.revenue.toFixed(2)} ({percentage}% do total)
                    </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-200 dark:bg-amber-500/30 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
            </div>

            {/* Other Platforms */}
            {platformRanking.length > 1 && (
                <div className="space-y-2 pt-3 border-t border-amber-200 dark:border-slate-700/50">
                    <p className="text-xs text-slate-500 mb-2">Outros apps:</p>
                    {platformRanking.slice(1, 4).map((platform, index) => (
                        <div key={platform.name} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">
                                {index + 2}. {platform.name}
                            </span>
                            <span className="text-slate-800 dark:text-slate-300">R$ {platform.revenue.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BestPlatformCard;
