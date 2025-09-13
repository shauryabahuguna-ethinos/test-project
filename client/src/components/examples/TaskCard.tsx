import TaskCard from '../TaskCard'
import type { Task } from '@shared/schema'

export default function TaskCardExample() {
  //todo: remove mock functionality
  const sampleTask: Task = {
    id: "1",
    title: "Implement AI-powered task scheduling",
    description: "Create the intelligent scheduling algorithm that analyzes task priorities and optimizes calendar placement using machine learning.",
    priority: 1,
    estimatedTime: 240,
    actualTime: 180,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    progress: 65,
    status: 'in-progress',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return (
    <div className="p-4 max-w-sm">
      <TaskCard 
        task={sampleTask}
        onEdit={(task) => console.log('Edit task:', task)}
        onDelete={(id) => console.log('Delete task:', id)}
        onStatusChange={(id, status) => console.log('Status change:', id, status)}
      />
    </div>
  )
}