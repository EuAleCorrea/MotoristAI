import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  showIcon: boolean;
}

function MetricCard({ icon: Icon, label, value, showIcon }: MetricCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 sm:p-3 flex items-center ${showIcon ? 'space-x-2 sm:space-x-3' : 'justify-center text-center'}`}>
      {showIcon && (
        <div className="bg-primary-50 dark:bg-primary-900/30 p-1.5 sm:p-2 rounded-lg">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400" />
        </div>
      )}
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );
}

export default MetricCard;
