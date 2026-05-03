import { LucideIcon } from 'lucide-react';

/*
 * MetricCard — Apple HIG Compact Info Cell
 * Ref: hig-foundations/references/layout.md - grouped content
 * Ref: hig-foundations/references/color.md - accent tinted icon
 */

interface MetricCardProps {
 icon: LucideIcon;
 label: string;
 value: string;
 showIcon: boolean;
}

function MetricCard({ icon: Icon, label, value, showIcon }: MetricCardProps) {
 return (
 <div className={`ios-card p-3 flex items-center ${showIcon ? 'gap-3' : 'justify-center text-center'}`}>
 {showIcon && (
 <div
 className="flex items-center justify-center w-9 h-9 rounded-ios flex-shrink-0"
 style={{ background: 'rgba(0, 136, 255, 0.12)' }}
 >
 <Icon className="h-4.5 w-4.5 text-[var(--ios-accent)]" style={{ width: '18px', height: '18px' }} />
 </div>
 )}
 <div className="min-w-0">
 <p className="text-ios-caption1 text-[var(--ios-text-secondary)] truncate">{label}</p>
 <p className="text-ios-subhead font-semibold text-[var(--ios-text)] truncate">{value}</p>
 </div>
 </div>
 );
}

export default MetricCard;
