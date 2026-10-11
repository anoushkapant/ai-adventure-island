import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ItemTile } from '../components/ItemTile'
import { RobotBuddy, type Mood } from '../components/RobotBuddy'
import { AccuracyMeter } from '../components/AccuracyMeter'
import { Confetti } from '../components/Confetti'
import { useGame } from '../context/GameContext'
import { RobotBrain } from '../lib/ai'
import { level2Categories, level2Items } from '../data/items'
import { shuffle, starsFor, clamp } from '../lib/utils'
import { playSound } from '../lib/sound'
import type { View } from '../types'

const TOTAL_ROUNDS = 10

export function Level2Detective({ onHome }: { onHome: (v: View) => void }) {
  const { state, addStars, completeLevel, grantSticker, celebrate, say } = useGame()
  const brain = useRef(
    (() => {
      const b = new RobotBrain(level2Categories)
      // A small, unbalanced starter set so the AI already makes mistakes.
      b.train(level2Items[0], 'animal')
      b.train(level2Items[1], 'animal')
      b.train(level2Items[2], 'animal')
      b.train(level2Items[4], 'vehicle')
      b.train(level2Items[5], 'vehicle')
      return b
    })(),
  )

  const order = useMemo(() => shuffle(level2Items).slice(0, TOTAL_ROUNDS), [])
  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState<'guess' | 'reveal' | 'result'>('guess')
  const [mood, setMood] = useState<Mood>('idle')
  const [message, setMessage] = useState('Watch closely! The AI will guess.')
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)
  const [score, setScore] = useState(0)
  const [accuracy, setAccuracy] = useState(() => brain.current.stableAccuracyOn(level2Items))
  const awarded = useRef(false)

  const item = order[Math.min(round, order.length - 1)]
  const pred = useMemo(
    () => brain.current.predict(item),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [round, phase === 'guess'],
  )
  const aiRight = pred.label === item.category

  function judge(saidCorrect: boolean) {
    const agreed = saidCorrect === aiRight
    if (agreed) {
      addStars(1)
      setScore((s) => s + 1)
      playSound('correct', state.settings.sound)
    } else {
      playSound('wrong', state.settings.sound)
    }
    if (!aiRight) {
      brain.current.train(item, item.category)
      setAccuracy(brain.current.stableAccuracyOn(level2Items))
    }
    setMood(agreed ? 'happy' : 'thinking')
    setFeedback({
      ok: agreed,
      text: agreed
        ? aiRight
          ? '✅ You are right — the AI guessed it!'
          : '❌ Good catch! The AI was wrong. You just gave it a new example to learn from!'
        : `🔄 The AI guessed ${labelOf(pred.label)}, but it is really a ${labelOf(item.category)}. Now the AI learns from it!`,
    })
    setPhase('reveal')
  }

  function next() {
    if (round + 1 >= TOTAL_ROUNDS) {
      const acc = brain.current.stableAccuracyOn(level2Items)
      setAccuracy(acc)
      setPhase('result')
    } else {
      setRound((r) => r + 1)
      setFeedback(null)
      setMood('idle')
      setMessage('Next one! Watch closely.')
      setPhase('guess')
    }
  }

  useEffect(() => {
    if (phase !== 'result' || awarded.current) return
    awarded.current = true
    const acc = brain.current.stableAccuracyOn(level2Items)
    const stars = starsFor(acc)
    completeLevel('level2', acc, stars)
    addStars(score)
    grantSticker('detective')
    if (acc >= 91) grantSticker('ai_expert')
    celebrate('🕵️', 'Robot Detective!', `The AI is now ${acc}% smart`)
    say(`You helped the AI learn! It is now ${acc} percent smart.`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const smartness = clamp(accuracy, 0, 100)

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-2">
      <Card className="p-4">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:gap-4">
          <RobotBuddy mood={mood} size={96} className="shrink-0" />
          <div className="w-full">
            <p className="mb-2 text-center font-display text-lg font-bold text-island-ink sm:text-left">
              {message}
            </p>
            <AccuracyMeter accuracy={smartness} />
          </div>
        </div>
      </Card>

      <div className="mt-3 flex items-center justify-between font-display font-bold text-island-ink/80">
        <span>
          🎯 Round {Math.min(round + 1, TOTAL_ROUNDS)} / {TOTAL_ROUNDS}
        </span>
        <span>⭐ Score {score}</span>
      </div>

      {phase !== 'result' && (
        <Card className="mt-2 flex flex-col items-center gap-4 p-6">
          <p className="font-display text-xl font-bold text-island-ink">
            The AI is looking at this...
          </p>
          <ItemTile item={item} size="lg" />

          <AnimatePresence mode="wait">
            <motion.div
              key={`${round}-${phase}`}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-3xl bg-island-purple/15 px-4 py-2 text-center"
            >
              <span className="font-display text-lg font-bold text-island-ink">
                🤖 "I think this is a{' '}
                <span className="text-island-purple">{labelOf(pred.label)}</span>!"
              </span>
              <div className="mt-1 text-sm font-bold text-island-ink/60">
                Confidence: {Math.round(pred.confidence * 100)}%
              </div>
            </motion.div>
          </AnimatePresence>

          {phase === 'guess' && (
            <p className="font-display text-lg font-bold text-island-ink">
              Is the AI right?
            </p>
          )}

          {phase === 'guess' ? (
            <div className="flex gap-4">
              <Button variant="green" size="lg" icon="✅" onClick={() => judge(true)}>
                Correct!
              </Button>
              <Button variant="coral" size="lg" icon="❌" onClick={() => judge(false)}>
                Not right
              </Button>
            </div>
          ) : (
            <div className="flex w-full flex-col items-center gap-3">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={[
                  'rounded-3xl border-4 border-white px-4 py-3 text-center font-display font-bold',
                  feedback?.ok ? 'bg-island-green text-white' : 'bg-island-sun text-island-ink',
                ].join(' ')}
              >
                {feedback?.text}
              </motion.div>
              <Button variant="blue" size="lg" icon="➡️" onClick={next}>
                {round + 1 >= TOTAL_ROUNDS ? 'See results' : 'Next'}
              </Button>
            </div>
          )}
        </Card>
      )}

      {phase === 'result' && (
        <>
          <Confetti count={46} />
          <Card className="mt-4 flex flex-col items-center gap-3 p-6 text-center">
            <h3 className="font-display text-3xl font-extrabold text-island-ink">
              AI is now {accuracy}% smart!
            </h3>
            <div className="text-5xl">{'⭐'.repeat(starsFor(accuracy))}</div>
            <p className="font-display font-bold text-island-ink/80">
              🔍 You taught the AI by checking its answers. That is called<br />
              <span className="text-island-purple">supervised learning</span>!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="green" icon="🔁" onClick={() => onHome('challenges')}>
                Choose again
              </Button>
              <Button variant="blue" icon="🏝️" onClick={() => onHome('map')}>
                Island Map
              </Button>
            </div>
          </Card>
        </>
      )}

      <div className="mt-4 text-center">
        <Button variant="cream" size="md" icon="↩️" onClick={() => onHome('challenges')}>
          Back
        </Button>
      </div>
    </div>
  )
}

function labelOf(id: string) {
  return level2Categories.find((c) => c.id === id)?.label ?? id
}
