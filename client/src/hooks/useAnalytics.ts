import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  averageCompletionTime: number;
  accuracyRate: number;
  productivityScore: number;
}

export function useAnalytics() {
  return useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: () => apiRequest('/api/analytics'),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}