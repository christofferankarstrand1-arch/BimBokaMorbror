import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Calendar, Clock, CheckSquare, Heart, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut, isParent } = useAuth()
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Hem' },
    { path: '/bookings', icon: Calendar, label: 'Bokningar' },
    { path: '/availability', icon: Clock, label: 'Tider' },
    { path: '/checklists', icon: CheckSquare, label: 'Packlistor' },
    { path: '/memories', icon: Heart, label: 'Minnen' },
  ]

  if (isParent) {
    navItems.push({ path: '/admin', icon: Settings, label: 'Morbror' })
  }

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col">
      <header className="bg-sage-600 text-white p-4 shadow-md">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Boka Morbror</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm opacity-90">{user?.name}</span>
            <button
              onClick={signOut}
              className="p-2 hover:bg-sage-700 rounded-full transition-colors"
              aria-label="Logga ut"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-20 max-w-lg mx-auto w-full">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-warm-200 shadow-lg">
        <div className="max-w-lg mx-auto flex justify-around">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center py-2 px-3 text-xs transition-colors ${
                  isActive ? 'text-sage-600' : 'text-gray-500 hover:text-sage-500'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-sage-600' : ''} />
                <span className="mt-1">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
