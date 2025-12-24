import { Link } from 'react-router-dom'
import { Baby, Hand, Gamepad2, CloudSun, Wrench, AlertCircle, Plus } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { BookingType } from '../lib/supabase'

const BOOKING_TYPES: { type: BookingType; label: string; icon: typeof Baby; duration: number; color: string }[] = [
  { type: 'barnpassning', label: 'Barnpassning', icon: Baby, duration: 120, color: 'bg-rose-500' },
  { type: 'bim-nar-inte', label: 'Bim nar inte', icon: Hand, duration: 30, color: 'bg-amber-500' },
  { type: 'lekstund', label: 'Lekstund', icon: Gamepad2, duration: 60, color: 'bg-green-500' },
  { type: 'promenad', label: 'Promenad', icon: CloudSun, duration: 60, color: 'bg-blue-500' },
  { type: 'bygga', label: 'Bygga/Montera', icon: Wrench, duration: 90, color: 'bg-purple-500' },
  { type: 'akuthjalp', label: 'Akuthjalp idag', icon: AlertCircle, duration: 60, color: 'bg-red-600' },
]

export function Dashboard() {
  const { bookings } = useData()
  const { user } = useAuth()

  const upcomingBookings = bookings
    .filter(b => b.status === 'godkand' && new Date(b.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  const pendingBookings = bookings.filter(b => b.status === 'forfragan')

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const getTypeLabel = (type: BookingType) => {
    return BOOKING_TYPES.find(t => t.type === type)?.label || type
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-sage-700">Hej {user?.name}!</h2>
        <p className="text-warm-600">Vad behover ni hjalp med?</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {BOOKING_TYPES.map(({ type, label, icon: Icon, duration, color }) => (
          <Link
            key={type}
            to={`/book?type=${type}&duration=${duration}`}
            className={`${color} text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105`}
          >
            <Icon size={28} className="mb-2" />
            <div className="font-semibold text-sm">{label}</div>
          </Link>
        ))}
      </div>

      <Link
        to="/book"
        className="flex items-center justify-center gap-2 w-full bg-sage-600 text-white py-3 rounded-xl font-semibold hover:bg-sage-700 transition-colors"
      >
        <Plus size={20} />
        Ny bokning
      </Link>

      {pendingBookings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-semibold text-amber-800 mb-2">
            Vantar pa svar ({pendingBookings.length})
          </h3>
          {pendingBookings.map(booking => (
            <div key={booking.id} className="text-sm text-amber-700">
              {getTypeLabel(booking.type)} - {formatDate(booking.date)}
            </div>
          ))}
        </div>
      )}

      {upcomingBookings.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="font-semibold text-sage-700 mb-3">Kommande bokningar</h3>
          <div className="space-y-3">
            {upcomingBookings.map(booking => (
              <div key={booking.id} className="flex justify-between items-center border-b border-warm-100 pb-2 last:border-0">
                <div>
                  <div className="font-medium text-gray-800">{getTypeLabel(booking.type)}</div>
                  <div className="text-sm text-gray-500">{formatDate(booking.date)} kl {booking.time}</div>
                </div>
                <div className="text-sm text-sage-600">{booking.duration} min</div>
              </div>
            ))}
          </div>
          <Link to="/bookings" className="block text-center text-sage-600 text-sm mt-3 hover:underline">
            Visa alla bokningar
          </Link>
        </div>
      )}

      {upcomingBookings.length === 0 && pendingBookings.length === 0 && (
        <div className="text-center py-8 text-warm-500">
          <p>Inga bokningar an.</p>
          <p className="text-sm mt-1">Tryck pa en knapp ovan for att boka morbror!</p>
        </div>
      )}
    </div>
  )
}
