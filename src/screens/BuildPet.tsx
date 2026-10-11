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
import {
  level2Categories,
  level2Items,
  petAbilities,
  petBodies,
  petColors,
} from '../data/items'
import { shuffle, starsFor } from '../lib/utils'
import { playSound } from '../lib/sound'
import type { View } from '../types'

type Step = 'design' | 'train' | 'done'

export function BuildPet({ onHome }: { onHome: (v: View) => void }) {
  const { state, setPet, completeLevel, grantSticker, celebrate, say } = useGame()
  const [step, setStep] = useState<Step>('design')
  const [body, setBody] = useState(state.pet?.body ?? 'panda')
  const [color, setColor] = useState(state.pet?.color ?? 'blue')
  const [name, setName] = useState(state.pet?.name ?? '')
  const [trainIdx, setTrainIdx] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [unlocked, setUnlocked] = useState<string[]>([])

  const order = useMemo(() => shuffle([...level2Items, ...level2Items]), [])
  const brain = useRef(new RobotBrain(level2Categories))

  const bodyDef = petBodies.find((b) => b.id === body)!
  const colorHex = petColors.find((c) => c.id === color)!.hex

  function startTraining() {
    setPet({ body, color, name: name.trim() || bodyDef.label })
    setStep('train')
  }

  function labelItem(label: string) {
    brain.current.train(order[trainIdx], label)
    const acc = brain.current.stableAccuracyOn(level2Items)
    setAccuracy(acc)
    playSound('correct', state.settings.sound)

    for (const ab of petAbilities) {
      if (acc >= ab.requiredAccuracy && !unlocked.includes(ab.id)) {
        setUnlocked((u) => [...u, ab.id])
        celebrate(ab.emoji, `New power: ${ab.label}`, 'Your pet got smarter!')
      }
    }

    const next = trainIdx + 1
    if (next >= order.length || acc >= 100) {
      setStep('done')
    } else {
      setTrainIdx(next)
    }
  }

  function finish() {
    const stars = starsFor(accuracy)
    completeLevel('build', accuracy, stars)
    grantSticker('pet_maker')
    if (accuracy >= 91) grantSticker('ai_expert')
    say(`${name || bodyDef.label} is ready! It learned from your examples.`)
    onHome('map')
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-2">
      {step === 'design' && (
        <Card className="flex flex-col gap-4 p-5">
          <h2 className="text-center font-display text-2xl font-extrabold text-island-ink">
            🐾 Build Your AI Pet
          </h2>

          <div className="flex flex-col items-center">
            <motion.div
              key={body + color}
              initial={{ scale: 0.6, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              className="grid h-32 w-32 place-items-center rounded-[32px] border-4 border-white text-7xl shadow-lg"
              style={{ background: colorHex }}
            >
              {bodyDef.emoji}
            </motion.div>
          </div>

          <div>
            <p className="mb-2 font-display font-bold text-island-ink/80">1️⃣ Pick a body</p>
            <div className="flex flex-wrap gap-2">
              {petBodies.map((b) => (
                <motion.button
                  key={b.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setBody(b.id)}
                  className={[
                    'grid h-16 w-16 place-items-center rounded-2xl border-4 text-3xl',
                    body === b.id ? 'border-island-purple bg-island-purple/20' : 'border-white bg-white',
                  ].join(' ')}
                >
                  {b.emoji}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 font-display font-bold text-island-ink/80">2️⃣ Pick a color</p>
            <div className="flex flex-wrap gap-2">
              {petColors.map((c) => (
                <motion.button
                  key={c.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setColor(c.id)}
                  aria-label={c.label}
                  className={[
                    'h-14 w-14 rounded-full border-4',
                    color === c.id ? 'border-island-ink' : 'border-white',
                  ].join(' ')}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 font-display font-bold text-island-ink/80">3️⃣ Give it a name</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 14))}
              placeholder={bodyDef.label}
              className="w-full rounded-2xl border-4 border-white bg-white px-4 py-3 font-display text-xl font-bold text-island-ink shadow-inner outline-none placeholder:text-island-ink/30"
            />
          </div>

          <Button variant="green" size="xl" icon="🧠" fullWidth onClick={startTraining}>
            Start Training
          </Button>
        </Card>
      )}

      {step === 'train' && (
        <>
          <Card className="mb-3 p-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl border-4 border-white text-5xl"
                style={{ background: colorHex }}
              >
                {bodyDef.emoji}
              </motion.div>
              <div className="w-full">
                <p className="mb-1 font-display text-lg font-bold text-island-ink">
                  Training {name || bodyDef.label}... {brain.current.total} examples
                </p>
                <AccuracyMeter accuracy={accuracy} />
              </div>
            </div>
          </Card>

          <Card className="flex flex-col items-center gap-4 p-6">
            <p className="font-display text-xl font-bold text-island-ink">
              Teach your pet! What is this?
            </p>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={order[trainIdx].id + trainIdx}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <ItemTile item={order[trainIdx]} size="lg" />
              </motion.div>
            </AnimatePresence>
            <div className="flex flex-wrap justify-center gap-3">
              {level2Categories.map((cat) => (
                <CategoryButton key={cat.id} category={cat} onClick={() => labelItem(cat.id)} />
              ))}
            </div>
          </Card>

          {unlocked.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {petAbilities
                .filter((a) => unlocked.includes(a.id))
                .map((a) => (
                  <motion.span
                    key={a.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="rounded-full border-4 border-white bg-island-sun px-3 py-1 font-display font-bold shadow"
                  >
                    {a.emoji} {a.label}
                  </motion.span>
                ))}
            </div>
          )}
        </>
      )}

      {step === 'done' && (
        <>
          <Confetti count={50} />
          <Card className="flex flex-col items-center gap-3 p-6 text-center">
            <motion.div
              animate={{ rotate: [0, -6, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="grid h-28 w-28 place-items-center rounded-[32px] border-4 border-white text-7xl shadow-lg"
              style={{ background: colorHex }}
            >
              {bodyDef.emoji}
            </motion.div>
            <h3 className="font-display text-3xl font-extrabold text-island-ink">
              {name || bodyDef.label} is ready!
            </h3>
            <p className="font-display font-bold text-island-ink/80">
              Trained to {accuracy}% smartness
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {petAbilities.map((a) => (
                <span
                  key={a.id}
                  className={[
                    'rounded-full border-4 border-white px-3 py-1 font-display font-bold shadow',
                    unlocked.includes(a.id) ? 'bg-island-green text-white' : 'bg-slate-200 text-island-ink/50',
                  ].join(' ')}
                >
                  {a.emoji} {a.label}
                </span>
              ))}
            </div>
            <Button variant="blue" size="lg" icon="🏝️" onClick={finish}>
              Take {name || bodyDef.label} home!
            </Button>
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
