import { useState } from 'react'
import { Heart, Footprints, Blocks, Hand, Gamepad2, Star, Check } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { BookingType } from '../lib/supabase'
import { MatchingGame } from '../components/MatchingGame'

const BIM_OPTIONS: { type: BookingType; label: string; icon: typeof Heart; color: string; emoji: string }[] = [
  { type: 'lekstund', label: 'Leka', icon: Gamepad2, color: 'bg-pink-500', emoji: '🎮' },
  { type: 'promenad', label: 'Ga ut', icon: Footprints, color: 'bg-blue-500', emoji: '🚶' },
  { type: 'bygga', label: 'Bygga', icon: Blocks, color: 'bg-purple-500', emoji: '🧱' },
  { type: 'bim-nar-inte', label: 'Hjalp', icon: Hand, color: 'bg-amber-500', emoji: '🖐️' },
]

export function BimDashboard() {
  const { addBooking, getTemplateForType, bookings } = useData()
  const { user } = useAuth()
  const [showGame, setShowGame] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedType, setSelectedType] = useState<BookingType | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const pendingFromBim = bookings.filter(b => b.status === 'utkast' && b.created_by === user?.id)

  const handleSelect = (type: BookingType) => {
    setSelectedType(type)
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    if (!selectedType || !user) return

    const template = getTemplateForType(selectedType)
    const typeLabels: Record<BookingType, string> = {
      barnpassning: 'traffa morbror',
      lekstund: 'leka med morbror',
      promenad: 'ga ut med morbror',
      bygga: 'bygga med morbror',
      'bim-nar-inte': 'fa hjalp av morbror',
      akuthjalp: 'traffa morbror',
    }
    
    addBooking({
      type: selectedType,
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      duration: 60,
      description: `Bim vill ${typeLabels[selectedType]}!`,
      status: 'utkast',
      created_by: user.id,
      checklist: template.map((text, i) => ({ id: String(i), text, checked: false })),
    })

    setShowConfirm(false)
    setSelectedType(null)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
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
        <img 
          src="/images/morbror-avatar.png" 
          alt="Morbror" 
          className="w-24 h-24 rounded-full mx-auto mb-3 ring-4 ring-sage-300"
        />
        <h2 className="text-3xl font-bold text-sage-700 mb-2">Hej Bim!</h2>
        <p className="text-xl text-warm-600">Vad vill du gora med morbror?</p>
      </div>

      {showSuccess && (
        <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-4 text-center animate-pulse">
          <Check size={48} className="mx-auto text-green-600 mb-2" />
          <p className="text-xl font-bold text-green-700">Bra jobbat!</p>
          <p className="text-green-600">Mamma eller pappa skickar till morbror</p>
        </div>
      )}

      {pendingFromBim.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-center">
          <Star size={32} className="mx-auto text-amber-500 mb-2" />
          <p className="text-lg font-bold text-amber-700">
            Du har {pendingFromBim.length} onskning{pendingFromBim.length > 1 ? 'ar' : ''}!
          </p>
          <p className="text-amber-600 text-sm">Mamma eller pappa maste saga ja</p>
        </div>
      )}

      <button
        onClick={() => handleSelect('barnpassning')}
        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-8 rounded-3xl text-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
      >
        <Heart size={48} className="mx-auto mb-2" />
        Traffa morbror!
      </button>

      <div className="grid grid-cols-2 gap-4">
        {BIM_OPTIONS.map(({ type, label, color, emoji }) => (
          <button
            key={type}
            onClick={() => handleSelect(type)}
            className={`${color} text-white py-6 rounded-2xl text-lg font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-105`}
          >
            <span className="text-3xl block mb-1">{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowGame(true)}
        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-6 rounded-2xl text-xl font-bold shadow-md hover:shadow-lg transition-all"
      >
        <span className="text-3xl mr-2">🎯</span>
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
