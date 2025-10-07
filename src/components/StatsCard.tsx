import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  color: 'primary' | 'success' | 'danger';
}

function StatsCard({ title, value, icon: Icon, trend, trendValue, color }: StatsCardProps) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-success-50 text-success-600',
    danger: 'bg-danger-50 text-danger-600',
  };

  const trendColors = {
    up: 'text-success-600',
    down: 'text-danger-600',
    neutral: 'text-gray-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          <div className="mt-2 flex items-center text-sm">
            {trend === 'up' && <TrendingUp className="h-4 w-4 mr-1" />}
            {trend === 'down' && <TrendingDown className="h-4 w-4 mr-1" />}
            <span className={trendColors[trend]}>{trendValue}</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
