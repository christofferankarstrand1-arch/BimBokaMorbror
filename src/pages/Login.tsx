import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export function Login() {
  const { signIn } = useAuth()
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !password.trim()) return
    
    setLoading(true)
    setError('')
    try {
      await signIn(selectedUser, password)
    } catch (err: any) {
      setError(err.message || 'Kunde inte logga in')
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectUser = (name: string) => {
    setSelectedUser(name)
    setError('')
    setPassword('')
  }

  const handleBack = () => {
    setSelectedUser(null)
    setError('')
    setPassword('')
  }

  const users = [
    { name: 'Sandra', subtitle: 'Mamma', image: '/images/mamma-avatar.png', ringColor: 'ring-rose-400' },
    { name: 'Lukas', subtitle: 'Pappa', image: '/images/pappa-avatar.png', ringColor: 'ring-blue-400' },
    { name: 'Bim', subtitle: 'Lansen', image: '/images/bim-avatar.png', ringColor: 'ring-amber-400' },
    { name: 'Christoffer', subtitle: 'Morbror', image: '/images/morbror-avatar.png', ringColor: 'ring-sage-400' },
  ]

  const selectedUserData = users.find(u => u.name === selectedUser)

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col">
      <div className="w-full bg-gradient-to-b from-sky-200 to-warm-50 pt-6 pb-12 flex justify-center">
        <img 
          src="/images/family.PNG" 
          alt="Familjen" 
          className="w-64 h-auto rounded-2xl shadow-lg"
        />
      </div>
      
      <div className="flex-1 flex flex-col items-center px-6 -mt-6">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 relative">
          {!selectedUser ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Boka Morbror!</h1>
                <p className="text-gray-500">Vem ar du?</p>
              </div>

              <div className="flex justify-center gap-3 mb-4">
                {users.map(({ name, subtitle, image, ringColor }) => (
                  <button
                    key={name}
                    onClick={() => handleSelectUser(name)}
                    className="flex flex-col items-center group"
                  >
                    <div className={`w-16 h-16 rounded-full ring-4 ${ringColor} overflow-hidden transition-transform group-hover:scale-110 bg-gray-100`}>
                      <img 
                        src={image} 
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="mt-1.5 text-xs font-medium text-gray-700">{name}</span>
                    <span className="text-[10px] text-gray-400">{subtitle}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="text-sage-600 hover:text-sage-700 mb-4 text-sm font-medium"
              >
                Tillbaka
              </button>
              
              <div className="flex flex-col items-center mb-6">
                {selectedUserData && (
                  <div className={`w-24 h-24 rounded-full ring-4 ${selectedUserData.ringColor} overflow-hidden bg-gray-100`}>
                    <img 
                      src={selectedUserData.image} 
                      alt={selectedUserData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h2 className="mt-3 text-2xl font-bold text-gray-800">Hej {selectedUser}!</h2>
                <p className="text-gray-500">Skriv in losenordet</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Losenord"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-warm-200 bg-warm-50 focus:ring-2 focus:ring-sage-500 focus:border-transparent text-center text-lg"
                />
                
                {error && (
                  <p className="text-center text-red-600 bg-red-50 py-2 px-4 rounded-lg text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !password.trim()}
                  className="w-full bg-sage-600 text-white py-3 rounded-xl font-semibold hover:bg-sage-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loggar in...' : 'Logga in'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-warm-500 text-sm">
          En julklapp fran Morbror Christoffer
        </p>
      </div>
    </div>
  )
}
