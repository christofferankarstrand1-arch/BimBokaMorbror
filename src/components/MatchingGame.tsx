import { useState, useEffect } from 'react'

interface GameItem {
  id: string
  word: string
  image: string
  ringColor: string
}

const GAME_ITEMS: GameItem[] = [
  { id: 'mamma', word: 'Mamma', image: '/images/mammasandra.jpg', ringColor: 'ring-pink-400' },
  { id: 'pappa', word: 'Pappa', image: '/images/pappalukas.jpg', ringColor: 'ring-blue-400' },
  { id: 'morbror', word: 'Morbror', image: '/images/Christoffer-morbror.JPG', ringColor: 'ring-green-400' },
  { id: 'hund', word: 'Hund', image: '/images/hund.jpeg', ringColor: 'ring-amber-400' },
  { id: 'apa', word: 'Apa', image: '/images/apa.jpeg', ringColor: 'ring-orange-400' },
]

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function MatchingGame() {
  const [items, setItems] = useState<GameItem[]>([])
  const [shuffledWords, setShuffledWords] = useState<GameItem[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [matches, setMatches] = useState<string[]>([])
  const [wrongMatch, setWrongMatch] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    startNewGame()
  }, [])

  const startNewGame = () => {
    const gameItems = shuffle(GAME_ITEMS).slice(0, 4)
    setItems(gameItems)
    setShuffledWords(shuffle([...gameItems]))
    setMatches([])
    setSelectedImage(null)
    setShowCelebration(false)
  }

  const handleImageClick = (id: string) => {
    if (matches.includes(id)) return
    setSelectedImage(id)
    setWrongMatch(null)
  }

  const handleWordClick = (id: string) => {
    if (!selectedImage || matches.includes(id)) return

    if (selectedImage === id) {
      const newMatches = [...matches, id]
      setMatches(newMatches)
      setSelectedImage(null)
      
      if (newMatches.length === items.length) {
        setShowCelebration(true)
      }
    } else {
      setWrongMatch(id)
      setTimeout(() => {
        setWrongMatch(null)
        setSelectedImage(null)
      }, 500)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-sage-700">Para ihop!</h3>
        <p className="text-warm-600">Tryck pa en bild, sen pa ratt ord</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => handleImageClick(item.id)}
            disabled={matches.includes(item.id)}
            className={`aspect-square rounded-2xl overflow-hidden transition-all ${
              matches.includes(item.id)
                ? 'opacity-30 scale-90'
                : selectedImage === item.id
                ? `ring-4 ${item.ringColor} scale-105`
                : 'hover:scale-105 shadow-lg ring-2 ring-warm-200'
            }`}
          >
            <img 
              src={item.image} 
              alt={item.word}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {shuffledWords.map(item => (
          <button
            key={item.id}
            onClick={() => handleWordClick(item.id)}
            disabled={matches.includes(item.id)}
            className={`py-4 px-6 rounded-xl text-xl font-bold transition-all ${
              matches.includes(item.id)
                ? 'bg-green-100 text-green-600 opacity-50'
                : wrongMatch === item.id
                ? 'bg-red-500 text-white animate-shake'
                : 'bg-white border-2 border-warm-200 text-gray-700 hover:border-sage-400 shadow-sm'
            }`}
          >
            {item.word}
          </button>
        ))}
      </div>

      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full">
            <div className="text-6xl mb-4">Bra jobbat!</div>
            <h3 className="text-2xl font-bold text-sage-700 mb-4">Du klarade det!</h3>
            <button
              onClick={startNewGame}
              className="w-full py-4 bg-sage-600 text-white rounded-2xl font-bold text-lg hover:bg-sage-700"
            >
              Spela igen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
