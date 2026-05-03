import React, { useMemo } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { useEntryStore } from '../../store/entryStore';
import { startOfWeek, endOfWeek } from 'date-fns';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface PlatformStats {
 name: string;
 revenue: number;
 trips: number;
 hours: number;
}

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

 const weekEntries = entries.filter((e) => {
 const d = new Date(e.date);
 return d >= weekStart && d <= weekEnd;
 });

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

 return Object.values(platformMap).sort((a, b) => b.revenue - a.revenue);
 }, [entries]);

 const bestPlatform = platformRanking[0];
 const totalRevenue = platformRanking.reduce((sum, p) => sum + p.revenue, 0);

 if (!bestPlatform || totalRevenue === 0) {
 return (
 <div className="ios-card p-4">
 <div className="flex items-center gap-2.5 mb-2">
 <Trophy className="w-5 h-5" style={{ color: 'var(--sys-orange)' }} />
 <h3 className="text-ios-subhead font-medium" style={{ color: 'var(--ios-text-secondary)' }}>
 Melhor App da Semana
 </h3>
 </div>
 <p className="text-ios-callout" style={{ color: 'var(--ios-text-tertiary)' }}>
 Nenhum dado registrado ainda.
 </p>
 </div>
 );
 }

 const percentage = formatNumber((bestPlatform.revenue / totalRevenue) * 100, 0);

 return (
 <div className="ios-card p-4">
 <div className="flex items-center gap-2.5 mb-3">
 <Trophy className="w-5 h-5" style={{ color: 'var(--sys-orange)' }} />
 <h3 className="text-ios-subhead font-medium" style={{ color: 'var(--ios-text-secondary)' }}>
 Melhor App da Semana
 </h3>
 </div>

 <div className="flex items-center justify-between mb-3">
 <div>
 <p className="text-ios-title3 font-bold" style={{ color: 'var(--ios-text)' }}>
 {bestPlatform.name}
 </p>
 <p className="text-ios-footnote mt-0.5" style={{ color: 'var(--ios-text-secondary)' }}>
 {formatCurrency(bestPlatform.revenue)} ({percentage}% do total)
 </p>
 </div>
 <div
 className="w-11 h-11 rounded-ios flex items-center justify-center flex-shrink-0"
 style={{ backgroundColor: 'rgba(255, 149, 0, 0.12)', color: 'var(--sys-orange)' }}
 >
 <TrendingUp className="w-5 h-5" />
 </div>
 </div>

 {platformRanking.length > 1 && (
 <div className="pt-3 space-y-2" style={{ borderTop: '0.33px solid var(--ios-separator)' }}>
 <p className="text-ios-caption2 uppercase" style={{ color: 'var(--ios-text-tertiary)', letterSpacing: '0.5px' }}>
 Outros apps
 </p>
 {platformRanking.slice(1, 4).map((platform, index) => (
 <div key={platform.name} className="flex items-center justify-between">
 <span className="text-ios-callout" style={{ color: 'var(--ios-text-secondary)' }}>
 {index + 2}. {platform.name}
 </span>
 <span className="text-ios-callout font-medium" style={{ color: 'var(--ios-text)' }}>
 {formatCurrency(platform.revenue)}
 </span>
 </div>
 ))}
 </div>
 )}
 </div>
 );
}

export default BestPlatformCard;
