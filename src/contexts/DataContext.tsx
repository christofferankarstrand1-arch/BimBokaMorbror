import { createContext, useContext, useState, ReactNode } from 'react'
import { Booking, BookingType, BookingStatus, AvailableTime, Memory, ChecklistTemplate } from '../lib/supabase'

interface DataContextType {
  bookings: Booking[]
  availableTimes: AvailableTime[]
  memories: Memory[]
  checklistTemplates: ChecklistTemplate[]
  addBooking: (booking: Omit<Booking, 'id' | 'created_at'>) => void
  updateBookingStatus: (id: string, status: BookingStatus, comment?: string) => void
  addMemory: (memory: Omit<Memory, 'id' | 'created_at'>) => void
  updateChecklistTemplate: (type: BookingType, items: string[]) => void
  addAvailableTime: (time: Omit<AvailableTime, 'id'>) => void
  removeAvailableTime: (id: string) => void
  getTemplateForType: (type: BookingType) => string[]
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const DEFAULT_TEMPLATES: ChecklistTemplate[] = [
  { id: '1', booking_type: 'barnpassning', items: ['Blojor', 'Vatservetter', 'Extraklader', 'Mat/snacks', 'Napp', 'Favoritbok', 'Gosedjur'] },
  { id: '2', booking_type: 'promenad', items: ['Vagn', 'Filt', 'Mossa', 'Regnskydd', 'Solskydd'] },
  { id: '3', booking_type: 'bim-nar-inte', items: ['Beskriv vad som ska hamtas/fixas'] },
  { id: '4', booking_type: 'lekstund', items: ['Favoritlek', 'Bocker', 'Klossar'] },
  { id: '5', booking_type: 'bygga', items: ['Verktyg', 'Instruktioner', 'Skruvar/delar'] },
  { id: '6', booking_type: 'akuthjalp', items: ['Beskriv vad som behover fixas akut'] },
]

const DEFAULT_TIMES: AvailableTime[] = [
  { id: '1', day_of_week: 3, start_time: '17:00', end_time: '19:00' },
  { id: '2', day_of_week: 6, start_time: '10:00', end_time: '14:00' },
  { id: '3', day_of_week: 0, start_time: '14:00', end_time: '17:00' },
]

export function DataProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('boka-morbror-bookings')
    return saved ? JSON.parse(saved) : []
  })

  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>(() => {
    const saved = localStorage.getItem('boka-morbror-times')
    return saved ? JSON.parse(saved) : DEFAULT_TIMES
  })

  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem('boka-morbror-memories')
    return saved ? JSON.parse(saved) : []
  })

  const [checklistTemplates, setChecklistTemplates] = useState<ChecklistTemplate[]>(() => {
    const saved = localStorage.getItem('boka-morbror-templates')
    return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES
  })

  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings)
    localStorage.setItem('boka-morbror-bookings', JSON.stringify(newBookings))
  }

  const addBooking = (booking: Omit<Booking, 'id' | 'created_at'>) => {
    const newBooking: Booking = {
      ...booking,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }
    saveBookings([...bookings, newBooking])
  }

  const updateBookingStatus = (id: string, status: BookingStatus, comment?: string) => {
    const updated = bookings.map(b => 
      b.id === id ? { ...b, status, morbror_comment: comment || b.morbror_comment } : b
    )
    saveBookings(updated)
  }

  const addMemory = (memory: Omit<Memory, 'id' | 'created_at'>) => {
    const newMemory: Memory = {
      ...memory,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }
    const updated = [...memories, newMemory]
    setMemories(updated)
    localStorage.setItem('boka-morbror-memories', JSON.stringify(updated))
  }

  const updateChecklistTemplate = (type: BookingType, items: string[]) => {
    const updated = checklistTemplates.map(t =>
      t.booking_type === type ? { ...t, items } : t
    )
    setChecklistTemplates(updated)
    localStorage.setItem('boka-morbror-templates', JSON.stringify(updated))
  }

  const addAvailableTime = (time: Omit<AvailableTime, 'id'>) => {
    const newTime: AvailableTime = { ...time, id: crypto.randomUUID() }
    const updated = [...availableTimes, newTime]
    setAvailableTimes(updated)
    localStorage.setItem('boka-morbror-times', JSON.stringify(updated))
  }

  const removeAvailableTime = (id: string) => {
    const updated = availableTimes.filter(t => t.id !== id)
    setAvailableTimes(updated)
    localStorage.setItem('boka-morbror-times', JSON.stringify(updated))
  }

  const getTemplateForType = (type: BookingType): string[] => {
    return checklistTemplates.find(t => t.booking_type === type)?.items || []
  }

  return (
    <DataContext.Provider value={{
      bookings,
      availableTimes,
      memories,
      checklistTemplates,
      addBooking,
      updateBookingStatus,
      addMemory,
      updateChecklistTemplate,
      addAvailableTime,
      removeAvailableTime,
      getTemplateForType,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
