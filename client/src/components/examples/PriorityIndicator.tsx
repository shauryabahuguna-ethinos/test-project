import PriorityIndicator from '../PriorityIndicator'

export default function PriorityIndicatorExample() {
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Priority Levels</h3>
        <PriorityIndicator priority={1} size="md" />
        <PriorityIndicator priority={2} size="md" />
        <PriorityIndicator priority={3} size="md" />
        <PriorityIndicator priority={4} size="md" />
        <PriorityIndicator priority={5} size="md" />
      </div>
    </div>
  )
}