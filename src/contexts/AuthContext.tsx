import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase, FamilyUser } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: FamilyUser | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isParent: boolean
  isBim: boolean
  isMorbror: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USERS: Record<string, FamilyUser> = {
  'sandra': { id: '1', email: 'sandra@bokamorbror.se', name: 'Sandra', role: 'mamma' },
  'lukas': { id: '2', email: 'lukas@bokamorbror.se', name: 'Lukas', role: 'pappa' },
  'bim': { id: '3', email: 'bim@bokamorbror.se', name: 'Bim', role: 'bim' },
  'christoffer': { id: '4', email: 'christoffer@bokamorbror.se', name: 'Christoffer', role: 'morbror' },
}

const FAMILY_PASSWORD = 'HejaBajen'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FamilyUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('boka-morbror-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (username: string, password: string) => {
    if (password !== FAMILY_PASSWORD) {
      throw new Error('Fel losenord')
    }
    const demoUser = DEMO_USERS[username.toLowerCase()]
    if (demoUser) {
      setUser(demoUser)
      localStorage.setItem('boka-morbror-user', JSON.stringify(demoUser))
      return
    }
    throw new Error('Okand anvandare')
  }

  const signOut = async () => {
    setUser(null)
    setSession(null)
    localStorage.removeItem('boka-morbror-user')
    await supabase.auth.signOut()
  }

  const isParent = user?.role === 'mamma' || user?.role === 'pappa'
  const isBim = user?.role === 'bim'
  const isMorbror = user?.role === 'morbror'

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut, isParent, isBim, isMorbror }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
