import AIContentGenerator from '../AIContentGenerator'

export default function AIContentGeneratorExample() {
  return (
    <div className="p-4 max-w-4xl">
      <AIContentGenerator
        onGenerate={(content) => console.log('Generated content:', content)}
      />
    </div>
  )
}