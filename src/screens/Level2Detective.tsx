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
import { langCats, langItems, level2Categories, level2Items } from '../data/items'
import { shuffle, starsFor, clamp } from '../lib/utils'
import { playSound } from '../lib/sound'
import type { View } from '../types'

const TOTAL_ROUNDS = 10

export function Level2Detective({ onHome }: { onHome: (v: View) => void }) {
  const { state, addStars, completeLevel, grantSticker, celebrate, say, t } = useGame()
  const cats = useMemo(() => langCats(level2Categories, state.settings.lang), [state.settings.lang])
  const items = useMemo(() => langItems(level2Items, state.settings.lang), [state.settings.lang])
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

  const labelOf = (id: string) => cats.find((c) => c.id === id)?.label ?? id
  const order = useMemo(() => shuffle(items).slice(0, TOTAL_ROUNDS), [items])
  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState<'guess' | 'reveal' | 'result'>('guess')
  const [mood, setMood] = useState<Mood>('idle')
  const [message, setMessage] = useState(t('l2.intro'))
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)
  const [score, setScore] = useState(0)
  const [accuracy, setAccuracy] = useState(() => brain.current.stableAccuracyOn(items))
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
      setAccuracy(brain.current.stableAccuracyOn(items))
    }
    setMood(agreed ? 'happy' : 'thinking')
    setFeedback({
      ok: agreed,
      text: agreed
        ? aiRight
          ? t('l2.fbRight')
          : t('l2.fbCatch')
        : t('l2.fbWrong', { pred: labelOf(pred.label), label: labelOf(item.category) }),
    })
    setPhase('reveal')
  }

  function next() {
    if (round + 1 >= TOTAL_ROUNDS) {
      const acc = brain.current.stableAccuracyOn(items)
      setAccuracy(acc)
      setPhase('result')
    } else {
      setRound((r) => r + 1)
      setFeedback(null)
      setMood('idle')
      setMessage(t('l2.next'))
      setPhase('guess')
    }
  }

  useEffect(() => {
    if (phase !== 'result' || awarded.current) return
    awarded.current = true
    const acc = brain.current.stableAccuracyOn(items)
    const stars = starsFor(acc)
    completeLevel('level2', acc, stars)
    addStars(score)
    grantSticker('detective')
    if (acc >= 91) grantSticker('ai_expert')
    celebrate('🕵️', t('l2.celebrateTitle'), t('l2.celebrateSub', { acc }))
    say(t('l2.say', { acc }))
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
            {t('l2.aiLook')}
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
                🤖 "{t('l2.guessLine', { label: labelOf(pred.label) })}"
              </span>
              <div className="mt-1 text-sm font-bold text-island-ink/60">
                {t('l2.confidence', { n: Math.round(pred.confidence * 100) })}
              </div>
            </motion.div>
          </AnimatePresence>

          {phase === 'guess' && (
            <p className="font-display text-lg font-bold text-island-ink">
              {t('l2.ask')}
            </p>
          )}

          {phase === 'guess' ? (
            <div className="flex gap-4">
              <Button variant="green" size="lg" icon="✅" onClick={() => judge(true)}>
                {t('l2.yes')}
              </Button>
              <Button variant="coral" size="lg" icon="❌" onClick={() => judge(false)}>
                {t('l2.no')}
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
                {round + 1 >= TOTAL_ROUNDS ? t('l2.seeResults') : t('l2.nextBtn')}
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
              {t('l2.resultTitle', { acc: accuracy })}
            </h3>
            <div className="text-5xl">{'⭐'.repeat(starsFor(accuracy))}</div>
            <p className="font-display font-bold text-island-ink/80">
              🔍 Itinuro mo ang AI sa pamamagitan ng pagsuri sa mga sagot niya. Tinatawag itong<br />
              <span className="text-island-purple">supervised learning</span>!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="green" icon="🔁" onClick={() => onHome('challenges')}>
                {t('l1.again')}
              </Button>
              <Button variant="blue" icon="🏝️" onClick={() => onHome('map')}>
                {t('islandBtn')}
              </Button>
            </div>
          </Card>
        </>
      )}

      <div className="mt-4 text-center">
        <Button variant="cream" size="md" icon="↩️" onClick={() => onHome('challenges')}>
          {t('back')}
        </Button>
      </div>
    </div>
  )
}


