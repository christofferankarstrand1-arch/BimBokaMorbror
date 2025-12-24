import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useData } from '../contexts/DataContext'

const DAYS = [
  { value: 0, label: 'Sondag' },
  { value: 1, label: 'Mandag' },
  { value: 2, label: 'Tisdag' },
  { value: 3, label: 'Onsdag' },
  { value: 4, label: 'Torsdag' },
  { value: 5, label: 'Fredag' },
  { value: 6, label: 'Lordag' },
]

export function Availability() {
  const { availableTimes, addAvailableTime, removeAvailableTime } = useData()
  const [showForm, setShowForm] = useState(false)
  const [day, setDay] = useState(3)
  const [startTime, setStartTime] = useState('17:00')
  const [endTime, setEndTime] = useState('19:00')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    addAvailableTime({
      day_of_week: day,
      start_time: startTime,
      end_time: endTime,
    })
    setShowForm(false)
  }

  const getDayLabel = (dayNum: number) => DAYS.find(d => d.value === dayNum)?.label || ''

  const sortedTimes = [...availableTimes].sort((a, b) => a.day_of_week - b.day_of_week)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-sage-700">Morbrors tider</h2>
          <p className="text-sm text-warm-500">Forslagstider for bokningar</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-sage-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-sage-700 transition-colors"
        >
          <Plus size={18} />
          Lagg till
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm p-4 border border-warm-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Veckodag</label>
            <select
              value={day}
              onChange={(e) => setDay(parseInt(e.target.value))}
              className="w-full p-3 border border-warm-200 rounded-xl bg-white focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            >
              {DAYS.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fran</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-3 border border-warm-200 rounded-xl bg-white focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Till</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-3 border border-warm-200 rounded-xl bg-white focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-sage-600 text-white py-3 rounded-xl font-medium hover:bg-sage-700 transition-colors"
            >
              Spara
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-3 bg-warm-100 text-gray-700 rounded-xl font-medium hover:bg-warm-200 transition-colors"
            >
              Avbryt
            </button>
          </div>
        </form>
      )}

      {sortedTimes.length === 0 ? (
        <div className="text-center py-12 text-warm-500">
          <p>Inga forslagstider inlagda an.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedTimes.map(time => (
            <div key={time.id} className="bg-white rounded-xl shadow-sm p-4 border border-warm-100 flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-800">{getDayLabel(time.day_of_week)}</span>
                <span className="text-gray-500 ml-2">{time.start_time} - {time.end_time}</span>
              </div>
              <button
                onClick={() => removeAvailableTime(time.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-sage-50 rounded-xl p-4 mt-6">
        <h3 className="font-medium text-sage-700 mb-2">Tips: Google Kalender</h3>
        <p className="text-sm text-sage-600">
          For att synka med Google Kalender, exportera tiderna harifran och importera dem i din kalender.
          Full integration kommer i en framtida version.
        </p>
      </div>
    </div>
  )
}
