import { TrendingUp, TrendingDown, Plus } from 'lucide-react';

/*
 * SummaryCard — Revenue/Expense card (finance app style)
 * Compact card with value, trend indicator, and quick-add button
 */

interface Props {
 title: string;
 value: number;
 percentChange: number;
 type: 'revenue' | 'expense';
 onQuickAdd: () => void;
}

function SummaryCard({ title, value, percentChange, type, onQuickAdd }: Props) {
 const isRevenue = type === 'revenue';
 const color = isRevenue ? 'var(--sys-green)' : 'var(--sys-red)';
 const tintBg = isRevenue ? 'rgba(52, 199, 89, 0.12)' : 'rgba(255, 59, 48, 0.12)';

 const formatCurrency = (v: number) => {
 return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
 };

 return (
 <div className="ios-card p-4 flex-1">
 {/* Header */}
 <div className="flex items-center justify-between mb-3">
 <span className="text-ios-footnote" style={{ color: 'var(--ios-text-secondary)' }}>
 {title}
 </span>
 <button
 onClick={onQuickAdd}
 className="w-7 h-7 flex items-center justify-center rounded-full"
 style={{ backgroundColor: tintBg, color, minHeight: '28px' }}
 >
 <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
 </button>
 </div>

 {/* Value */}
 <p
 className="text-ios-title2 font-bold tabular-nums mb-1"
 style={{ color: 'var(--ios-text)' }}
 >
 {formatCurrency(value)}
 </p>

 {/* Trend */}
 {percentChange !== 0 && (
 <div className="flex items-center gap-1">
 <div
 className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-ios-full"
 style={{
 backgroundColor: tintBg,
 color,
 fontSize: '12px',
 fontWeight: 600,
 }}
 >
 {percentChange > 0 ? (
 <TrendingUp className="h-3 w-3" />
 ) : (
 <TrendingDown className="h-3 w-3" />
 )}
 <span>{Math.abs(percentChange).toFixed(1)}%</span>
 </div>
 <span className="text-ios-caption2" style={{ color: 'var(--ios-text-tertiary)' }}>
 vs semana anterior
 </span>
 </div>
 )}
 </div>
 );
}

export default SummaryCard;
