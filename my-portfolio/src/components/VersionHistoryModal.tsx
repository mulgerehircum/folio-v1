import Modal from "./Modal"
import { versionHistory } from "../data/versionHistory"
import Button from "./Button"

interface VersionHistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

function VersionHistoryModal({ isOpen, onClose }: VersionHistoryModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full">
        <h2 className="text-2xl font-bold text-zinc-100 mb-8">Version History</h2>
        <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2">
          {versionHistory.map((item, index) => (
            <div key={index} className="border-b border-zinc-700 pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-semibold text-[#4DD7FA]">{item.version}</span>
                <span className="text-sm text-zinc-400">{formatDate(item.date)}</span>
              </div>
              <ul className="list-none space-y-2 text-zinc-300 text-base">
                {item.changes.map((change, changeIndex) => (
                  <li key={changeIndex} className="leading-relaxed">{change}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Button
          onClick={onClose}
          className="mt-8"
        >
          Close
        </Button>
      </div>
    </Modal>
  )
}

export default VersionHistoryModal

