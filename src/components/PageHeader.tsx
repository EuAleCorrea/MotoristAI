import React from 'react';
import { LucideIcon } from 'lucide-react';

/*
 * PageHeader — Apple HIG Section Header
 * Ref: hig-foundations/references/typography.md - title3 style
 * Ref: hig-foundations/references/layout.md - section headers
 *
 * Mudança: removido o card wrapper (bg-[var(--ios-card)] shadow), que conflitava
 * com o agrupamento semântico. Agora é inline, como títulos de seção
 * no Settings do iOS.
 */

interface PageHeaderProps {
 title: string;
 icon: LucideIcon;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, icon: Icon }) => {
 return (
 <div className="flex items-center gap-3 mb-5 pt-2">
 <div
 className="flex items-center justify-center w-9 h-9 rounded-ios flex-shrink-0"
 style={{ background: 'rgba(0, 136, 255, 0.12)' }}
 >
 <Icon className="h-5 w-5 text-[var(--ios-accent)]" strokeWidth={2} />
 </div>
 <h2
 className="text-ios-title3 font-semibold text-[var(--ios-text)]"
 style={{ letterSpacing: '-0.43px' }}
 >
 {title}
 </h2>
 </div>
 );
};

export default PageHeader;
