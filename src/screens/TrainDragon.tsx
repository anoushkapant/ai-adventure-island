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
import { langCats, langItems, dragonCategories, dragonItems } from '../data/items'
import { shuffle, starsFor } from '../lib/utils'
import { playSound } from '../lib/sound'
import type { View } from '../types'

type Phase = 'intro' | 'feed' | 'done'

const stageDefs: { key: string; emoji: string; max: number; scale: number; filter?: string }[] = [
  { key: 'dragon.stage.egg', emoji: '🥚', max: 20, scale: 0.7 },
  { key: 'dragon.stage.baby', emoji: '🐣', max: 45, scale: 0.85 },
  { key: 'dragon.stage.grow', emoji: '🐲', max: 70, scale: 1 },
  { key: 'dragon.stage.strong', emoji: '🔥', max: 90, scale: 1.15 },
  { key: 'dragon.stage.legend', emoji: '🐉', max: 101, scale: 1.3 },
]

function stageKeyFor(acc: number): string {
  for (const d of stageDefs) {
    if (acc <= d.max) return d.key
  }
  return 'dragon.stage.legend'
}

const TALK_KEYS = ['dragon.talk.ready', 'dragon.talk.first', 'dragon.talk.learning', 'dragon.talk.good', 'dragon.talk.legendary']

export function TrainDragon({ onHome }: { onHome: (v: View) => void }) {
  const { state, completeLevel, grantSticker, addDragonXp, celebrate, say, t } = useGame()
  const cats = useMemo(() => langCats(dragonCategories, state.settings.lang), [state.settings.lang])
  const items = useMemo(() => langItems(dragonItems, state.settings.lang), [state.settings.lang])
  const brain = useRef(new RobotBrain(dragonCategories))
  const order = useMemo(() => shuffle(items), [items])
  const [phase, setPhase] = useState<Phase>('intro')
  const [idx, setIdx] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [talkIdx, setTalkIdx] = useState(0)
  const [burp, setBurp] = useState<string | null>(null)

  const talk = t(TALK_KEYS[talkIdx])
  const stageKey = stageKeyFor(accuracy)
  const stageDef = stageDefs.find((d) => d.key === stageKey)!
  const stage = { ...stageDef, name: t(stageKey) }

  function feed(label: string) {
    const item = order[idx]
    brain.current.train(item, label)
    const acc = brain.current.stableAccuracyOn(items)
    setAccuracy(acc)
    addDragonXp(1)
    setBurp(item.emoji)
    playSound(item.category === label ? 'correct' : 'wrong', state.settings.sound)

    setTalkIdx(acc <= 20 ? 1 : acc <= 45 ? 2 : acc <= 70 ? 3 : 4)

    setTimeout(() => setBurp(null), 500)
    const next = idx + 1
    if (next >= order.length || acc >= 100) {
      setTimeout(() => setPhase('done'), 700)
      if (acc >= 91) celebrate('🐉', t('dragon.celebrateTitle'), t('dragon.celebrateSub'))
    } else {
      setIdx(next)
    }
  }

  function finish() {
    const stars = starsFor(accuracy)
    completeLevel('dragon', accuracy, stars)
    grantSticker('dragon_friend')
    if (accuracy >= 91) grantSticker('ai_expert')
    say(t('dragon.sayDone'))
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
            {t('dragon.introTitle')}
          </p>
          <p className="font-display font-bold text-island-ink/80">
            {t('dragon.introSub')}
          </p>
          <div className="flex gap-3">
            {cats.map((c) => (
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
            {t('dragon.feedPrompt')}
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
            {cats.map((cat) => (
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
              {t('backToIsland')}
            </Button>
          </Card>
        </>
      )}

      <div className="mt-4 text-center">
        <Button variant="cream" size="md" icon="↩️" onClick={() => onHome('training')}>
          {t('back')}
        </Button>
      </div>
    </div>
  )
}