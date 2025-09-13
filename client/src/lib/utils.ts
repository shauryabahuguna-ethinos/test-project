import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPriorityColor(priority: 1 | 2 | 3 | 4 | 5): string {
  switch (priority) {
    case 1: return "bg-destructive text-destructive-foreground";
    case 2: return "bg-chart-3 text-white";
    case 3: return "bg-chart-2 text-white";
    case 4: return "bg-chart-5 text-white";
    case 5: return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
}

export function getPriorityLabel(priority: 1 | 2 | 3 | 4 | 5): string {
  switch (priority) {
    case 1: return "Critical";
    case 2: return "High";
    case 3: return "Medium";
    case 4: return "Low";
    case 5: return "Minimal";
    default: return "Unknown";
  }
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return "text-chart-1";
    case 'in-progress': return "text-chart-3";
    case 'overdue': return "text-destructive";
    case 'pending': return "text-muted-foreground";
    default: return "text-muted-foreground";
  }
}
