import ConfigCard from './ConfigCard';
import { LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

/*
 * SectionGrid — Apple HIG Grouped Section
 * Ref: hig-foundations/references/layout.md - section headers + grid
 * Ref: hig-foundations/references/typography.md - ios-section-header style
 */

interface CardItem {
 id: string;
 title: string;
 icon: LucideIcon;
 onClick: () => void;
 disabled?: boolean;
}

interface SectionGridProps {
 title: string;
 items: CardItem[];
}

const SectionGrid = ({ title, items }: SectionGridProps) => {
 return (
 <section>
 {/* Section header — iOS Settings style */}
 <p className="ios-section-header">{title}</p>
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
 <AnimatePresence>
 {items.map((item, index) => (
 <motion.div
 key={item.id}
 layout
 initial={{ opacity: 0, scale: 0.92 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.92 }}
 transition={{
 duration: 0.25,
 delay: title === 'Lançamentos Rápidos' ? index * 0.04 : 0,
 ease: [0.32, 0.72, 0, 1], /* Apple iOS spring curve */
 }}
 >
 <ConfigCard
 icon={item.icon}
 title={item.title}
 onClick={item.onClick}
 disabled={item.disabled}
 sectionTitle={title}
 />
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 </section>
 );
};

export default SectionGrid;
