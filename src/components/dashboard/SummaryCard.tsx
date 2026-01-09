import React from 'react';
import { TrendingUp, TrendingDown, Plus, Minus } from 'lucide-react';

interface SummaryCardProps {
    title: string;
    value: number;
    percentChange?: number;
    type: 'revenue' | 'expense';
    onQuickAdd?: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
    title,
    value,
    percentChange,
    type,
    onQuickAdd
}) => {
    const isRevenue = type === 'revenue';
    const hasIncrease = percentChange !== undefined && percentChange > 0;
    const hasDecrease = percentChange !== undefined && percentChange < 0;

    return (
        <div className={`relative flex-1 rounded-2xl p-4 pb-6 ${isRevenue
            ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30'
            : 'bg-gradient-to-br from-rose-500/20 to-rose-600/10 border border-rose-500/30'
            }`}>
            <div className="flex flex-col">
                <span className={`text-xs font-medium uppercase tracking-wide ${isRevenue ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                    {title}
                </span>

                <span className={`text-2xl font-bold mt-1 ${isRevenue ? 'text-emerald-300' : 'text-rose-300'
                    }`}>
                    R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>

                {percentChange !== undefined && (
                    <div className={`flex items-center gap-1 mt-2 text-xs ${hasIncrease ? 'text-emerald-400' : hasDecrease ? 'text-rose-400' : 'text-gray-400'
                        }`}>
                        {hasIncrease ? (
                            <TrendingUp className="w-3 h-3" />
                        ) : hasDecrease ? (
                            <TrendingDown className="w-3 h-3" />
                        ) : null}
                        <span>
                            {hasIncrease ? '+' : ''}{percentChange.toFixed(0)}% vs semana
                        </span>
                    </div>
                )}
            </div>

            {/* Quick action button */}
            {onQuickAdd && (
                <button
                    onClick={onQuickAdd}
                    className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${isRevenue
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-rose-500 hover:bg-rose-600 text-white'
                        }`}
                >
                    {isRevenue ? <Plus className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                </button>
            )}
        </div>
    );
};

export default SummaryCard;
