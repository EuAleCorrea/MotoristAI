import React, { useMemo } from 'react';
import { Clock, Route, DollarSign, Car } from 'lucide-react';
import { useEntryStore } from '../../store/entryStore';
import { startOfWeek, endOfWeek } from 'date-fns';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const parseHoursWorked = (hoursStr: string | undefined): number => {
 if (!hoursStr) return 0;
 const [hours, minutes] = hoursStr.split(':').map(Number);
 return hours + (minutes || 0) / 60;
};

interface MetricItemProps {
 icon: React.ReactNode;
 label: string;
 value: string;
 subLabel?: string;
 accentColor: string;
 accentBg: string;
}

const MetricItem: React.FC<MetricItemProps> = ({ icon, label, value, subLabel, accentColor, accentBg }) => (
 <div className="ios-card p-3.5 flex items-center gap-3">
 <div
 className="w-10 h-10 rounded-ios flex items-center justify-center flex-shrink-0"
 style={{ backgroundColor: accentBg, color: accentColor }}
 >
 {icon}
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-ios-caption1 truncate" style={{ color: 'var(--ios-text-secondary)' }}>{label}</p>
 <p className="text-ios-subhead font-semibold truncate" style={{ color: 'var(--ios-text)' }}>{value}</p>
 {subLabel && (
 <p className="text-ios-caption2 truncate" style={{ color: 'var(--ios-text-tertiary)' }}>{subLabel}</p>
 )}
 </div>
 </div>
);

function PerformanceMetrics() {
 const entries = useEntryStore((state) => state.entries);

 const metrics = useMemo(() => {
 const today = new Date();
 const weekStart = startOfWeek(today, { weekStartsOn: 1 });
 const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

 const weekEntries = entries.filter((e) => {
 const d = new Date(e.date);
 return d >= weekStart && d <= weekEnd;
 });

 const totalRevenue = weekEntries.reduce((sum, e) => sum + e.value, 0);
 const totalKm = weekEntries.reduce((sum, e) => sum + (e.kmDriven || 0), 0);
 const totalHours = weekEntries.reduce((sum, e) => sum + parseHoursWorked(e.hoursWorked), 0);
 const totalTrips = weekEntries.reduce((sum, e) => sum + (e.tripCount || 0), 0);

 const revenuePerKm = totalKm > 0 ? totalRevenue / totalKm : 0;
 const revenuePerHour = totalHours > 0 ? totalRevenue / totalHours : 0;
 const revenuePerTrip = totalTrips > 0 ? totalRevenue / totalTrips : 0;

 return { totalRevenue, totalKm, totalHours, totalTrips, revenuePerKm, revenuePerHour, revenuePerTrip };
 }, [entries]);

 return (
 <div className="space-y-3">
 <p className="ios-ios-section-header">Métricas de Performance (Semana)</p>

 <div className="grid grid-cols-2 gap-2.5">
 <MetricItem
 icon={<DollarSign className="w-5 h-5" />}
 label="R$ / Hora"
 value={formatCurrency(metrics.revenuePerHour)}
 subLabel={`${formatNumber(metrics.totalHours, 1)}h trabalhadas`}
 accentColor="var(--sys-green)"
 accentBg="rgba(52, 199, 89, 0.12)"
 />
 <MetricItem
 icon={<Route className="w-5 h-5" />}
 label="R$ / KM"
 value={formatCurrency(metrics.revenuePerKm)}
 subLabel={`${formatNumber(metrics.totalKm, 0)} km rodados`}
 accentColor="var(--sys-blue)"
 accentBg="rgba(0, 122, 255, 0.12)"
 />
 <MetricItem
 icon={<Car className="w-5 h-5" />}
 label="R$ / Viagem"
 value={formatCurrency(metrics.revenuePerTrip)}
 subLabel={`${metrics.totalTrips} viagens`}
 accentColor="var(--sys-orange)"
 accentBg="rgba(255, 149, 0, 0.12)"
 />
 <MetricItem
 icon={<Clock className="w-5 h-5" />}
 label="KM / Hora"
 value={`${formatNumber(metrics.totalHours > 0 ? metrics.totalKm / metrics.totalHours : 0, 1)} km`}
 subLabel="Produtividade"
 accentColor="var(--sys-purple)"
 accentBg="rgba(175, 82, 222, 0.12)"
 />
 </div>
 </div>
 );
}

export default PerformanceMetrics;
