import { useState } from 'react'
import { Plus, Heart } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'

const MOODS = [
  { value: 'glad', label: 'Glad' },
  { value: 'nyfiken', label: 'Nyfiken' },
  { value: 'trott', label: 'Trott' },
  { value: 'gnallig', label: 'Gnallig' },
] as const

export function Memories() {
  const { memories, addMemory } = useData()
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [text, setText] = useState('')
  const [mood, setMood] = useState<'glad' | 'nyfiken' | 'trott' | 'gnallig' | undefined>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !user) return

    addMemory({
      date: new Date().toISOString().split('T')[0],
      text: text.trim(),
      mood,
      created_by: user.id,
    })

    setText('')
    setMood(undefined)
    setShowForm(false)
  }

  const sortedMemories = [...memories].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const getMoodLabel = (m: string) => MOODS.find(mood => mood.value === m)?.label || m

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-sage-700">Minnen</h2>
          <p className="text-sm text-warm-500">Fran stunder med morbror</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-sage-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-sage-700 transition-colors"
        >
          <Plus size={18} />
          Nytt minne
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-4 border border-warm-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vad hande?</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Idag gjorde vi..."
              rows={4}
              required
              className="w-full p-3 border border-warm-200 rounded-xl bg-white focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bims humor (valfritt)</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(mood === m.value ? undefined : m.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    mood === m.value
                      ? 'bg-sage-600 text-white'
                      : 'bg-warm-100 text-gray-600 hover:bg-warm-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-sage-600 text-white py-3 rounded-xl font-medium hover:bg-sage-700 transition-colors"
            >
              Spara minne
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

      {sortedMemories.length === 0 ? (
        <div className="text-center py-12 text-warm-500">
          <Heart size={48} className="mx-auto mb-4 opacity-50" />
          <p>Inga minnen sparade an.</p>
          <p className="text-sm mt-1">Lagg till ert forsta minne!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMemories.map(memory => (
            <div key={memory.id} className="bg-white rounded-xl shadow-sm p-4 border border-warm-100">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-warm-500">{formatDate(memory.date)}</span>
                {memory.mood && (
                  <span className="text-xs bg-sage-100 text-sage-700 px-2 py-1 rounded-full">
                    {getMoodLabel(memory.mood)}
                  </span>
                )}
              </div>
              <p className="text-gray-700">{memory.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
