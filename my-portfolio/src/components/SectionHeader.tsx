interface SectionHeaderProps {
  title: string
  description?: string
  className?: string
}

function SectionHeader({ title, description, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <h2 className="text-xs tracking-[0.3em] text-zinc-300">{title}</h2>
      <div className="w-40 h-px bg-cyan-400/40 mx-auto my-4" />
      {description && (
        <p className="text-center text-zinc-400 max-w-xl mb-16 text-sm leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionHeader

