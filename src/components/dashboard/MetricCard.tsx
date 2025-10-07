import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  showIcon: boolean;
}

function MetricCard({ icon: Icon, label, value, showIcon }: MetricCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-2 sm:p-3 flex items-center ${showIcon ? 'space-x-2 sm:space-x-3' : 'justify-center text-center'}`}>
      {showIcon && (
        <div className="bg-primary-50 p-1.5 sm:p-2 rounded-lg">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
        </div>
      )}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm sm:text-base font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default MetricCard;
