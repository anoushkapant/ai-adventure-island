import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { RobotBuddy } from '../components/RobotBuddy'
import { useGame } from '../context/GameContext'
import { playSound } from '../lib/sound'
import type { View } from '../types'

const PAGES: { emoji: string; title: string; text: string }[] = [
  {
    emoji: '🌅',
    title: 'The Island',
    text: 'One sunny day, on a rainbow island, robot friends were born. But they were not very smart yet. They needed a teacher... and that teacher was you!',
  },
  {
    emoji: '🤖',
    title: 'Robots Can Learn',
    text: 'Robots do not know things all by themselves. They learn from examples — like when you teach them that apples and bananas are fruits!',
  },
  {
    emoji: '📚',
    title: 'Train a Robot',
    text: 'Every time you sort something, you make the robot smarter. Each example is a tiny piece of magic called training data.',
  },
  {
    emoji: '🧪',
    title: 'Work It Out',
    text: 'When the robot sees a brand new thing, it uses patterns. "Hmm, small, red and sweet... that must be a fruit!" Patterns help robots guess.',
  },
  {
    emoji: '⚖️',
    title: 'The Rabbit Mix-Up',
    text: 'One robot only learned about cats and dogs. When it met a rabbit, it guessed wrong! Not enough examples made its answer unfair. That is called bias.',
  },
  {
    emoji: '🌈',
    title: 'You Are the Magic',
    text: 'When you give robots lots of different, fair examples, they become super helpers. And remember — mistakes are OK. That is how scientists learn too!',
  },
]

export function Storybook({ onHome }: { onHome: (v: View) => void }) {
  const { say, state } = useGame()
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
            <h2 className="font-display text-2xl font-extrabold text-island-ink">{current.title}</h2>
            <p className="max-w-md font-display text-lg font-bold text-island-ink/80">{current.text}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex w-full items-center justify-between gap-2">
          <Button variant="cream" size="md" icon="◀️" disabled={isFirst} onClick={() => go(page - 1)}>
            Back
          </Button>
          <div className="flex gap-1">
            {PAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Page ${i + 1}`}
                className={[
                  'h-4 w-4 rounded-full border-2 border-white',
                  i === page ? 'bg-island-purple' : 'bg-island-ink/20',
                ].join(' ')}
              />
            ))}
          </div>
          <Button variant="cream" size="md" icon="▶️" disabled={isLast} onClick={() => go(page + 1)}>
            Next
          </Button>
        </div>

        <Button
          variant="purple"
          size="md"
          icon="🔊"
          fullWidth
          onClick={() => say(`${current.title}. ${current.text}`)}
        >
          Read to me
        </Button>
      </Card>

      <div className="mt-4 text-center">
        <Button variant="cream" size="md" icon="↩️" onClick={() => onHome('map')}>
          Back
        </Button>
      </div>
    </div>
  )
}