import { ReactNode } from 'react'
import { LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface BimLayoutProps {
  children: ReactNode
}

export function BimLayout({ children }: BimLayoutProps) {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-100 to-warm-200 flex flex-col">
      <header className="bg-sage-500 text-white p-4 shadow-md">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hej Bim!</h1>
          <button
            onClick={signOut}
            className="p-2 hover:bg-sage-600 rounded-full transition-colors"
            aria-label="Logga ut"
          >
            <LogOut size={24} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-lg mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
