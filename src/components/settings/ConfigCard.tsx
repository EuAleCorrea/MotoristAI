import { LucideIcon } from 'lucide-react';

/*
 * ConfigCard — Apple HIG Grid Button
 * Ref: hig-foundations/references/layout.md - grouped grid items
 * Ref: hig-foundations/references/color.md - accent tinted icon
 */

interface ConfigCardProps {
 icon: LucideIcon;
 title: string;
 sectionTitle: string;
 onClick?: () => void;
 disabled?: boolean;
}

const ConfigCard = ({ icon: Icon, title, sectionTitle, onClick, disabled }: ConfigCardProps) => {
 return (
 <button
 onClick={onClick}
 disabled={disabled}
 role="button"
 aria-label={`${title} - ${sectionTitle}`}
 className="group ios-card p-3.5 text-left min-h-[88px] w-full flex flex-col justify-start items-start
 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent
 disabled:opacity-40 disabled:cursor-not-allowed
 active:bg-fill-quaternary dark:active:bg-fill-quaternary-dark
 transition-colors duration-100"
 >
 <div
 className="flex items-center justify-center w-8 h-8 rounded-ios mb-2 flex-shrink-0"
 style={{ background: 'rgba(0, 136, 255, 0.12)' }}
 >
 <Icon
 className="h-4 w-4 text-[var(--ios-accent)] transition-colors"
 strokeWidth={1.8}
 />
 </div>
 <h5 className="text-ios-footnote font-semibold text-[var(--ios-text)] leading-tight line-clamp-2">
 {title}
 </h5>
 </button>
 );
};

export default ConfigCard;
