import ConfigCard from './ConfigCard';
import { LucideIcon } from 'lucide-react';

interface CardItem {
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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {items.map((item) => (
          <ConfigCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            onClick={item.onClick}
            disabled={item.disabled}
            sectionTitle={title}
          />
        ))}
      </div>
    </section>
  );
};

export default SectionGrid;
