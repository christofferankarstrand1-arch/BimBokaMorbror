import { useState, useEffect } from 'react'

interface GameItem {
  id: string
  word: string
  image: string
}

const GAME_ITEMS: GameItem[] = [
  { id: 'hund', word: 'Hund', image: 'hund' },
  { id: 'tomte', word: 'Tomte', image: 'tomte' },
  { id: 'morbror', word: 'Morbror', image: 'morbror' },
  { id: 'mamma', word: 'Mamma', image: 'mamma' },
  { id: 'pappa', word: 'Pappa', image: 'pappa' },
  { id: 'apa', word: 'Apa', image: 'apa' },
]

const IMAGES: Record<string, string> = {
  hund: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  tomte: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  morbror: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  mamma: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  pappa: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  apa: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
}

const COLORS: Record<string, string> = {
  hund: 'bg-amber-400',
  tomte: 'bg-red-500',
  morbror: 'bg-blue-500',
  mamma: 'bg-pink-500',
  pappa: 'bg-green-500',
  apa: 'bg-orange-500',
}

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
            className={`aspect-square rounded-2xl flex items-center justify-center text-white text-4xl font-bold transition-all ${
              COLORS[item.image]
            } ${
              matches.includes(item.id)
                ? 'opacity-30 scale-90'
                : selectedImage === item.id
                ? 'ring-4 ring-sage-600 scale-105'
                : 'hover:scale-105 shadow-lg'
            }`}
          >
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                <path d={IMAGES[item.image]} />
              </svg>
              <div className="text-sm mt-1 opacity-80">{item.word.charAt(0)}</div>
            </div>
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
