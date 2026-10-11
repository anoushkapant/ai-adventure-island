import { motion } from 'motion/react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { RobotBuddy } from '../components/RobotBuddy'
import { useGame } from '../context/GameContext'
import type { View } from '../types'

const GLOSSARY = [
  { emoji: '🤖', word: 'AI', key: 'lab.g.1' },
  { emoji: '📚', word: 'Training Data', key: 'lab.g.2' },
  { emoji: '🧪', word: 'Test Data', key: 'lab.g.3' },
  { emoji: '👀', word: 'Patterns', key: 'lab.g.4' },
  { emoji: '⚖️', word: 'Bias', key: 'lab.g.5' },
  { emoji: '🎯', word: 'Classification', key: 'lab.g.6' },
  { emoji: '✅', word: 'Supervised Learning', key: 'lab.g.7' },
]

export function RobotLab({ onHome, onSettings }: { onHome: (v: View) => void; onSettings: () => void }) {
  const { say, t } = useGame()
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-2">
      <Card className="p-5">
        <div className="flex flex-col items-center gap-3">
          <RobotBuddy mood="happy" size={110} />
          <p className="text-center font-display text-lg font-bold text-island-ink">
            {t('lab.introA')}
            <span className="text-island-purple">Botoy</span>
            {t('lab.introB')}
          </p>
          <Button
            variant="purple"
            size="md"
            icon="🔊"
            onClick={() => say(t('lab.say'))}
          >
            {t('lab.hear')}
          </Button>
        </div>
      </Card>

      <h2 className="mt-5 mb-2 text-center font-display text-2xl font-extrabold text-island-ink drop-shadow-[0_2px_0_rgba(255,255,255,0.8)]">
        {t('lab.glossary')}
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {GLOSSARY.map((g, i) => (
          <motion.div
            key={g.word}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="h-full p-4">
              <p className="flex items-center gap-2 font-display text-xl font-extrabold text-island-ink">
                <span className="text-3xl">{g.emoji}</span> {g.word}
              </p>
              <p className="mt-1 font-display font-bold text-island-ink/70">{t(g.key)}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button variant="green" icon="🏆" onClick={() => onHome('rewards')}>
          Tingnan ang aking rewards
        </Button>
        <Button variant="purple" icon="⚙️" onClick={onSettings}>
          Settings
        </Button>
        <Button variant="blue" icon="↩️" onClick={() => onHome('map')}>
          Isla 🏝️
        </Button>
      </div>
    </div>
  )
}