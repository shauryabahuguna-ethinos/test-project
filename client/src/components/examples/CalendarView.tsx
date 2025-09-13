import CalendarView from '../CalendarView'
import type { Task } from '@shared/types'

export default function CalendarViewExample() {
  //todo: remove mock functionality
  const sampleTasks: Task[] = [
    {
      id: "1",
      title: "Team standup",
      description: "Daily team synchronization",
      priority: 3,
      estimatedTime: 30,
      progress: 0,
      status: 'pending',
      scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow 9 AM
      scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "2", 
      title: "Code review",
      description: "Review pull requests",
      priority: 2,
      estimatedTime: 60,
      progress: 0,
      status: 'pending',
      scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // Tomorrow 11 AM
      scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  return (
    <div className="p-4">
      <CalendarView
        tasks={sampleTasks}
        view="week"
        onTaskDrop={(taskId, date, hour) => console.log('Task dropped:', taskId, date, hour)}
        onCreateEvent={(date, hour) => console.log('Create event:', date, hour)}
      />
    </div>
  )
}