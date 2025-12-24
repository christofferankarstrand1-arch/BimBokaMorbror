import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'mamma' | 'pappa' | 'bim' | 'morbror'

export interface FamilyUser {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface Booking {
  id: string
  type: BookingType
  date: string
  time: string
  duration: number
  description?: string
  status: BookingStatus
  created_by: string
  checklist: ChecklistItem[]
  morbror_comment?: string
  created_at: string
}

export type BookingType = 
  | 'barnpassning'
  | 'bim-nar-inte'
  | 'lekstund'
  | 'promenad'
  | 'bygga'
  | 'akuthjalp'

export type BookingStatus = 'utkast' | 'forfragan' | 'godkand' | 'avslagen' | 'genomford'

export interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

export interface AvailableTime {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
}

export interface Memory {
  id: string
  booking_id?: string
  date: string
  text: string
  mood?: 'glad' | 'nyfiken' | 'trott' | 'gnallig'
  images?: string[]
  created_by: string
  created_at: string
}

export interface ChecklistTemplate {
  id: string
  booking_type: BookingType
  items: string[]
}
