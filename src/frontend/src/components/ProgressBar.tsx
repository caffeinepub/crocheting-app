import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  percentage: number;
}

export default function ProgressBar({ percentage }: ProgressBarProps) {
  const getColorClass = () => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    if (percentage >= 25) return 'text-orange-600';
    return 'text-rose-600';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Progress</span>
        <span className={`text-sm font-bold ${getColorClass()}`}>{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
