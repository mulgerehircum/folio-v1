import { X } from "lucide-react"
import Modal from "./Modal"

interface LiveSiteModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  url: string
}

/**
 * Full-size modal for the live-iframe A/B variant (see utils/experiment.ts) —
 * a card-sized inline iframe isn't a usable viewport for most of these sites,
 * so this opens much larger instead of embedding inline in the card.
 */
function LiveSiteModal({ isOpen, onClose, title, url }: LiveSiteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="relative w-[92vw] h-[85vh] max-w-6xl border border-cyan-400/30 bg-zinc-950 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.7)]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-zinc-950/80 border border-cyan-400/30 flex items-center justify-center text-zinc-300 hover:text-cyan-400 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <iframe src={url} title={`${title} live site`} className="w-full h-full" />
    </Modal>
  )
}

export default LiveSiteModal
