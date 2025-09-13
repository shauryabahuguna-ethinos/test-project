import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Plus
} from "lucide-react";
import type { Task, CalendarEvent } from "@shared/types";
import { formatDuration, getPriorityColor } from "@/lib/utils";

interface CalendarViewProps {
  tasks?: Task[];
  events?: CalendarEvent[];
  view?: 'month' | 'week' | 'day';
  onTaskDrop?: (taskId: string, date: Date, hour: number) => void;
  onCreateEvent?: (date: Date, hour?: number) => void;
}

export default function CalendarView({ 
  tasks = [], 
  events = [], 
  view = 'week',
  onTaskDrop,
  onCreateEvent 
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState<'month' | 'week' | 'day'>(view);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, date: Date, hour: number) => {
    e.preventDefault();
    if (draggedTask) {
      onTaskDrop?.(draggedTask.id, date, hour);
      console.log(`Task ${draggedTask.title} dropped on ${date.toDateString()} at ${hour}:00`);
      setDraggedTask(null);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (selectedView === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (selectedView === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
    console.log(`Calendar navigated ${direction} to ${newDate.toDateString()}`);
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    
    return (
      <div className="grid grid-cols-8 gap-0.5 sm:gap-1 text-xs min-w-[600px]">
        <div className="p-1 sm:p-2 font-medium text-xs">Time</div>
        {weekDays.map((day, index) => (
          <div key={index} className="p-1 sm:p-2 text-center font-medium border-b">
            <div className="hidden sm:block">{daysOfWeek[index]}</div>
            <div className="sm:hidden">{daysOfWeek[index].slice(0, 1)}</div>
            <div className="text-muted-foreground text-xs">{day.getDate()}</div>
          </div>
        ))}
        
        {hours.map((hour) => (
          <>
            <div key={`hour-${hour}`} className="p-0.5 sm:p-1 text-right text-muted-foreground border-r text-xs">
              <span className="hidden sm:inline">{hour.toString().padStart(2, '0')}:00</span>
              <span className="sm:hidden">{hour}</span>
            </div>
            {weekDays.map((day, dayIndex) => (
              <div
                key={`${hour}-${dayIndex}`}
                className="min-h-8 sm:min-h-12 border border-border hover-elevate cursor-pointer relative"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day, hour)}
                onClick={() => onCreateEvent?.(day, hour)}
                data-testid={`calendar-slot-${dayIndex}-${hour}`}
              >
                {/* Render scheduled tasks */}
                {tasks
                  .filter(task => 
                    task.scheduledStart && 
                    task.scheduledStart.toDateString() === day.toDateString() &&
                    task.scheduledStart.getHours() === hour
                  )
                  .map(task => (
                    <div
                      key={task.id}
                      className={`absolute inset-0.5 sm:inset-1 p-0.5 sm:p-1 rounded text-xs ${getPriorityColor(task.priority)} opacity-90`}
                    >
                      <div className="truncate font-medium text-xs leading-tight">{task.title}</div>
                    </div>
                  ))
                }
              </div>
            ))}
          </>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    return (
      <div className="space-y-1">
        <div className="text-center py-4 border-b">
          <h3 className="font-semibold">{currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</h3>
        </div>
        {hours.map((hour) => (
          <div
            key={hour}
            className="flex items-center border-b min-h-16 hover-elevate"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, currentDate, hour)}
            onClick={() => onCreateEvent?.(currentDate, hour)}
            data-testid={`day-slot-${hour}`}
          >
            <div className="w-16 text-right text-sm text-muted-foreground pr-4">
              {hour.toString().padStart(2, '0')}:00
            </div>
            <div className="flex-1 p-4 relative">
              {tasks
                .filter(task => 
                  task.scheduledStart && 
                  task.scheduledStart.toDateString() === currentDate.toDateString() &&
                  task.scheduledStart.getHours() === hour
                )
                .map(task => (
                  <div
                    key={task.id}
                    className={`p-2 rounded ${getPriorityColor(task.priority)} opacity-90`}
                  >
                    <div className="font-medium">{task.title}</div>
                    <div className="text-xs opacity-80">{formatDuration(task.estimatedTime)}</div>
                  </div>
                ))
              }
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full" data-testid="calendar-view">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border">
              {(['month', 'week', 'day'] as const).map((viewOption) => (
                <Button
                  key={viewOption}
                  variant={selectedView === viewOption ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedView(viewOption)}
                  data-testid={`button-view-${viewOption}`}
                  className="rounded-none first:rounded-l-md last:rounded-r-md"
                >
                  {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate('prev')}
                data-testid="button-calendar-prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate('next')}
                data-testid="button-calendar-next"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto min-h-[400px]">
          {selectedView === 'week' && renderWeekView()}
          {selectedView === 'day' && renderDayView()}
          {selectedView === 'month' && (
            <div className="p-4 sm:p-6 text-center text-muted-foreground">
              <CalendarIcon className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm sm:text-base">Month view will be implemented with full calendar component</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}