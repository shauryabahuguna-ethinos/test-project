import ProgressBar from '../ProgressBar'

export default function ProgressBarExample() {
  return (
    <div className="space-y-4 p-4 w-64">
      <h3 className="text-sm font-medium">Progress Examples</h3>
      <ProgressBar progress={25} />
      <ProgressBar progress={50} />
      <ProgressBar progress={75} />
      <ProgressBar progress={100} />
    </div>
  )
}