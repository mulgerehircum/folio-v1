import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Header from './Header.tsx'
import Footer from './Footer.tsx'
import VersionHistoryModal from './components/VersionHistoryModal.tsx'

function Root() {
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false)

  return (
    <StrictMode>
      <Header />
      <App />
      <Footer onVersionClick={() => setIsVersionModalOpen(true)} />
      <VersionHistoryModal 
        isOpen={isVersionModalOpen} 
        onClose={() => setIsVersionModalOpen(false)} 
      />
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)
