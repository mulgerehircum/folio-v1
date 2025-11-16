import { createPortal } from "react-dom"
import { useEffect } from "react"

function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
    useEffect(() => {
      if (!isOpen) return
  
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
  
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      // Compensate for scrollbar width to prevent layout shift
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
  
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
      }
    }, [isOpen, onClose])
  
    if (!isOpen) return null
  
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
        <div 
          className="w-full max-w-xl border border-cyan-400/30 bg-zinc-950/40 rounded-xl px-8 py-6 backdrop-blur-sm shadow-[0_0_40px_rgba(0,0,0,0.7)] transition-all duration-400 ease-out"
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      </div>,
      document.body
    )
  }

export default Modal