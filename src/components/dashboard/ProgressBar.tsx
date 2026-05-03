/*
 * ProgressBar — Apple HIG Progress Indicator
 * Ref: hig-foundations/references/color.md - system gray 5 for track
 * Ref: hig-foundations/references/motion.md - smooth fill transition
 */

interface ProgressBarProps {
 value: number;
 max: number;
 color?: string;
}

function ProgressBar({ value, max, color }: ProgressBarProps) {
 const percentage = max > 0 ? (value / max) * 100 : 0;

 return (
 <div
 className="w-full rounded-ios-full h-2 overflow-hidden"
 style={{ background: 'rgba(120, 120, 128, 0.16)' }}
 >
 <div
 className="h-full rounded-ios-full transition-all duration-700"
 style={{
 width: `${Math.min(percentage, 100)}%`,
 background: color || 'rgb(0, 136, 255)', /* default: accent */
 transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
 }}
 />
 </div>
 );
}

export default ProgressBar;
