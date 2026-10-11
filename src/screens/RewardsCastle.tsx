import { motion } from 'motion/react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { useGame, STICKERS, DECORATIONS } from '../context/GameContext'
import type { View } from '../types'

export function RewardsCastle({ onHome }: { onHome: (v: View) => void }) {
  const { state, t } = useGame()
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
          <span className="font-display font-bold text-island-ink/70">{t('rewards.stars')}</span>
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
          <span className="font-display font-bold text-island-ink/70">{t('rewards.parts')}</span>
        </Card>
      </div>

      <h2 className="mt-6 mb-2 text-center font-display text-2xl font-extrabold text-island-ink drop-shadow-[0_2px_0_rgba(255,255,255,0.8)]">
        {t('rewards.stickers')}
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
                <span className="font-display text-sm font-extrabold text-island-ink">
                  {t(`s.${s.id}.name`)}
                </span>
                <span className="h-10 text-xs font-bold text-island-ink/60">
                  {t(`s.${s.id}.hint`)}
                </span>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <h2 className="mt-6 mb-2 text-center font-display text-2xl font-extrabold text-island-ink drop-shadow-[0_2px_0_rgba(255,255,255,0.8)]">
        {t('rewards.decos')}
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
                  <span className="font-display text-sm font-extrabold text-island-ink">
                    {t(`d.${d.id}`)}
                  </span>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Card className="mt-6 p-4 text-center">
        <p className="font-display font-bold text-island-ink/80">
          {t('rewards.note')}
        </p>
        <p className="mt-1 font-display text-sm font-bold text-island-ink/60">
          {t('rewards.note2', { done: completed, total: allLevels })}
        </p>
        <div className="mt-4 flex justify-center">
          <Button variant="blue" icon="🏝️" onClick={() => onHome('map')}>
            {t('backToIsland')}
          </Button>
        </div>
      </Card>
    </div>
  )
}