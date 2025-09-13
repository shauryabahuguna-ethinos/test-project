import TaskForm from '../TaskForm'

export default function TaskFormExample() {
  return (
    <div className="p-4">
      <TaskForm
        onSubmit={(taskData) => console.log('Task submitted:', taskData)}
        onCancel={() => console.log('Form cancelled')}
        isLoading={false}
      />
    </div>
  )
}