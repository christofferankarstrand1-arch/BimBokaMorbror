import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { BookingType, ChecklistItem } from '../lib/supabase'

const BOOKING_TYPES: { type: BookingType; label: string }[] = [
  { type: 'barnpassning', label: 'Barnpassning' },
  { type: 'bim-nar-inte', label: 'Bim nar inte' },
  { type: 'lekstund', label: 'Lekstund' },
  { type: 'promenad', label: 'Promenad' },
  { type: 'bygga', label: 'Bygga/Montera' },
  { type: 'akuthjalp', label: 'Akuthjalp idag' },
]

const DURATIONS = [30, 60, 90, 120]

export function Book() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { addBooking, getTemplateForType, availableTimes } = useData()
  const { user } = useAuth()

  const [type, setType] = useState<BookingType>((searchParams.get('type') as BookingType) || 'barnpassning')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState(parseInt(searchParams.get('duration') || '60'))
  const [description, setDescription] = useState('')
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])

  useEffect(() => {
    const template = getTemplateForType(type)
    setChecklist(template.map((text, i) => ({ id: String(i), text, checked: false })))
  }, [type, getTemplateForType])

  const getDayName = (day: number) => {
    const days = ['Sondag', 'Mandag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lordag']
    return days[day]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !time || !user) return

    addBooking({
      type,
      date,
      time,
      duration,
      description,
      status: 'forfragan',
      created_by: user.id,
      checklist,
    })

    navigate('/bookings')
  }

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-warm-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-sage-700">Ny bokning</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Typ av hjalp</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as BookingType)}
            className="w-full p-3 border border-warm-200 rounded-xl bg-white focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          >
            {BOOKING_TYPES.map(({ type: t, label }) => (
              <option key={t} value={t}>{label}</option>
            ))}
          </select>
        </div>

        {availableTimes.length > 0 && (
          <div className="bg-sage-50 p-4 rounded-xl">
            <p className="text-sm font-medium text-sage-700 mb-2">Morbrors forslagstider</p>
            <div className="flex flex-wrap gap-2">
              {availableTimes.map(t => (
                <span key={t.id} className="text-xs bg-sage-100 text-sage-700 px-2 py-1 rounded">
                  {getDayName(t.day_of_week)} {t.start_time}-{t.end_time}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Datum</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full p-3 border border-warm-200 rounded-xl bg-white focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tid</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full p-3 border border-warm-200 rounded-xl bg-white focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Langd</label>
          <div className="flex gap-2">
            {DURATIONS.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                  duration === d
                    ? 'bg-sage-600 text-white'
                    : 'bg-warm-100 text-gray-700 hover:bg-warm-200'
                }`}
              >
                {d} min
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Beskrivning (valfritt)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nagot sarskilt att tanka pa?"
            rows={3}
            className="w-full p-3 border border-warm-200 rounded-xl bg-white focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-none"
          />
        </div>

        {checklist.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Packlista</label>
            <div className="bg-white border border-warm-200 rounded-xl p-3 space-y-2">
              {checklist.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleChecklistItem(item.id)}
                  className="flex items-center gap-3 w-full text-left p-2 hover:bg-warm-50 rounded-lg transition-colors"
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    item.checked ? 'bg-sage-600 border-sage-600' : 'border-gray-300'
                  }`}>
                    {item.checked && <Check size={14} className="text-white" />}
                  </div>
                  <span className={item.checked ? 'line-through text-gray-400' : 'text-gray-700'}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-sage-600 text-white py-4 rounded-xl font-semibold hover:bg-sage-700 transition-colors"
        >
          Skicka forfragan
        </button>
      </form>
    </div>
  )
}
