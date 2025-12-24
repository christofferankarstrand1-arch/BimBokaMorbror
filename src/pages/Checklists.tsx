import { useState } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'
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

export function Checklists() {
  const { checklistTemplates, updateChecklistTemplate } = useData()
  const [editingType, setEditingType] = useState<BookingType | null>(null)
  const [editItems, setEditItems] = useState<string[]>([])
  const [newItem, setNewItem] = useState('')

  const startEdit = (type: BookingType, items: string[]) => {
    setEditingType(type)
    setEditItems([...items])
    setNewItem('')
  }

  const cancelEdit = () => {
    setEditingType(null)
    setEditItems([])
    setNewItem('')
  }

  const saveEdit = () => {
    if (editingType) {
      updateChecklistTemplate(editingType, editItems)
      cancelEdit()
    }
  }

  const addItem = () => {
    if (newItem.trim()) {
      setEditItems([...editItems, newItem.trim()])
      setNewItem('')
    }
  }

  const removeItem = (index: number) => {
    setEditItems(editItems.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-sage-700">Packlistor</h2>
        <p className="text-sm text-warm-500">Mallar for varje bokningstyp</p>
      </div>

      <div className="space-y-3">
        {checklistTemplates.map(template => (
          <div key={template.id} className="bg-white rounded-xl shadow-sm border border-warm-100 overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">{TYPE_LABELS[template.booking_type]}</h3>
                {editingType !== template.booking_type && (
                  <button
                    onClick={() => startEdit(template.booking_type, template.items)}
                    className="text-sage-600 text-sm font-medium hover:underline"
                  >
                    Redigera
                  </button>
                )}
              </div>

              {editingType === template.booking_type ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    {editItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 bg-warm-50 p-2 rounded-lg">
                        <span className="flex-1 text-sm">{item}</span>
                        <button
                          onClick={() => removeItem(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      placeholder="Lagg till sak..."
                      className="flex-1 p-2 border border-warm-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
                    />
                    <button
                      onClick={addItem}
                      className="p-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={saveEdit}
                      className="flex-1 flex items-center justify-center gap-1 bg-sage-600 text-white py-2 rounded-lg font-medium hover:bg-sage-700"
                    >
                      <Save size={16} />
                      Spara
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-warm-100 text-gray-700 rounded-lg font-medium hover:bg-warm-200"
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              ) : (
                <ul className="space-y-1">
                  {template.items.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-sage-400 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
