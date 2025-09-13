import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, MoreVertical, Play, Pause, Check } from "lucide-react";
import PriorityIndicator from "./PriorityIndicator";
import ProgressBar from "./ProgressBar";
import { formatDuration, getStatusColor } from "@/lib/utils";
import type { Task } from "@shared/schema";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleStatusToggle = () => {
    const newStatus = task.status === 'completed' ? 'pending' : 
                     task.status === 'pending' ? 'in-progress' : 'completed';
    onStatusChange?.(task.id, newStatus);
    console.log(`Task ${task.id} status changed to ${newStatus}`);
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed': return <Check className="w-4 h-4" />;
      case 'in-progress': return <Pause className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  return (
    <Card 
      className={`hover-elevate cursor-move transition-all ${isDragging ? 'shadow-lg scale-105' : ''}`}
      data-testid={`task-card-${task.id}`}
      draggable
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight truncate">{task.title}</h3>
            <PriorityIndicator priority={task.priority} />
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleStatusToggle}
              data-testid={`button-status-toggle-${task.id}`}
              className="h-8 w-8"
            >
              {getStatusIcon()}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit?.(task)}
              data-testid={`button-edit-${task.id}`}
              className="h-8 w-8"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span>{formatDuration(task.estimatedTime)}</span>
          </div>
          {task.deadline && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{task.deadline.toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <ProgressBar progress={task.progress} size="sm" />
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <Badge 
              variant="outline" 
              className={`text-xs capitalize self-start ${getStatusColor(task.status)}`}
            >
              {task.status}
            </Badge>
            {task.actualTime && (
              <span className="text-xs text-muted-foreground">
                Actual: {formatDuration(task.actualTime)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}