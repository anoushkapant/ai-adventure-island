import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { playSound, setSpeechEnabled, speak } from '../lib/sound'
import { DECORATIONS, STICKERS, decorationById, stickerById } from '../data/rewards'

export interface Settings {
  dyslexia: boolean
  colorblind: boolean
  voice: boolean
  sound: boolean
}

export interface LevelResult {
  completed: boolean
  bestAccuracy: number
  stars: number
}

export interface PetConfig {
  body: string
  color: string
  name: string
}

export interface GameState {
  stars: number
  robotParts: number
  stickers: string[]
  decorations: string[]
  levels: Record<string, LevelResult>
  pet: PetConfig | null
  dragonXp: number
  settings: Settings
}

const STORAGE_KEY = 'ai-adventure-island-v1'

const initialState: GameState = {
  stars: 0,
  robotParts: 0,
  stickers: [],
  decorations: [],
  levels: {},
  pet: null,
  dragonXp: 0,
  settings: { dyslexia: false, colorblind: false, voice: true, sound: true },
}

function loadState(): GameState {
  if (typeof localStorage === 'undefined') return initialState
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as Partial<GameState>
    return {
      ...initialState,
      ...parsed,
      settings: { ...initialState.settings, ...(parsed.settings ?? {}) },
      levels: parsed.levels ?? {},
      stickers: parsed.stickers ?? [],
      decorations: parsed.decorations ?? [],
    }
  } catch {
    return initialState
  }
}

interface Celebration {
  id: number
  emoji: string
  title: string
  subtitle?: string
}

interface GameContextValue {
  state: GameState
  celebration: Celebration | null
  celebrate: (emoji: string, title: string, subtitle?: string) => void
  dismissCelebration: () => void
  completeLevel: (id: string, accuracy: number, stars: number) => void
  addStars: (n: number) => void
  addRobotParts: (n: number) => void
  grantSticker: (id: string) => boolean
  grantDecoration: (id: string) => boolean
  setPet: (pet: PetConfig) => void
  addDragonXp: (n: number) => void
  updateSettings: (patch: Partial<Settings>) => void
  resetProgress: () => void
  say: (text: string) => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => loadState())
  const [celebration, setCelebration] = useState<Celebration | null>(null)
  const celebrationId = useRef(0)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore quota errors */
    }
  }, [state])

  useEffect(() => {
    setSpeechEnabled(state.settings.voice)
  }, [state.settings.voice])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('a11y-dyslexia', state.settings.dyslexia)
    root.classList.toggle('a11y-colorblind', state.settings.colorblind)
  }, [state.settings.dyslexia, state.settings.colorblind])

  const say = useCallback((text: string) => speak(text), [])

  const celebrate = useCallback((emoji: string, title: string, subtitle?: string) => {
    celebrationId.current += 1
    setCelebration({ id: celebrationId.current, emoji, title, subtitle })
    playSound('reward', true)
  }, [])

  const dismissCelebration = useCallback(() => setCelebration(null), [])

  const addStars = useCallback((n: number) => {
    setState((s) => ({ ...s, stars: s.stars + n }))
  }, [])

  const addRobotParts = useCallback((n: number) => {
    setState((s) => ({ ...s, robotParts: s.robotParts + n }))
  }, [])

  const grantSticker = useCallback((id: string) => {
    let granted = false
    setState((s) => {
      if (s.stickers.includes(id)) return s
      granted = true
      return { ...s, stickers: [...s.stickers, id] }
    })
    return granted
  }, [])

  const grantDecoration = useCallback((id: string) => {
    let granted = false
    setState((s) => {
      if (s.decorations.includes(id)) return s
      granted = true
      return { ...s, decorations: [...s.decorations, id] }
    })
    return granted
  }, [])

  const completeLevel = useCallback((id: string, accuracy: number, stars: number) => {
    setState((s) => {
      const prev = s.levels[id] ?? { completed: false, bestAccuracy: 0, stars: 0 }
      const best = Math.max(prev.bestAccuracy, accuracy)
      const starGain = Math.max(0, stars - prev.stars)
      let decorations = s.decorations
      if (!prev.completed) {
        const nextDeco = DECORATIONS.find((d) => !s.decorations.includes(d.id))
        if (nextDeco) decorations = [...s.decorations, nextDeco.id]
      }
      return {
        ...s,
        stars: s.stars + starGain,
        robotParts: s.robotParts + 1,
        decorations,
        levels: {
          ...s.levels,
          [id]: { completed: true, bestAccuracy: best, stars: Math.max(prev.stars, stars) },
        },
      }
    })
  }, [])

  const setPet = useCallback((pet: PetConfig) => {
    setState((s) => ({ ...s, pet }))
  }, [])

  const addDragonXp = useCallback((n: number) => {
    setState((s) => ({ ...s, dragonXp: s.dragonXp + n }))
  }, [])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }))
  }, [])

  const resetProgress = useCallback(() => {
    setState((s) => ({ ...initialState, settings: s.settings }))
  }, [])

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      celebration,
      celebrate,
      dismissCelebration,
      completeLevel,
      addStars,
      addRobotParts,
      grantSticker,
      grantDecoration,
      setPet,
      addDragonXp,
      updateSettings,
      resetProgress,
      say,
    }),
    [
      state,
      celebration,
      celebrate,
      dismissCelebration,
      completeLevel,
      addStars,
      addRobotParts,
      grantSticker,
      grantDecoration,
      setPet,
      addDragonXp,
      updateSettings,
      resetProgress,
      say,
    ],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>')
  return ctx
}

// eslint-disable-next-line react-refresh/only-export-components
export { DECORATIONS, STICKERS, decorationById, stickerById }
