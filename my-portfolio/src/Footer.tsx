interface FooterProps {
  onVersionClick: () => void
}

function Footer({ onVersionClick }: FooterProps) {
  return (
    <footer className="group flex justify-between items-center gap-2 px-6 py-4 backdrop-blur-md border-t border-white/10 transition-all duration-300 bg-[rgba(6,12,18,0.55)] shadow-[inset_0_10px_10px_-10px_rgba(77,215,250,0.55)]">
      <div className="flex items-center gap-2">
        <button 
          onClick={onVersionClick} 
          className="md:flex hidden font-medium tracking-wide text-zinc-400 hover:text-zinc-300 transition-colors"
        >
          © 2025 
        </button>
      </div>
      <div className="flex items-center gap-4">
        
      </div>
    </footer>
  )
}

export default Footer

