import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { RobotBuddy } from '../components/RobotBuddy'
import { useGame } from '../context/GameContext'
import { playSound } from '../lib/sound'
import type { View } from '../types'

const PAGES: { emoji: string; titleKey: string; textKey: string }[] = [
  { emoji: '🏝️', titleKey: 'book.1.title', textKey: 'book.1.text' },
  { emoji: '🤖', titleKey: 'book.2.title', textKey: 'book.2.text' },
  { emoji: '🥭', titleKey: 'book.3.title', textKey: 'book.3.text' },
  { emoji: '🧪', titleKey: 'book.4.title', textKey: 'book.4.text' },
  { emoji: '⚖️', titleKey: 'book.5.title', textKey: 'book.5.text' },
  { emoji: '🌈', titleKey: 'book.6.title', textKey: 'book.6.text' },
]

export function Storybook({ onHome }: { onHome: (v: View) => void }) {
  const { say, state, t } = useGame()
  const [page, setPage] = useState(0)
  const current = PAGES[page]
  const isFirst = page === 0
  const isLast = page === PAGES.length - 1

  function go(to: number) {
    setPage(to)
    playSound('click', state.settings.sound)
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-2">
      <Card className="flex flex-col items-center gap-3 overflow-hidden p-6 text-center">
        <RobotBuddy mood="happy" size={80} />
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            className="flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ rotate: [0, -4, 4, 0], y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-7xl"
            >
              {current.emoji}
            </motion.div>
            <h2 className="font-display text-2xl font-extrabold text-island-ink">{t(current.titleKey)}</h2>
            <p className="max-w-md font-display text-lg font-bold text-island-ink/80">{t(current.textKey)}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex w-full items-center justify-between gap-2">
          <Button variant="cream" size="md" icon="◀️" disabled={isFirst} onClick={() => go(page - 1)}>
            {t('back')}
          </Button>
          <div className="flex gap-1">
            {PAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Pahina ${i + 1}`}
                className={[
                  'h-4 w-4 rounded-full border-2 border-white',
                  i === page ? 'bg-island-purple' : 'bg-island-ink/20',
                ].join(' ')}
              />
            ))}
          </div>
          <Button variant="cream" size="md" icon="▶️" disabled={isLast} onClick={() => go(page + 1)}>
            {t('book.next')}
          </Button>
        </div>

        <Button
          variant="purple"
          size="md"
          icon="🔊"
          fullWidth
          onClick={() => say(`${t(current.titleKey)}. ${t(current.textKey)}`)}
        >
          {t('book.read')}
        </Button>
      </Card>

      <div className="mt-4 text-center">
        <Button variant="cream" size="md" icon="↩️" onClick={() => onHome('map')}>
          {t('back')}
        </Button>
      </div>
    </div>
  )
}