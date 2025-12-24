import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { BookingType, BookingStatus } from '../lib/supabase'

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; icon: typeof Clock }> = {
  utkast: { label: 'Utkast', color: 'bg-gray-100 text-gray-600', icon: Clock },
  forfragan: { label: 'Forfragan', color: 'bg-amber-100 text-amber-700', icon: Clock },
  godkand: { label: 'Godkand', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  avslagen: { label: 'Avslagen', color: 'bg-red-100 text-red-700', icon: XCircle },
  genomford: { label: 'Genomford', color: 'bg-blue-100 text-blue-700', icon: Calendar },
}

const TYPE_LABELS: Record<BookingType, string> = {
  barnpassning: 'Barnpassning',
  'bim-nar-inte': 'Bim nar inte',
  lekstund: 'Lekstund',
  promenad: 'Promenad',
  bygga: 'Bygga/Montera',
  akuthjalp: 'Akuthjalp',
}

export function Bookings() {
  const { bookings } = useData()
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all')

  const filteredBookings = bookings
    .filter(b => filter === 'all' || b.status === filter)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const filters: (BookingStatus | 'all')[] = ['all', 'forfragan', 'godkand', 'avslagen', 'genomford']
  const filterLabels: Record<string, string> = {
    all: 'Alla',
    forfragan: 'Forfragningar',
    godkand: 'Godkanda',
    avslagen: 'Avslagna',
    genomford: 'Genomforda',
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-sage-700">Bokningar</h2>
        <Link
          to="/book"
          className="flex items-center gap-1 bg-sage-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-sage-700 transition-colors"
        >
          <Plus size={18} />
          Ny
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-sage-600 text-white'
                : 'bg-warm-100 text-gray-600 hover:bg-warm-200'
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 text-warm-500">
          <p>Inga bokningar att visa.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map(booking => {
            const statusConfig = STATUS_CONFIG[booking.status]
            const StatusIcon = statusConfig.icon
            return (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm p-4 border border-warm-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{TYPE_LABELS[booking.type]}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(booking.date)} kl {booking.time} ({booking.duration} min)
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                    <StatusIcon size={14} />
                    {statusConfig.label}
                  </span>
                </div>
                {booking.description && (
                  <p className="text-sm text-gray-600 mt-2">{booking.description}</p>
                )}
                {booking.morbror_comment && (
                  <p className="text-sm text-sage-600 mt-2 italic">Morbror: {booking.morbror_comment}</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
