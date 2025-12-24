import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface WelcomeVideoProps {
  onClose: () => void
}

export function WelcomeVideo({ onClose }: WelcomeVideoProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div 
      className={`fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className={`bg-white rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl transition-transform duration-300 ${
        isVisible ? 'scale-100' : 'scale-95'
      }`}>
        <div className="relative">
          <video 
            autoPlay 
            controls
            playsInline
            className="w-full"
            onEnded={handleClose}
          >
            <source src="/images/Skapa_Animerad_Video_Med_Dialog.mp4" type="video/mp4" />
            Din webblasare stodjer inte video.
          </video>
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-4 text-center">
          <button
            onClick={handleClose}
            className="bg-sage-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-sage-700 transition-colors"
          >
            Stang
          </button>
        </div>
      </div>
    </div>
  )
}
