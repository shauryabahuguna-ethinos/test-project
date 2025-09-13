import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import type { Analytics as AnalyticsType, Task } from "@shared/types";
import { formatDuration } from "@/lib/utils";

interface AnalyticsProps {
  analytics?: AnalyticsType;
  tasks?: Task[];
  timeRange?: 'week' | 'month' | 'quarter';
}

export default function Analytics({ 
  analytics, 
  tasks = [], 
  timeRange = 'month' 
}: AnalyticsProps) {
  //todo: remove mock functionality
  const mockAnalytics: AnalyticsType = analytics || {
    totalTasks: 45,
    completedTasks: 32,
    averageCompletionTime: 185, // minutes
    accuracyRate: 78, // percentage
    productivityScore: 85
  };

  const completionRate = (mockAnalytics.completedTasks / mockAnalytics.totalTasks) * 100;
  const pendingTasks = mockAnalytics.totalTasks - mockAnalytics.completedTasks;

  const priorityDistribution = tasks.length > 0 ? 
    tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<number, number>) :
    { 1: 5, 2: 8, 3: 15, 4: 10, 5: 7 }; // Mock data

  const statusDistribution = tasks.length > 0 ?
    tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) :
    { 'completed': 32, 'in-progress': 8, 'pending': 4, 'overdue': 1 }; // Mock data

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend,
    color = "default"
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: typeof BarChart3;
    trend?: 'up' | 'down' | 'neutral';
    color?: 'default' | 'success' | 'warning' | 'danger';
  }) => {
    const colorClasses = {
      default: "text-foreground",
      success: "text-chart-1",
      warning: "text-chart-3",
      danger: "text-destructive"
    };

    return (
      <Card data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{title}</p>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${colorClasses[color]}`}>
                  {value}
                </span>
                {trend && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      trend === 'up' ? 'text-chart-1' : 
                      trend === 'down' ? 'text-destructive' : 
                      'text-muted-foreground'
                    }`}
                  >
                    <TrendingUp className={`w-3 h-3 mr-1 ${
                      trend === 'down' ? 'rotate-180' : ''
                    }`} />
                    {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}12%
                  </Badge>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
            <Icon className="w-8 h-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6" data-testid="analytics-dashboard">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={mockAnalytics.totalTasks}
          subtitle={`${pendingTasks} pending`}
          icon={Calendar}
          trend="up"
        />
        <StatCard
          title="Completion Rate"
          value={`${Math.round(completionRate)}%`}
          subtitle={`${mockAnalytics.completedTasks} completed`}
          icon={CheckCircle}
          trend="up"
          color="success"
        />
        <StatCard
          title="Avg. Time per Task"
          value={formatDuration(mockAnalytics.averageCompletionTime)}
          subtitle="Actual completion time"
          icon={Clock}
          trend="down"
          color="warning"
        />
        <StatCard
          title="Productivity Score"
          value={mockAnalytics.productivityScore}
          subtitle="Based on estimates vs actual"
          icon={Target}
          trend="up"
          color="success"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(priorityDistribution).map(([priority, count]) => {
              const priorityLabels = {
                '1': 'Critical',
                '2': 'High', 
                '3': 'Medium',
                '4': 'Low',
                '5': 'Minimal'
              };
              const percentage = (count / mockAnalytics.totalTasks) * 100;
              
              return (
                <div key={priority} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {priorityLabels[priority as keyof typeof priorityLabels]}
                    </span>
                    <span className="text-muted-foreground">
                      {count} tasks ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Task Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 sm:gap-4">
              {Object.entries(statusDistribution).map(([status, count]) => {
                const statusColors = {
                  'completed': 'text-chart-1',
                  'in-progress': 'text-chart-3',
                  'pending': 'text-muted-foreground',
                  'overdue': 'text-destructive'
                };
                
                return (
                  <div key={status} className="text-center p-3 sm:p-4 border rounded-md">
                    <div className={`text-xl sm:text-2xl font-bold ${statusColors[status as keyof typeof statusColors]}`}>
                      {count}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize mt-1">
                      {status.replace('-', ' ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Time Accuracy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Time Estimation Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Accuracy Rate</span>
                <span className="font-medium">{mockAnalytics.accuracyRate}%</span>
              </div>
              <Progress value={mockAnalytics.accuracyRate} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div className="text-center sm:text-left">
                <div className="text-muted-foreground">Under-estimated</div>
                <div className="font-medium">15 tasks</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-muted-foreground">Over-estimated</div>
                <div className="font-medium">7 tasks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-chart-1/10 rounded-md border border-chart-1/20">
              <div className="text-sm font-medium text-chart-1">✅ Improvement Detected</div>
              <div className="text-xs text-muted-foreground mt-1">
                Your task completion rate improved by 12% this month
              </div>
            </div>
            <div className="p-3 bg-chart-3/10 rounded-md border border-chart-3/20">
              <div className="text-sm font-medium text-chart-3">⚡ Optimization Tip</div>
              <div className="text-xs text-muted-foreground mt-1">
                Consider breaking down high-priority tasks for better tracking
              </div>
            </div>
            <div className="p-3 bg-chart-2/10 rounded-md border border-chart-2/20">
              <div className="text-sm font-medium text-chart-2">📊 Pattern Found</div>
              <div className="text-xs text-muted-foreground mt-1">
                Tuesday mornings show highest productivity rates
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}