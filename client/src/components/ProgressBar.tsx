import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function ProgressBar({ 
  progress, 
  showLabel = true, 
  size = "md",
  className 
}: ProgressBarProps) {
  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3"
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "text-chart-1";
    if (progress >= 75) return "text-chart-2";
    if (progress >= 50) return "text-chart-3";
    if (progress >= 25) return "text-chart-4";
    return "text-muted-foreground";
  };

  return (
    <div className={cn("space-y-1", className)} data-testid={`progress-bar-${progress}`}>
      <Progress 
        value={progress} 
        className={cn("w-full", sizeClasses[size])}
      />
      {showLabel && (
        <div className={cn("flex items-center justify-between text-xs", getProgressColor(progress))}>
          <span>Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
}