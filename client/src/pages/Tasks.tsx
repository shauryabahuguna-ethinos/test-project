import { useState } from "react";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Task } from "@shared/types";

export default function Tasks() {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
    console.log('Opening task creation form');
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
    console.log('Editing task:', task.id);
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      console.log('Updating task:', editingTask.id, taskData);
    } else {
      console.log('Creating new task:', taskData);
    }
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleTaskDelete = (taskId: string) => {
    console.log('Deleting task:', taskId);
  };

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    console.log('Changing task status:', taskId, status);
  };

  const handleFormCancel = () => {
    setShowTaskForm(false);
    setEditingTask(null);
    console.log('Task form cancelled');
  };

  return (
    <div data-testid="tasks-page">
      <TaskList
        onTaskEdit={handleEditTask}
        onTaskDelete={handleTaskDelete}
        onTaskStatusChange={handleStatusChange}
        onCreateTask={handleCreateTask}
      />

      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            task={editingTask || undefined}
            onSubmit={handleTaskSubmit}
            onCancel={handleFormCancel}
            isLoading={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}