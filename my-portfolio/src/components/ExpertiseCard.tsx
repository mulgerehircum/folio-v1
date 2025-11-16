interface ExpertiseCardProps {
  title: string
  description: string
  accentColor?: string
}

function ExpertiseCard({ title, description, accentColor = "30" }: ExpertiseCardProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className={`w-6 h-px bg-cyan-400/${accentColor} mb-4`} />
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

export default ExpertiseCard

