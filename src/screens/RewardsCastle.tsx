import { motion } from 'motion/react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { useGame, STICKERS, DECORATIONS } from '../context/GameContext'
import type { View } from '../types'

export function RewardsCastle({ onHome }: { onHome: (v: View) => void }) {
  const { state } = useGame()
  const completed = Object.values(state.levels).filter((l) => l.completed).length
  const allLevels = 5

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-2">
      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col items-center gap-1 p-4 text-center">
          <span className="text-5xl">⭐</span>
          <motion.span
            key={state.stars}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            className="font-display text-3xl font-extrabold text-island-ink"
          >
            {state.stars}
          </motion.span>
          <span className="font-display font-bold text-island-ink/70">AI Stars</span>
        </Card>
        <Card className="flex flex-col items-center gap-1 p-4 text-center">
          <span className="text-5xl">🤖</span>
          <motion.span
            key={state.robotParts}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            className="font-display text-3xl font-extrabold text-island-ink"
          >
            {state.robotParts}
          </motion.span>
          <span className="font-display font-bold text-island-ink/70">Robot Parts</span>
        </Card>
      </div>

      <h2 className="mt-6 mb-2 text-center font-display text-2xl font-extrabold text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.2)]">
        🏅 Sticker Book
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STICKERS.map((s, i) => {
          const owned = state.stickers.includes(s.id)
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card
                className={
                  owned
                    ? 'flex h-full flex-col items-center gap-1 bg-island-sun/70 p-3 text-center'
                    : 'flex h-full flex-col items-center gap-1 bg-slate-100 p-3 text-center'
                }
              >
                <span className={owned ? 'text-5xl' : 'text-5xl opacity-40 grayscale'}>
                  {owned ? s.emoji : '🔒'}
                </span>
                <span className="font-display text-sm font-extrabold text-island-ink">{s.name}</span>
                <span className="h-10 text-xs font-bold text-island-ink/60">{s.hint}</span>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <h2 className="mt-6 mb-2 text-center font-display text-2xl font-extrabold text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.2)]">
        🌴 Island Decorations
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {DECORATIONS.map((d, i) => {
          const owned = state.decorations.includes(d.id)
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card
                className={
                  owned
                    ? 'flex h-full items-center justify-center bg-island-green/30 p-4'
                    : 'flex h-full items-center justify-center bg-slate-100 p-4'
                }
              >
                <div className="flex flex-col items-center gap-1">
                  <span className={owned ? 'text-5xl animate-float' : 'text-5xl opacity-40 grayscale'}>
                    {owned ? d.emoji : '🔒'}
                  </span>
                  <span className="font-display text-sm font-extrabold text-island-ink">{d.name}</span>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Card className="mt-6 p-4 text-center">
        <p className="font-display font-bold text-island-ink/80">
          🌟 Complete activities to earn stars, robot parts, stickers and decorations.
        </p>
        <p className="mt-1 font-display text-sm font-bold text-island-ink/60">
          Activities done: {completed} of {allLevels} · No mistakes are ever punished — experimenting
          is how you learn!
        </p>
        <div className="mt-4 flex justify-center">
          <Button variant="blue" icon="🏝️" onClick={() => onHome('map')}>
            Back to Island
          </Button>
        </div>
      </Card>
    </div>
  )
}