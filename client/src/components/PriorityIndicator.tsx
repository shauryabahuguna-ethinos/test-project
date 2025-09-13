import { Badge } from "@/components/ui/badge";
import { getPriorityColor, getPriorityLabel } from "@/lib/utils";

interface PriorityIndicatorProps {
  priority: 1 | 2 | 3 | 4 | 5;
  size?: "sm" | "md" | "lg";
}

export default function PriorityIndicator({ priority, size = "sm" }: PriorityIndicatorProps) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4"
  };

  return (
    <div className="flex items-center gap-2" data-testid={`priority-indicator-${priority}`}>
      <div className={`rounded-full ${getPriorityColor(priority)} ${sizeClasses[size]}`} />
      <Badge variant="outline" className={`text-xs ${size === "lg" ? "px-2 py-1" : "px-1.5 py-0.5"}`}>
        {getPriorityLabel(priority)}
      </Badge>
    </div>
  );
}