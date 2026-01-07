import { LucideIcon } from 'lucide-react';

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
      className="group bg-white dark:bg-gray-800 rounded-[12px] border border-gray-200 dark:border-gray-700 shadow-sm transition-all p-3 md:p-4 text-left min-h-[92px] w-full flex flex-col justify-start items-start focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-300 dark:hover:border-primary-500 hover:shadow-lg active:shadow-none"
    >
      <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-2" />
      <h5 className="font-semibold text-gray-800 dark:text-gray-200 leading-[1.3] line-clamp-2 text-[clamp(12px,1.9vw,14px)]">
        {title}
      </h5>
    </button>
  );
};

export default ConfigCard;
