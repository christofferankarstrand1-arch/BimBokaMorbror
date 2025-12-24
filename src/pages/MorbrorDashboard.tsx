import { useState } from 'react'
import { Check, X, CheckCircle, Calendar, Clock } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { BookingType } from '../lib/supabase'

const TYPE_LABELS: Record<BookingType, string> = {
  barnpassning: 'Barnpassning',
  'bim-nar-inte': 'Bim nar inte',
  lekstund: 'Lekstund',
  promenad: 'Promenad',
  bygga: 'Bygga/Montera',
  akuthjalp: 'Akuthjalp',
}


export function MorbrorDashboard() {
  const { bookings, updateBookingStatus } = useData()
  const [comment, setComment] = useState('')
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null)

  const pendingBookings = bookings.filter(b => b.status === 'forfragan')
  const approvedBookings = bookings.filter(b => b.status === 'godkand')

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
      <div className="text-center">
        <h2 className="text-2xl font-bold text-sage-700">Valkomna forfragningar!</h2>
        <p className="text-warm-600">Har ser du vad familjen vill boka</p>
      </div>

      {pendingBookings.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-semibold text-amber-700 flex items-center gap-2">
            <Calendar size={20} />
            Nya forfragningar ({pendingBookings.length})
          </h3>
          {pendingBookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-2xl shadow-md border-2 border-amber-200 overflow-hidden">
              <div className="bg-amber-50 px-4 py-2 border-b border-amber-200">
                <h4 className="font-bold text-lg text-gray-800">{TYPE_LABELS[booking.type]}</h4>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>kl {booking.time} ({booking.duration} min)</span>
                  </div>
                </div>
                
                {booking.description && (
                  <p className="text-gray-600 bg-warm-50 p-3 rounded-lg mb-4">{booking.description}</p>
                )}

                {activeBookingId === booking.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Kommentar till familjen (valfritt)"
                      rows={2}
                      className="w-full p-3 border border-warm-200 rounded-xl text-sm focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(booking.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
                      >
                        <Check size={20} />
                        Jag kan!
                      </button>
                      <button
                        onClick={() => handleReject(booking.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600"
                      >
                        <X size={20} />
                        Kan inte
                      </button>
                    </div>
                    <button
                      onClick={() => setActiveBookingId(null)}
                      className="w-full py-2 text-gray-500 hover:text-gray-700"
                    >
                      Avbryt
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveBookingId(booking.id)}
                    className="w-full bg-sage-600 text-white py-3 rounded-xl font-semibold hover:bg-sage-700 transition-colors"
                  >
                    Svara pa forfragan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-2xl shadow-sm">
          <Calendar size={48} className="mx-auto text-warm-300 mb-3" />
          <p className="text-warm-500">Inga nya forfragningar just nu</p>
          <p className="text-warm-400 text-sm mt-1">Ta det lugnt!</p>
        </div>
      )}

      {approvedBookings.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-green-700 flex items-center gap-2">
            <CheckCircle size={20} />
            Kommande pass ({approvedBookings.length})
          </h3>
          {approvedBookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-green-200 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800">{TYPE_LABELS[booking.type]}</h4>
                  <p className="text-sm text-gray-500">
                    {formatDate(booking.date)} kl {booking.time}
                  </p>
                </div>
                <button
                  onClick={() => handleComplete(booking.id)}
                  className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-200"
                >
                  <CheckCircle size={16} />
                  Klar!
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
