import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles } from "lucide-react";
import { format } from "date-fns";
import type { Task } from "@shared/types";
import { cn, getPriorityLabel } from "@/lib/utils";

interface TaskFormProps {
  task?: Partial<Task>;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function TaskForm({ task, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || 3 as 1 | 2 | 3 | 4 | 5,
    estimatedTime: task?.estimatedTime || 60,
    deadline: task?.deadline || undefined,
    progress: task?.progress || 0,
    status: task?.status || 'pending' as Task['status']
  });

  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      actualTime: task?.actualTime,
      scheduledStart: task?.scheduledStart,
      scheduledEnd: task?.scheduledEnd
    });
    console.log('Task form submitted:', formData);
  };

  const handleAIOptimize = () => {
    setShowAISuggestions(!showAISuggestions);
    console.log('AI optimization requested for task:', formData.title);
  };

  return (
    <Card className="w-full max-w-2xl" data-testid="task-form">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {task?.id ? 'Edit Task' : 'Create New Task'}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAIOptimize}
            data-testid="button-ai-optimize"
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Optimize
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title..."
              required
              data-testid="input-task-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the task in detail..."
              rows={3}
              data-testid="input-task-description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority.toString()}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  priority: parseInt(value) as 1 | 2 | 3 | 4 | 5 
                }))}
              >
                <SelectTrigger data-testid="select-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((priority) => (
                    <SelectItem key={priority} value={priority.toString()}>
                      {getPriorityLabel(priority as 1 | 2 | 3 | 4 | 5)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
              <Input
                id="estimatedTime"
                type="number"
                value={formData.estimatedTime}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  estimatedTime: parseInt(e.target.value) || 0 
                }))}
                min={1}
                data-testid="input-estimated-time"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Deadline (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.deadline && "text-muted-foreground"
                  )}
                  data-testid="button-deadline-picker"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.deadline ? format(formData.deadline, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.deadline}
                  onSelect={(date) => setFormData(prev => ({ ...prev, deadline: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {showAISuggestions && (
            <div className="p-4 border rounded-md bg-muted/50 space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Suggestions
              </h4>
              <p className="text-xs text-muted-foreground">
                Based on your task description, I recommend:
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Priority: High (complexity suggests importance)</li>
                <li>• Estimated time: 4-6 hours (complex implementation)</li>
                <li>• Break into subtasks for better tracking</li>
              </ul>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} data-testid="button-submit-task">
              {isLoading ? 'Saving...' : task?.id ? 'Update Task' : 'Create Task'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-task">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}