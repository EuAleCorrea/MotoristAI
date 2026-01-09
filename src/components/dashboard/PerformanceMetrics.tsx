import React, { useMemo } from 'react';
import { Clock, Route, DollarSign, TrendingUp, Car } from 'lucide-react';
import { useEntryStore } from '../../store/entryStore';
import { startOfWeek, endOfWeek } from 'date-fns';

// Helper to parse hours from "HH:MM" format
const parseHoursWorked = (hoursStr: string | undefined): number => {
    if (!hoursStr) return 0;
    const [hours, minutes] = hoursStr.split(':').map(Number);
    return hours + (minutes || 0) / 60;
};

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subLabel?: string;
    trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, subLabel, trend }) => (
    <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4 flex items-center gap-3 border border-gray-200 dark:border-gray-700/50">
        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
            {icon}
        </div>
        <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
            {subLabel && <p className="text-xs text-gray-400 dark:text-gray-500">{subLabel}</p>}
        </div>
        {trend && (
            <div className={`text-xs ${trend === 'up' ? 'text-green-500 dark:text-green-400' : trend === 'down' ? 'text-red-500 dark:text-red-400' : 'text-gray-400'}`}>
                {trend === 'up' && <TrendingUp className="w-4 h-4" />}
            </div>
        )}
    </div>
);

function PerformanceMetrics() {
    const entries = useEntryStore((state) => state.entries);

    const metrics = useMemo(() => {
        const today = new Date();
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

        // Filter entries for this week
        const weekEntries = entries.filter((e) => {
            const d = new Date(e.date);
            return d >= weekStart && d <= weekEnd;
        });

        // Calculate totals
        const totalRevenue = weekEntries.reduce((sum, e) => sum + e.value, 0);
        const totalKm = weekEntries.reduce((sum, e) => sum + (e.kmDriven || 0), 0);
        const totalHours = weekEntries.reduce((sum, e) => sum + parseHoursWorked(e.hoursWorked), 0);
        const totalTrips = weekEntries.reduce((sum, e) => sum + (e.tripCount || 0), 0);

        // Calculate metrics (avoid division by zero)
        const revenuePerKm = totalKm > 0 ? totalRevenue / totalKm : 0;
        const revenuePerHour = totalHours > 0 ? totalRevenue / totalHours : 0;
        const revenuePerTrip = totalTrips > 0 ? totalRevenue / totalTrips : 0;

        return {
            totalRevenue,
            totalKm,
            totalHours,
            totalTrips,
            revenuePerKm,
            revenuePerHour,
            revenuePerTrip,
        };
    }, [entries]);

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 px-1">Métricas de Performance (Semana)</h3>

            <div className="grid grid-cols-2 gap-3">
                <MetricCard
                    icon={<DollarSign className="w-5 h-5" />}
                    label="R$ / Hora"
                    value={`R$ ${metrics.revenuePerHour.toFixed(2)}`}
                    subLabel={`${metrics.totalHours.toFixed(1)}h trabalhadas`}
                />

                <MetricCard
                    icon={<Route className="w-5 h-5" />}
                    label="R$ / KM"
                    value={`R$ ${metrics.revenuePerKm.toFixed(2)}`}
                    subLabel={`${metrics.totalKm.toFixed(0)} km rodados`}
                />

                <MetricCard
                    icon={<Car className="w-5 h-5" />}
                    label="R$ / Viagem"
                    value={`R$ ${metrics.revenuePerTrip.toFixed(2)}`}
                    subLabel={`${metrics.totalTrips} viagens`}
                />

                <MetricCard
                    icon={<Clock className="w-5 h-5" />}
                    label="KM / Hora"
                    value={`${(metrics.totalHours > 0 ? metrics.totalKm / metrics.totalHours : 0).toFixed(1)} km`}
                    subLabel="Produtividade"
                />
            </div>
        </div>
    );
}

export default PerformanceMetrics;
