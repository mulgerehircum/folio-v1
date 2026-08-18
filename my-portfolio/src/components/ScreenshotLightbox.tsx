import { X } from "lucide-react"
import Modal from "./Modal"

interface ScreenshotLightboxProps {
  isOpen: boolean
  onClose: () => void
  title: string
  imageUrl: string
}

/**
 * Zoomed-in screenshot view — the non-iframe side of the experiment for
 * projects with a static screenshotUrl instead of a video (see
 * utils/experiment.ts). Gives those cards the same "click always does
 * something" affordance as the video cards, so the iframe variant isn't the
 * only clickable one.
 */
function ScreenshotLightbox({ isOpen, onClose, title, imageUrl }: ScreenshotLightboxProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="relative border border-cyan-400/30 bg-zinc-950 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.7)]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-zinc-950/80 border border-cyan-400/30 flex items-center justify-center text-zinc-300 hover:text-cyan-400 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <img
        src={imageUrl}
        alt={`${title} screenshot`}
        className="block max-w-[92vw] max-h-[85vh] object-contain"
      />
    </Modal>
  )
}

export default ScreenshotLightbox
