import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ItemTile } from '../components/ItemTile'
import { CategoryButton } from '../components/CategoryButton'
import { RobotBuddy, type Mood } from '../components/RobotBuddy'
import { AccuracyMeter } from '../components/AccuracyMeter'
import { Confetti } from '../components/Confetti'
import { useGame } from '../context/GameContext'
import { RobotBrain } from '../lib/ai'
import { level1Categories, level1Items } from '../data/items'
import { shuffle, starsFor } from '../lib/utils'
import { playSound } from '../lib/sound'
import type { View } from '../types'

type Phase = 'train' | 'test' | 'result'

export function Level1TeachRobot({ onHome }: { onHome: (v: View) => void }) {
  const { state, completeLevel, grantSticker, say, celebrate } = useGame()
  const brain = useRef(new RobotBrain(level1Categories))
  const order = useMemo(() => shuffle(level1Items), [])
  const [phase, setPhase] = useState<Phase>('train')
  const [trainIdx, setTrainIdx] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [testIdx, setTestIdx] = useState(0)
  const [mood, setMood] = useState<Mood>('idle')
  const [message, setMessage] = useState("Hi! I don't know anything yet. Teach me!")
  const awarded = useRef(false)

  const testPredictions = useMemo(
    () => level1Items.map((item) => ({ item, pred: brain.current.predict(item) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase],
  )

  const correctCount = testPredictions.filter((p) => p.pred.label === p.item.category).length
  const finalAccuracy = Math.round((correctCount / level1Items.length) * 100)

  function labelItem(label: string) {
    const item = order[trainIdx]
    brain.current.train(item, label)
    const acc = brain.current.stableAccuracyOn(level1Items)
    setAccuracy(acc)
    playSound('click', state.settings.sound)

    const n = brain.current.total
    if (n === 1) grantSticker('first_train')
    if (n === 10) grantSticker('ten_examples')

    const next = trainIdx + 1
    if (next >= order.length) {
      setMood('thinking')
      setMessage('Ooh! I have lots of examples. Let me try on my own!')
      setPhase('test')
      setTestIdx(0)
    } else {
      setTrainIdx(next)
      const young = n < 4
      setMood(acc >= 91 ? 'excited' : young ? 'thinking' : 'happy')
      setMessage(
        acc === 0
          ? "Keep going, I'm still clueless!"
          : acc < 60
            ? 'I am starting to notice patterns!'
            : acc < 91
              ? 'I think I get it now!'
              : "I'm getting really good at this!",
      )
    }
  }

  useEffect(() => {
    if (phase !== 'test') return
    if (testIdx >= testPredictions.length) {
      setMood(finalAccuracy >= 91 ? 'excited' : finalAccuracy >= 70 ? 'happy' : 'thinking')
      setPhase('result')
      return
    }
    const { pred, item } = testPredictions[testIdx]
    setMood('thinking')
    setMessage(`Hmm... is "${item.name}" a ${labelOf(pred.label)}?`)
    const t = setTimeout(() => {
      const right = pred.label === item.category
      setMood(right ? 'happy' : 'confused')
      setMessage(
        right
          ? `Yes! ${item.name} is a ${labelOf(item.category)}! ✅`
          : `Oops! ${item.name} is really a ${labelOf(item.category)}. ❌`,
      )
      playSound(right ? 'correct' : 'wrong', state.settings.sound)
      setTestIdx((i) => i + 1)
    }, 1100)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, testIdx])

  useEffect(() => {
    if (phase !== 'result' || awarded.current) return
    awarded.current = true
    const stars = starsFor(finalAccuracy)
    completeLevel('level1', finalAccuracy, stars)
    grantSticker('l1_done')
    if (finalAccuracy >= 91) grantSticker('ai_expert')
    celebrate('🍓', 'Fruit Sorter!', `Your AI scored ${finalAccuracy}%`)
    say(`Great job! Your AI scored ${finalAccuracy} percent!`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-2">
      <Card className="p-4">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:gap-4">
          <RobotBuddy mood={mood} size={96} className="shrink-0" />
          <div className="w-full">
            <p className="mb-2 text-center font-display text-lg font-bold text-island-ink sm:text-left">
              {message}
            </p>
            <AccuracyMeter accuracy={phase === 'result' ? finalAccuracy : accuracy} />
          </div>
        </div>
      </Card>

      {phase === 'train' && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between font-display font-bold text-island-ink/80">
            <span>📚 Training examples: {brain.current.total}</span>
            <span>
              {trainIdx + 1} / {order.length}
            </span>
          </div>
          <Card className="flex flex-col items-center gap-4 p-6">
            <p className="font-display text-xl font-bold text-island-ink">
              Which group does this belong to?
            </p>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={order[trainIdx].id}
                initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              >
                <ItemTile item={order[trainIdx]} size="lg" />
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap justify-center gap-4">
              {level1Categories.map((cat) => (
                <CategoryButton
                  key={cat.id}
                  category={cat}
                  count={brain.current.countFor(cat.id)}
                  onClick={() => labelItem(cat.id)}
                />
              ))}
            </div>
          </Card>
        </div>
      )}

      {phase === 'test' && (
        <Card className="mt-4 p-6">
          <p className="mb-2 text-center font-display text-xl font-bold text-island-purple">
            🧪 Testing time! Let's see how smart the AI is.
          </p>
          <p className="text-center text-sm font-bold text-island-ink/60">
            Testing data is new to the AI — it must guess on its own!
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {testPredictions.map((p, i) => (
              <div key={p.item.id} className={i > testIdx ? 'opacity-30' : ''}>
                <ItemTile
                  item={p.item}
                  size="sm"
                  badge={
                    i < testIdx
                      ? p.pred.label === p.item.category
                        ? '✅'
                        : '❌'
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
          <AnimatePresence mode="popLayout">
            {testIdx < testPredictions.length && (
              <motion.div
                key={testIdx}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-4 text-center font-display text-2xl font-extrabold"
              >
                {testPredictions[testIdx].item.emoji} → {labelEmoji(testPredictions[testIdx].pred.label)}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}

      {phase === 'result' && (
        <>
          <Confetti count={finalAccuracy >= 70 ? 50 : 24} />
          <Card className="mt-4 flex flex-col items-center gap-3 p-6 text-center">
            <h3 className="font-display text-3xl font-extrabold text-island-ink">
              Your AI scored {finalAccuracy}%!
            </h3>
            <div className="text-5xl">{'⭐'.repeat(starsFor(finalAccuracy))}</div>
            <p className="font-display font-bold text-island-ink/80">
              {finalAccuracy >= 91
                ? '🏆 Wow! More examples make a smarter AI!'
                : finalAccuracy >= 70
                  ? '🚀 Great! Try again with different examples to get even smarter!'
                  : '🌱 Nice start! The AI needs more examples to learn better.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="green"
                icon="🔁"
                onClick={() => {
                  brain.current.reset()
                  awarded.current = false
                  setPhase('train')
                  setTrainIdx(0)
                  setTestIdx(0)
                  setAccuracy(0)
                  setMood('idle')
                  setMessage("Let's try again! Teach me with new examples.")
                }}
              >
                Play again
              </Button>
              <Button variant="blue" icon="🏝️" onClick={() => onHome('map')}>
                Island Map
              </Button>
            </div>
          </Card>
        </>
      )}

      <div className="mt-4 text-center">
        <Button variant="cream" size="md" icon="↩️" onClick={() => onHome('training')}>
          Back
        </Button>
      </div>
    </div>
  )
}

function labelOf(id: string) {
  return level1Categories.find((c) => c.id === id)?.label ?? id
}
function labelEmoji(id: string) {
  return level1Categories.find((c) => c.id === id)?.emoji ?? id
}
