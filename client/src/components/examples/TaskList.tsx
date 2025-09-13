import TaskList from '../TaskList'

export default function TaskListExample() {
  return (
    <div className="p-4">
      <TaskList
        onTaskEdit={(task) => console.log('Edit task:', task)}
        onTaskDelete={(id) => console.log('Delete task:', id)}
        onTaskStatusChange={(id, status) => console.log('Status change:', id, status)}
        onCreateTask={() => console.log('Create new task')}
      />
    </div>
  )
}