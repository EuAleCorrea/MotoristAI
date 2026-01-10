import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface LucroCentralProps {
    lucroLiquido: number;
    meta: number;
    periodoLabel?: string;
}

const LucroCentral: React.FC<LucroCentralProps> = ({ lucroLiquido, meta, periodoLabel = 'Hoje' }) => {
    const percentual = meta > 0 ? Math.min((lucroLiquido / meta) * 100, 100) : 0;
    const isPositive = lucroLiquido >= 0;
    const circumference = 2 * Math.PI * 90; // radius = 90
    const strokeDashoffset = circumference - (percentual / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center py-8">
            {/* Outer glow effect */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-56 h-56 rounded-full blur-2xl opacity-20 dark:opacity-30 ${isPositive ? 'bg-primary-500' : 'bg-danger-500'}`} />
            </div>

            {/* Progress ring */}
            <svg className="w-56 h-56 transform -rotate-90 relative z-10" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-200 dark:text-slate-700"
                />
                {/* Progress circle */}
                <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3377FF" />
                        <stop offset="100%" stopColor="#00BFFF" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    {periodoLabel}
                </span>
                <span className={`text-3xl font-bold ${isPositive ? 'text-gray-900 dark:text-white' : 'text-danger-600 dark:text-danger-400'}`}>
                    R$ {Math.abs(lucroLiquido).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Lucro Líquido
                </span>
                {meta > 0 && (
                    <div className="flex items-center gap-1 mt-2 px-3 py-1 bg-slate-100 dark:bg-slate-800/50 rounded-full">
                        <span className="text-xs text-slate-600 dark:text-slate-300">
                            Meta: R$ {meta.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                        </span>
                        {lucroLiquido >= meta ? (
                            <TrendingUp className="w-3 h-3 text-success-500" />
                        ) : (
                            <TrendingDown className="w-3 h-3 text-slate-400" />
                        )}
                    </div>
                )}
                <span className="text-xs text-primary-600 dark:text-primary-400 mt-2 font-medium">
                    {percentual.toFixed(0)}%
                </span>
            </div>
        </div>
    );
};

export default LucroCentral;
