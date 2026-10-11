import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ItemTile } from '../components/ItemTile'
import { CategoryButton } from '../components/CategoryButton'
import { AccuracyMeter } from '../components/AccuracyMeter'
import { Confetti } from '../components/Confetti'
import { useGame } from '../context/GameContext'
import { RobotBrain } from '../lib/ai'
import { dragonCategories, dragonItems } from '../data/items'
import { shuffle, starsFor } from '../lib/utils'
import { playSound } from '../lib/sound'
import type { View } from '../types'

type Phase = 'intro' | 'feed' | 'done'

interface Stage {
  emoji: string
  name: string
  scale: number
  filter?: string
}

function stageFor(acc: number): Stage {
  if (acc <= 20) return { emoji: '🥚', name: 'Maliit na Itlog', scale: 0.7 }
  if (acc <= 45) return { emoji: '🐣', name: 'Baby Bakunawa', scale: 0.85 }
  if (acc <= 70) return { emoji: '🐲', name: 'Lumalaking Bakunawa', scale: 1 }
  if (acc <= 90) return { emoji: '🔥', name: 'Malakas na Bakunawa', scale: 1.15 }
  return { emoji: '🐉', name: 'Maalamat na Bakunawa', scale: 1.3 }
}

const DRAGON_TALK: Record<string, string> = {
  ready: 'Rawr! 🐲 Pakanin mo ako ng example cards para lalo akong lumakas!',
  first: 'Mmmm! Alab? Patak? Sibol? Kawayan? ...',
  learning: 'Lumalaki na ang utak ko! Sige, pakainin mo pa ako!',
  good: 'ROAR! Naiintindihan ko na ang apoy, tubig at halaman!',
  legendary: 'WOW! Ako ay isang maalamat na dragon na AI! Salamat!',
}

export function TrainDragon({ onHome }: { onHome: (v: View) => void }) {
  const { state, completeLevel, grantSticker, addDragonXp, celebrate, say } = useGame()
  const brain = useRef(new RobotBrain(dragonCategories))
  const order = useMemo(() => shuffle(dragonItems), [])
  const [phase, setPhase] = useState<Phase>('intro')
  const [idx, setIdx] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [talk, setTalk] = useState(DRAGON_TALK.ready)
  const [burp, setBurp] = useState<string | null>(null)

  const stage = stageFor(accuracy)

  function feed(label: string) {
    const item = order[idx]
    brain.current.train(item, label)
    const acc = brain.current.stableAccuracyOn(dragonItems)
    setAccuracy(acc)
    addDragonXp(1)
    setBurp(item.emoji)
    playSound(item.category === label ? 'correct' : 'wrong', state.settings.sound)

    if (acc <= 20) setTalk(DRAGON_TALK.first)
    else if (acc <= 45) setTalk(DRAGON_TALK.learning)
    else if (acc <= 70) setTalk(DRAGON_TALK.good)
    else setTalk(DRAGON_TALK.legendary)

    setTimeout(() => setBurp(null), 500)
    const next = idx + 1
    if (next >= order.length || acc >= 100) {
      setTimeout(() => setPhase('done'), 700)
      if (acc >= 91) celebrate('🐉', 'Maalamat na Bakunawa!', 'Naging matalinong AI legend ang iyong dragon')
    } else {
      setIdx(next)
    }
  }

  function finish() {
    const stars = starsFor(accuracy)
    completeLevel('dragon', accuracy, stars)
    grantSticker('dragon_friend')
    if (accuracy >= 91) grantSticker('ai_expert')
    say(`Natuto at lumakas ang iyong Bakunawa. Itinuro mo rito ang mahika ng AI!`)
    onHome('training')
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-2">
      <Card className="mb-3 overflow-hidden">
        <div className="relative grid place-items-center bg-gradient-to-b from-island-purple/30 to-island-sky p-6">
          <motion.div
            key={stage.name}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: stage.scale, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            className="text-8xl drop-shadow-lg"
            style={{ filter: stage.filter }}
          >
            {stage.emoji}
          </motion.div>
          <span className="absolute left-3 top-3 rounded-full border-4 border-white bg-white px-3 py-1 font-display text-sm font-extrabold text-island-ink">
            {stage.name}
          </span>
          {burp && (
            <motion.span
              key={burp + idx}
              initial={{ y: 0, opacity: 0, scale: 0.4 }}
              animate={{ y: -40, opacity: [0, 1, 0], scale: 1.4 }}
              transition={{ duration: 0.6 }}
              className="absolute right-8 top-4 text-4xl"
            >
              {burp}
            </motion.span>
          )}
        </div>
        <div className="px-4 pb-4">
          <AccuracyMeter accuracy={phase === 'done' ? accuracy : accuracy} />
          <p className="mt-2 text-center font-display text-lg font-bold text-island-ink">
            🐲 {talk}
          </p>
        </div>
      </Card>

      {phase === 'intro' && (
        <Card className="flex flex-col items-center gap-4 p-6 text-center">
          <p className="font-display text-xl font-bold text-island-ink">
            Isang baby Bakunawa ang nangangailangan ng TULONG mo para maging matalino!
          </p>
          <p className="font-display font-bold text-island-ink/80">
            Pakanin mo ito ng example cards at piliin ang tamang grupo:
          </p>
          <div className="flex gap-3">
            {dragonCategories.map((c) => (
              <span
                key={c.id}
                className="rounded-2xl border-4 border-white px-4 py-2 font-display font-bold"
                style={{ background: `var(--color-${c.color})` }}
              >
                {c.emoji} {c.label}
              </span>
            ))}
          </div>
          <Button variant="coral" size="xl" icon="🐲" onClick={() => setPhase('feed')}>
            Pakainin ang Bakunawa!
          </Button>
        </Card>
      )}

      {phase === 'feed' && (
        <Card className="flex flex-col items-center gap-4 p-6">
          <p className="font-display text-xl font-bold text-island-ink">
            Anong klaseng nilalang ito?
          </p>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={order[idx].id}
              initial={{ scale: 0.5, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <ItemTile item={order[idx]} size="lg" />
            </motion.div>
          </AnimatePresence>
          <div className="flex flex-wrap justify-center gap-3">
            {dragonCategories.map((cat) => (
              <CategoryButton key={cat.id} category={cat} onClick={() => feed(cat.id)} />
            ))}
          </div>
          <p className="text-sm font-bold text-island-ink/60">
            Example {Math.min(idx + 1, order.length)} of {order.length} · Lumalaki ang Bakunawa sa bawat
            kain!
          </p>
        </Card>
      )}

      {phase === 'done' && (
        <>
          <Confetti count={50} />
          <Card className="flex flex-col items-center gap-3 p-6 text-center">
            <motion.div
              animate={{ rotate: [0, -6, 6, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="text-8xl"
            >
              🐉
            </motion.div>
            <h3 className="font-display text-3xl font-extrabold text-island-ink">
              {stage.name}!
            </h3>
            <p className="font-display font-bold text-island-ink/80">
              Ang iyong Bakunawa ay umabot ng {accuracy}% katalinuhan gamit ang {order.length} example cards!
            </p>
            <div className="text-5xl">{'⭐'.repeat(starsFor(accuracy))}</div>
            <Button variant="green" size="lg" icon="🏡" onClick={finish}>
              Bumalik sa Isla
            </Button>
          </Card>
        </>
      )}

      <div className="mt-4 text-center">
        <Button variant="cream" size="md" icon="↩️" onClick={() => onHome('training')}>
          Bumalik
        </Button>
      </div>
    </div>
  )
}