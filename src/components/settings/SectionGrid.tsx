import ConfigCard from './ConfigCard';
import { LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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
      <h4 className="text-lg font-semibold text-gray-800 mb-4">{title}</h4>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: title === 'Lançamentos Rápidos' ? index * 0.05 : 0 }}
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
