interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
}

function ProgressBar({ value, max, color = 'bg-primary-600' }: ProgressBarProps) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
      <div
        className={`${color} h-2.5 rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      ></div>
    </div>
  );
}

export default ProgressBar;
