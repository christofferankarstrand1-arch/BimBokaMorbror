import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Calendar, Clock, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface MorbrorLayoutProps {
  children: ReactNode
}

export function MorbrorLayout({ children }: MorbrorLayoutProps) {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Hem' },
    { path: '/bookings', icon: Calendar, label: 'Bokningar' },
    { path: '/availability', icon: Clock, label: 'Mina tider' },
  ]

  return (
    <div className="min-h-screen bg-warm-50">
      <header className="bg-sage-600 text-white px-4 py-3 shadow-md">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <div>
            <h1 className="text-xl font-bold">Boka Morbror</h1>
            <p className="text-sage-100 text-sm">Hej {user?.name}!</p>
          </div>
          <button
            onClick={signOut}
            className="p-2 hover:bg-sage-700 rounded-lg transition-colors"
            title="Logga ut"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <nav className="bg-white border-b border-warm-100 shadow-sm">
        <div className="max-w-lg mx-auto flex">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
                location.pathname === path
                  ? 'text-sage-600 border-b-2 border-sage-600'
                  : 'text-gray-500 hover:text-sage-600'
              }`}
            >
              <Icon size={20} />
              <span className="mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <main className="max-w-lg mx-auto p-4">
        {children}
      </main>
    </div>
  )
}
