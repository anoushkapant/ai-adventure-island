import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ItemTile } from '../components/ItemTile'
import { CategoryButton } from '../components/CategoryButton'
import { RobotBuddy, type Mood } from '../components/RobotBuddy'
import { Confetti } from '../components/Confetti'
import { useGame } from '../context/GameContext'
import { RobotBrain } from '../lib/ai'
import {
  level3Items,
  level3NewCategories,
  level3TrainedCategories,
  type CategoryDef,
} from '../data/items'
import { playSound } from '../lib/sound'
import type { View } from '../types'

type Phase = 'discover' | 'explain' | 'fix' | 'fixed' | 'result'

const allCategories: CategoryDef[] = [...level3TrainedCategories, ...level3NewCategories]

export function Level3Bias({ onHome }: { onHome: (v: View) => void }) {
  const { completeLevel, grantSticker, celebrate, say, state } = useGame()
  const brain = useRef(
    (() => {
      const b = new RobotBrain(allCategories)
      const cat = level3Items.find((i) => i.category === 'cat')!
      const dog = level3Items.find((i) => i.category === 'dog')!
      b.train(cat, 'cat')
      b.train(cat, 'cat')
      b.train(cat, 'cat')
      b.train(dog, 'dog')
      b.train(dog, 'dog')
      b.train(dog, 'dog')
      return b
    })(),
  )

  const rabbit = level3Items.find((i) => i.category === 'rabbit')!
  const hamster = level3Items.find((i) => i.category === 'rabbit')!
  const fixQueue = [rabbit, hamster]

  const [phase, setPhase] = useState<Phase>('discover')
  const [fixIdx, setFixIdx] = useState(0)
  const [mood, setMood] = useState<Mood>('idle')
  const [version, setVersion] = useState(0)

  const biasGuess = useMemo(
    () => brain.current.predict(rabbit, () => 0.5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version],
  )

  const counts = allCategories.map((c) => ({ cat: c, n: brain.current.countFor(c.id) }))
  const maxCount = Math.max(1, ...counts.map((c) => c.n))

  function teach(label: string) {
    brain.current.train(fixQueue[fixIdx], label)
    setVersion((v) => v + 1)
    playSound('click', state.settings.sound)
    if (label === 'rabbit') {
      setMood('happy')
    } else {
      setMood('thinking')
    }
    if (fixIdx + 1 >= fixQueue.length) {
      setPhase('fixed')
      grantSticker('bias_buster')
      celebrate('⚖️', 'Bias Buster!', 'You made the data fair again')
      say('You found the problem! When the AI sees more kinds of animals, it becomes fair.')
      completeLevel('level3', 100, 3)
    } else {
      setFixIdx((i) => i + 1)
    }
  }

  function finish() {
    setPhase('result')
  }

  const rabbitNowCorrect = biasGuess.label === 'rabbit'

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-2">
      <Card className="mb-3 p-4">
        <div className="flex items-center gap-4">
          <RobotBuddy mood={mood} size={90} className="shrink-0" />
          <p className="font-display text-lg font-bold text-island-ink">
            {phase === 'discover' && 'I only ever learned about cats and dogs...'}
            {phase === 'explain' && "I've never seen an animal like this before!"}
            {phase === 'fix' && 'Show me more animals so I can learn!'}
            {phase === 'fixed' && "Now I know what a rabbit is! I'm fairer now."}
            {phase === 'result' && 'Balanced data makes fair AI!'}
          </p>
        </div>
      </Card>

      {/* Training data balance chart */}
      <Card className="mb-3 p-4">
        <p className="mb-2 font-display font-bold text-island-ink/80">📊 AI Training Data</p>
        <div className="flex flex-col gap-2">
          {counts.map(({ cat, n }) => (
            <div key={cat.id} className="flex items-center gap-2">
              <span className="w-20 shrink-0 font-display font-bold">
                {cat.emoji} {cat.label}
              </span>
              <div className="h-6 flex-1 overflow-hidden rounded-full border-2 border-white bg-island-ink/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `var(--color-${cat.color})` }}
                  animate={{ width: `${(n / maxCount) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                />
              </div>
              <span className="w-6 text-right font-bold">{n}</span>
            </div>
          ))}
        </div>
      </Card>

      {phase === 'discover' && (
        <Card className="flex flex-col items-center gap-4 p-6">
          <p className="font-display text-xl font-bold text-island-ink">
            Look! Here comes a new animal 🐰
          </p>
          <ItemTile item={rabbit} size="lg" />
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-3xl bg-island-coral/20 px-4 py-2 text-center"
          >
            <span className="font-display text-lg font-bold text-island-ink">
              🤖 "This is a {labelOf(allCategories, biasGuess.label)}!"
            </span>
          </motion.div>
          <p className="text-center font-display font-bold text-island-coral">
            Uh oh! That is wrong. 🐰 is a rabbit!
          </p>
          <Button variant="purple" size="lg" icon="🤔" onClick={() => setPhase('explain')}>
            Why did that happen?
          </Button>
        </Card>
      )}

      {phase === 'explain' && (
        <Card className="flex flex-col items-center gap-4 p-6 text-center">
          <span className="text-6xl">⭐</span>
          <h3 className="font-display text-2xl font-extrabold text-island-ink">
            The AI didn't see enough examples!
          </h3>
          <p className="font-display text-lg font-bold text-island-ink/80">
            The AI only learned about <b>cats</b> and <b>dogs</b>. It had never seen a rabbit, so it
            made an unfair guess. This is called <span className="text-island-purple">bias</span>.
          </p>
          <p className="font-display font-bold text-island-green">
            Balanced data = fair AI. Let's fix it together!
          </p>
          <Button variant="green" size="lg" icon="🧠" onClick={() => setPhase('fix')}>
            Teach more animals!
          </Button>
        </Card>
      )}

      {phase === 'fix' && (
        <Card className="flex flex-col items-center gap-4 p-6">
          <p className="font-display text-xl font-bold text-island-ink">
            Teach the AI about this animal:
          </p>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={fixQueue[fixIdx].id}
              initial={{ scale: 0.5, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <ItemTile item={fixQueue[fixIdx]} size="lg" />
            </motion.div>
          </AnimatePresence>
          <div className="flex flex-wrap justify-center gap-3">
            {allCategories.map((cat) => (
              <CategoryButton key={cat.id} category={cat} onClick={() => teach(cat.id)} />
            ))}
          </div>
        </Card>
      )}

      {phase === 'fixed' && (
        <Card className="flex flex-col items-center gap-4 p-6 text-center">
          <Confetti count={40} />
          <ItemTile item={rabbit} size="lg" />
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-3xl bg-island-green/20 px-4 py-2"
          >
            <span className="font-display text-lg font-bold text-island-ink">
              🤖 "This is a Rabbit!" {rabbitNowCorrect ? '✅' : ''}
            </span>
          </motion.div>
          <p className="font-display text-lg font-bold text-island-green">
            The AI is fair again now that it has seen rabbits!
          </p>
          <Button variant="blue" size="lg" icon="🏆" onClick={finish}>
            Finish
          </Button>
        </Card>
      )}

      {phase === 'result' && (
        <Card className="flex flex-col items-center gap-3 p-6 text-center">
          <h3 className="font-display text-3xl font-extrabold text-island-ink">
            You are a Bias Buster!
          </h3>
          <div className="text-5xl">⭐⭐⭐</div>
          <p className="font-display font-bold text-island-ink/80">
            Remember: AI is only as fair as the data we give it.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="green" icon="🔁" onClick={() => onHome('challenges')}>
              Play again
            </Button>
            <Button variant="blue" icon="🏝️" onClick={() => onHome('map')}>
              Island Map
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-4 text-center">
        <Button variant="cream" size="md" icon="↩️" onClick={() => onHome('challenges')}>
          Back
        </Button>
      </div>
    </div>
  )
}

function labelOf(cats: CategoryDef[], id: string) {
  return cats.find((c) => c.id === id)?.label ?? id
}
