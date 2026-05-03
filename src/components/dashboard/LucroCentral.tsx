import { useMemo } from 'react';

/*
 * LucroCentral — Hero value display (like finance app reference)
 * Shows the main profit value prominently, with progress ring
 */

interface Props {
 lucroLiquido: number;
 meta: number;
 periodoLabel: string;
}

function LucroCentral({ lucroLiquido, meta, periodoLabel }: Props) {
 const progress = useMemo(() => {
 if (meta <= 0) return 0;
 return Math.min((lucroLiquido / meta) * 100, 100);
 }, [lucroLiquido, meta]);

 const formatCurrency = (value: number) => {
 return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
 };

 // SVG circle params
 const size = 160;
 const stroke = 8;
 const radius = (size - stroke) / 2;
 const circumference = 2 * Math.PI * radius;
 const offset = circumference - (progress / 100) * circumference;

 const isPositive = lucroLiquido >= 0;

 return (
 <div className="ios-card p-6 flex flex-col items-center">
 {/* Period label */}
 <span
 className="text-ios-footnote font-medium mb-4"
 style={{ color: 'var(--ios-text-secondary)' }}
 >
 {periodoLabel}
 </span>

 {/* Progress Ring with Value */}
 <div className="relative" style={{ width: size, height: size }}>
 <svg width={size} height={size} className="-rotate-90">
 {/* Background ring */}
 <circle
 cx={size / 2}
 cy={size / 2}
 r={radius}
 fill="none"
 stroke="var(--ios-fill)"
 strokeWidth={stroke}
 />
 {/* Progress ring */}
 <circle
 cx={size / 2}
 cy={size / 2}
 r={radius}
 fill="none"
 stroke={isPositive ? 'var(--sys-green)' : 'var(--sys-red)'}
 strokeWidth={stroke}
 strokeLinecap="round"
 strokeDasharray={circumference}
 strokeDashoffset={offset}
 style={{ transition: 'stroke-dashoffset 0.8s ease' }}
 />
 </svg>

 {/* Center value */}
 <div className="absolute inset-0 flex flex-col items-center justify-center">
 <span
 className="text-ios-title1 font-bold tabular-nums"
 style={{ color: isPositive ? 'var(--sys-green)' : 'var(--sys-red)' }}
 >
 {formatCurrency(lucroLiquido)}
 </span>
 <span className="text-ios-caption1" style={{ color: 'var(--ios-text-tertiary)' }}>
 Lucro líquido
 </span>
 </div>
 </div>

 {/* Meta */}
 {meta > 0 && (
 <div className="mt-4 flex items-center gap-2">
 <div
 className="h-1.5 flex-1 rounded-full overflow-hidden"
 style={{ backgroundColor: 'var(--ios-fill)', minWidth: '120px' }}
 >
 <div
 className="h-full rounded-full transition-all duration-500"
 style={{
 width: `${Math.min(progress, 100)}%`,
 backgroundColor: isPositive ? 'var(--sys-green)' : 'var(--sys-red)',
 }}
 />
 </div>
 <span className="text-ios-caption2" style={{ color: 'var(--ios-text-secondary)' }}>
 {progress.toFixed(0)}% da meta
 </span>
 </div>
 )}
 </div>
 );
}

export default LucroCentral;
