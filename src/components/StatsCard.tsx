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
    const colorMap = {
        primary: { bg: 'rgba(0, 136, 255, 0.12)', fg: 'var(--sys-blue)' },
        success: { bg: 'rgba(52, 199, 89, 0.12)', fg: 'var(--sys-green)' },
        danger: { bg: 'rgba(255, 59, 48, 0.12)', fg: 'var(--sys-red)' },
    };

    const trendColorMap = {
        up: 'var(--sys-green)',
        down: 'var(--sys-red)',
        neutral: 'var(--ios-text-tertiary)',
    };

    const colors = colorMap[color];
    const trendColor = trendColorMap[trend];

    return (
        <div className="ios-card p-5 transition-shadow duration-200 hover:shadow-ios-elevated">
            <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-ios-footnote truncate" style={{ color: 'var(--ios-text-secondary)' }}>
                        {title}
                    </p>
                    <p
                        className="mt-1.5 text-ios-title2 font-bold truncate"
                        style={{ color: 'var(--ios-text)', letterSpacing: '-0.43px' }}
                    >
                        {value}
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                        {trend === 'up' && (
                            <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" style={{ color: trendColor }} />
                        )}
                        {trend === 'down' && (
                            <TrendingDown className="h-3.5 w-3.5 flex-shrink-0" style={{ color: trendColor }} />
                        )}
                        <span className="text-ios-caption1 font-medium" style={{ color: trendColor }}>
                            {trendValue}
                        </span>
                    </div>
                </div>

                <div
                    className="ml-4 flex items-center justify-center w-11 h-11 rounded-ios flex-shrink-0"
                    style={{ background: colors.bg }}
                >
                    <Icon className="h-5 w-5" style={{ color: colors.fg }} />
                </div>
            </div>
        </div>
    );
}

export default StatsCard;
