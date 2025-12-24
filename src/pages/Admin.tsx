import { useState } from 'react'
import { Check, X, CheckCircle } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { BookingType, BookingStatus } from '../lib/supabase'

const TYPE_LABELS: Record<BookingType, string> = {
  barnpassning: 'Barnpassning',
  'bim-nar-inte': 'Bim nar inte',
  lekstund: 'Lekstund',
  promenad: 'Promenad',
  bygga: 'Bygga/Montera',
  akuthjalp: 'Akuthjalp',
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  utkast: 'Utkast',
  forfragan: 'Forfragan',
  godkand: 'Godkand',
  avslagen: 'Avslagen',
  genomford: 'Genomford',
}

export function Admin() {
  const { bookings, updateBookingStatus } = useData()
  const [comment, setComment] = useState('')
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null)

  const pendingBookings = bookings.filter(b => b.status === 'forfragan')
  const approvedBookings = bookings.filter(b => b.status === 'godkand')
  const allBookings = bookings.filter(b => b.status !== 'utkast')

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const handleApprove = (id: string) => {
    updateBookingStatus(id, 'godkand', comment)
    setComment('')
    setActiveBookingId(null)
  }

  const handleReject = (id: string) => {
    updateBookingStatus(id, 'avslagen', comment)
    setComment('')
    setActiveBookingId(null)
  }

  const handleComplete = (id: string) => {
    updateBookingStatus(id, 'genomford')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-sage-700">Morbror-panelen</h2>
        <p className="text-sm text-warm-500">Hantera forfragningar och bokningar</p>
      </div>

      {pendingBookings.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-amber-700">Nya forfragningar ({pendingBookings.length})</h3>
          {pendingBookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{TYPE_LABELS[booking.type]}</h4>
                    <p className="text-sm text-gray-500">
                      {formatDate(booking.date)} kl {booking.time} ({booking.duration} min)
                    </p>
                  </div>
                </div>
                {booking.description && (
                  <p className="text-sm text-gray-600 mb-3">{booking.description}</p>
                )}

                {activeBookingId === booking.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Kommentar (valfritt)"
                      rows={2}
                      className="w-full p-2 border border-warm-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(booking.id)}
                        className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700"
                      >
                        <Check size={18} />
                        Godkann
                      </button>
                      <button
                        onClick={() => handleReject(booking.id)}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700"
                      >
                        <X size={18} />
                        Avboj
                      </button>
                      <button
                        onClick={() => setActiveBookingId(null)}
                        className="px-3 py-2 bg-warm-100 text-gray-700 rounded-lg font-medium hover:bg-warm-200"
                      >
                        Avbryt
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveBookingId(booking.id)}
                    className="w-full bg-sage-600 text-white py-2 rounded-lg font-medium hover:bg-sage-700"
                  >
                    Svara pa forfragan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {approvedBookings.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-green-700">Kommande bokningar ({approvedBookings.length})</h3>
          {approvedBookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-green-200 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800">{TYPE_LABELS[booking.type]}</h4>
                  <p className="text-sm text-gray-500">
                    {formatDate(booking.date)} kl {booking.time} ({booking.duration} min)
                  </p>
                </div>
                <button
                  onClick={() => handleComplete(booking.id)}
                  className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  <CheckCircle size={18} />
                  Markera klar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingBookings.length === 0 && approvedBookings.length === 0 && (
        <div className="text-center py-12 text-warm-500">
          <p>Inga aktiva forfragningar eller bokningar.</p>
        </div>
      )}

      {allBookings.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold text-gray-700 mb-3">Alla bokningar</h3>
          <div className="space-y-2">
            {allBookings.map(booking => (
              <div key={booking.id} className="bg-warm-50 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-700">{TYPE_LABELS[booking.type]}</span>
                  <span className="text-gray-500 ml-2 text-sm">{formatDate(booking.date)}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  booking.status === 'godkand' ? 'bg-green-100 text-green-700' :
                  booking.status === 'avslagen' ? 'bg-red-100 text-red-700' :
                  booking.status === 'genomford' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {STATUS_LABELS[booking.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
