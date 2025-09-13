import { useState } from "react";
import CalendarView from "@/components/CalendarView";
import TaskForm from "@/components/TaskForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar as CalendarIcon, Clock } from "lucide-react";
import type { Task } from "@shared/types";

export default function Calendar() {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  const handleTaskDrop = (taskId: string, date: Date, hour: number) => {
    console.log(`Task ${taskId} scheduled for ${date.toDateString()} at ${hour}:00`);
  };

  const handleCreateEvent = (date: Date, hour?: number) => {
    setSelectedDate(date);
    setSelectedHour(hour || null);
    setShowTaskForm(true);
    console.log('Creating event for:', date, hour);
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedDate) {
      const scheduledStart = new Date(selectedDate);
      if (selectedHour !== null) {
        scheduledStart.setHours(selectedHour, 0, 0, 0);
      }
      
      const taskWithSchedule = {
        ...taskData,
        scheduledStart,
        scheduledEnd: new Date(scheduledStart.getTime() + taskData.estimatedTime * 60 * 1000)
      };
      
      console.log('Creating scheduled task:', taskWithSchedule);
    }
    
    setShowTaskForm(false);
    setSelectedDate(null);
    setSelectedHour(null);
  };

  const handleFormCancel = () => {
    setShowTaskForm(false);
    setSelectedDate(null);
    setSelectedHour(null);
    console.log('Calendar task form cancelled');
  };

  return (
    <div className="space-y-6" data-testid="calendar-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Drag tasks onto time slots or click to create new ones.</p>
        </div>
        <Button onClick={() => handleCreateEvent(new Date())} className="gap-2">
          <CalendarIcon className="w-4 h-4" />
          Quick Schedule
        </Button>
      </div>

      {/* AI Scheduling Suggestions */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            AI Scheduling Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1 hover-elevate cursor-pointer">
              <Clock className="w-3 h-3" />
              Move "AI Review" to 10:00 AM (optimal focus time)
            </Badge>
            <Badge variant="outline" className="gap-1 hover-elevate cursor-pointer">
              <CalendarIcon className="w-3 h-3" />
              Schedule "Team Meeting" buffer: +15 min
            </Badge>
            <Badge variant="outline" className="gap-1 hover-elevate cursor-pointer">
              <Sparkles className="w-3 h-3" />
              Group similar tasks for better flow
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Based on your productivity patterns and task complexity analysis
          </p>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <CalendarView
        view="week"
        onTaskDrop={handleTaskDrop}
        onCreateEvent={handleCreateEvent}
      />

      {/* Task Creation Dialog */}
      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Schedule New Task
              {selectedDate && (
                <span className="text-sm text-muted-foreground font-normal block">
                  {selectedDate.toLocaleDateString()}
                  {selectedHour !== null && ` at ${selectedHour.toString().padStart(2, '0')}:00`}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={handleTaskSubmit}
            onCancel={handleFormCancel}
            isLoading={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}