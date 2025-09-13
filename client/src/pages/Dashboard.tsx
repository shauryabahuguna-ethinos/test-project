import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Analytics from "@/components/Analytics";
import TaskCard from "@/components/TaskCard";
import ProgressBar from "@/components/ProgressBar";
import { Plus, Calendar, Clock, Target, TrendingUp } from "lucide-react";
import type { Task } from "@shared/schema";
import { useTasks } from "@/hooks/useTasks";
import { useAnalytics } from "@/hooks/useAnalytics";

interface DashboardProps {
  onCreateTask?: () => void;
  onNavigate?: (page: string) => void;
}

export default function Dashboard({ onCreateTask, onNavigate }: DashboardProps) {
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  
  // Get upcoming tasks (next 3 tasks with deadlines or in-progress)
  const upcomingTasks = tasks
    .filter(task => task.status === 'in-progress' || 
                   (task.deadline && new Date(task.deadline) > new Date()))
    .sort((a, b) => {
      if (a.status === 'in-progress' && b.status !== 'in-progress') return -1;
      if (b.status === 'in-progress' && a.status !== 'in-progress') return 1;
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return 0;
    })
    .slice(0, 3);

  const todaysStats = {
    totalTasks: analytics?.totalTasks || 0,
    completedTasks: analytics?.completedTasks || 0,
    inProgressTasks: analytics?.inProgressTasks || 0,
    productivityScore: analytics?.productivityScore || 0
  };

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Welcome back! Here's your productivity overview.</p>
        </div>
        <Button onClick={onCreateTask} data-testid="button-dashboard-create-task" className="gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-elevate">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Tasks</p>
                <p className="text-2xl font-bold">{todaysStats.totalTasks}</p>
                <p className="text-xs text-muted-foreground">
                  {todaysStats.completedTasks} completed
                </p>
              </div>
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{todaysStats.inProgressTasks}</p>
                <p className="text-xs text-chart-3">Active right now</p>
              </div>
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Productivity Score</p>
                <p className="text-2xl font-bold">{todaysStats.productivityScore}</p>
                <p className="text-xs text-chart-1">+12% from last week</p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate cursor-pointer" onClick={() => onNavigate?.('calendar')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Next Deadline</p>
                <p className="text-2xl font-bold">2d</p>
                <p className="text-xs text-chart-3">AI Review Task</p>
              </div>
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Upcoming Tasks */}
        <div className="xl:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold">Upcoming Tasks</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onNavigate?.('tasks')}
              data-testid="button-view-all-tasks"
              className="text-xs sm:text-sm"
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {tasksLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task}
                  onEdit={(task) => console.log('Edit task:', task)}
                  onStatusChange={(id, status) => console.log('Status change:', id, status)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-2" />
                <p>No upcoming tasks</p>
                <Button onClick={onCreateTask} variant="ghost" size="sm" className="mt-2">
                  Create your first task
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Section */}
        <div className="xl:col-span-2">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Performance Analytics</h3>
          <Analytics timeRange="week" />
        </div>
      </div>

      {/* Today's Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Daily Goal Completion</span>
              <span className="font-medium">3/8 tasks</span>
            </div>
            <ProgressBar progress={37.5} showLabel={false} />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-chart-1/10 rounded-md border border-chart-1/20">
              <div className="font-medium text-chart-1">✅ Completed</div>
              <div className="text-muted-foreground">3 tasks • 4.5 hours</div>
            </div>
            <div className="p-3 bg-chart-3/10 rounded-md border border-chart-3/20">
              <div className="font-medium text-chart-3">⏳ Remaining</div>
              <div className="text-muted-foreground">5 tasks • 3.2 hours</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}