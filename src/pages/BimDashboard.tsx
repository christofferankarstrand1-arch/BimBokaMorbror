import { useState } from 'react'
import { Heart, Footprints, Blocks, Hand, Gamepad2 } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { BookingType } from '../lib/supabase'
import { MatchingGame } from '../components/MatchingGame'

const BIM_OPTIONS: { type: BookingType; label: string; icon: typeof Heart; color: string }[] = [
  { type: 'lekstund', label: 'Lek', icon: Gamepad2, color: 'bg-pink-500' },
  { type: 'promenad', label: 'Promenad', icon: Footprints, color: 'bg-blue-500' },
  { type: 'bygga', label: 'Bygga', icon: Blocks, color: 'bg-purple-500' },
  { type: 'bim-nar-inte', label: 'Hamta hogt', icon: Hand, color: 'bg-amber-500' },
]

export function BimDashboard() {
  const { addBooking, getTemplateForType } = useData()
  const { user } = useAuth()
  const [showGame, setShowGame] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedType, setSelectedType] = useState<BookingType | null>(null)

  const handleSelect = (type: BookingType) => {
    setSelectedType(type)
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    if (!selectedType || !user) return

    const template = getTemplateForType(selectedType)
    addBooking({
      type: selectedType,
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      duration: 60,
      description: 'Bim vill traffa morbror!',
      status: 'utkast',
      created_by: user.id,
      checklist: template.map((text, i) => ({ id: String(i), text, checked: false })),
    })

    setShowConfirm(false)
    setSelectedType(null)
  }

  if (showGame) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setShowGame(false)}
          className="text-sage-600 font-medium"
        >
          Tillbaka
        </button>
        <MatchingGame />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-sage-700 mb-2">Hej Bim!</h2>
        <p className="text-xl text-warm-600">Vad vill du gora?</p>
      </div>

      <button
        onClick={() => handleSelect('barnpassning')}
        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-8 rounded-3xl text-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
      >
        <Heart size={48} className="mx-auto mb-2" />
        Traffa morbror!
      </button>

      <div className="grid grid-cols-2 gap-4">
        {BIM_OPTIONS.map(({ type, label, icon: Icon, color }) => (
          <button
            key={type}
            onClick={() => handleSelect(type)}
            className={`${color} text-white py-6 rounded-2xl text-lg font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-105`}
          >
            <Icon size={36} className="mx-auto mb-1" />
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowGame(true)}
        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-6 rounded-2xl text-xl font-bold shadow-md hover:shadow-lg transition-all"
      >
        Spela spel!
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center">
            <Heart size={64} className="mx-auto text-rose-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Vill du traffa morbror?</h3>
            <p className="text-gray-600 mb-6">Mamma eller pappa maste saga ja forst!</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-4 bg-warm-100 text-gray-700 rounded-2xl font-bold text-lg"
              >
                Nej
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-4 bg-sage-600 text-white rounded-2xl font-bold text-lg"
              >
                Ja!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
