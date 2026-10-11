import { motion } from 'motion/react'
import { useGame } from '../context/GameContext'

interface TopBarProps {
  title?: string
  onHome?: () => void
  onSettings?: () => void
  showHome?: boolean
}

export function TopBar({ title, onHome, onSettings, showHome = true }: TopBarProps) {
  const { state } = useGame()
  return (
    <header className="sticky top-0 z-40 flex items-center gap-2 border-b-4 border-white bg-white px-3 py-2 shadow-[0_4px_0_rgba(0,0,0,0.08)] sm:gap-3">
      {showHome && (
        <button
          onClick={onHome}
          aria-label="Back to the island map"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-4 border-white bg-island-blue text-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)]"
        >
          🏝️
        </button>
      )}

      {title ? (
        <h1 className="min-w-0 flex-1 truncate font-display text-xl font-extrabold text-island-ink sm:text-2xl">
          {title}
        </h1>
      ) : (
        <span className="flex min-w-0 flex-1 items-center gap-2 font-display text-xl font-extrabold text-island-ink">
          AI Adventure Island
          <span className="hidden text-2xl sm:inline">🤖</span>
        </span>
      )}

      <motion.div
        key={state.stars}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        className="flex shrink-0 items-center gap-1 rounded-full border-4 border-white bg-island-sun px-3 py-1 font-display text-lg font-extrabold text-island-ink shadow-[0_4px_0_rgba(0,0,0,0.18)]"
        title="AI Stars"
      >
        ⭐ {state.stars}
      </motion.div>
      <div
        className="hidden shrink-0 items-center gap-1 rounded-full border-4 border-white bg-island-purple px-3 py-1 font-display text-lg font-extrabold text-white shadow-[0_4px_0_rgba(0,0,0,0.18)] sm:flex"
        title="Robot Parts"
      >
        🤖 {state.robotParts}
      </div>

      <button
        onClick={onSettings}
        aria-label="Settings"
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-4 border-white bg-island-green text-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)]"
      >
        ⚙️
      </button>
    </header>
  )
}
