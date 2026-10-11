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
            {phase === 'discover' && 'Puro pusa at aso lang ang natutunan ko...'}
            {phase === 'explain' && "Hindi pa ako nakakita ng ganitong hayop kahit kailan! Kuneho po ang mga ito!"}
            {phase === 'fix' && 'Ipakita mo sa akin ang iba pang mga hayop para matuto ako!'}
            {phase === 'fixed' && "Ngayon alam ko na ang kuneho! Mas patas na ako."}
            {phase === 'result' && 'Ang balanseng data ay gumagawa ng patas na AI!'}
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
            Tingnan! May bagong hayop na dumarating 🐰
          </p>
          <ItemTile item={rabbit} size="lg" />
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-3xl bg-island-coral/20 px-4 py-2 text-center"
          >
            <span className="font-display text-lg font-bold text-island-ink">
              🤖 "Ito ay {labelOf(allCategories, biasGuess.label)}!"
            </span>
          </motion.div>
          <p className="text-center font-display font-bold text-island-coral">
            Ay naku! Mali iyan. 🐰 ay isang kuneho!
          </p>
          <Button variant="purple" size="lg" icon="🤔" onClick={() => setPhase('explain')}>
            Bakit nangyari iyan?
          </Button>
        </Card>
      )}

      {phase === 'explain' && (
        <Card className="flex flex-col items-center gap-4 p-6 text-center">
          <span className="text-6xl">⭐</span>
          <h3 className="font-display text-2xl font-extrabold text-island-ink">
            Hindi sapat ang examples na nakita ng AI!
          </h3>
          <p className="font-display text-lg font-bold text-island-ink/80">
            Natutunan lang ng AI ang tungkol sa <b>mga pusa</b> at <b>mga aso</b>. Kailanman, hindi pa ito nakakita ng kuneho, kaya ito
            nakagawa ng hindi patas na hula. Tinatawag itong <span className="text-island-purple">bias</span>.
          </p>
          <p className="font-display font-bold text-island-green">
            Balanced data = fair AI. Let's fix it together!
          </p>
          <Button variant="green" size="lg" icon="🧠" onClick={() => setPhase('fix')}>
            Turuan pa ng mga hayop!
          </Button>
        </Card>
      )}

      {phase === 'fix' && (
        <Card className="flex flex-col items-center gap-4 p-6">
          <p className="font-display text-xl font-bold text-island-ink">
            Turuan ang AI tungkol sa hayp na ito:
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
              🤖 "Ito ay isang Kuneho!" {rabbitNowCorrect ? '✅' : ''}
            </span>
          </motion.div>
          <p className="font-display text-lg font-bold text-island-green">
            Patas na ulit ang AI ngayong nakakita na ito ng mga kuneho!
          </p>
          <Button variant="blue" size="lg" icon="🏆" onClick={finish}>
            Tapos na!
          </Button>
        </Card>
      )}

      {phase === 'result' && (
        <Card className="flex flex-col items-center gap-3 p-6 text-center">
          <h3 className="font-display text-3xl font-extrabold text-island-ink">
            Ikaw ay isang Bias Buster!
          </h3>
          <div className="text-5xl">⭐⭐⭐</div>
          <p className="font-display font-bold text-island-ink/80">
            Tandaan: Patas lang ang AI sa data na ibinibigay natin dito.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="green" icon="🔁" onClick={() => onHome('challenges')}>
              Ulitin
            </Button>
            <Button variant="blue" icon="🏝️" onClick={() => onHome('map')}>
              Isla 🏝️
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-4 text-center">
        <Button variant="cream" size="md" icon="↩️" onClick={() => onHome('challenges')}>
          Bumalik
        </Button>
      </div>
    </div>
  )
}

function labelOf(cats: CategoryDef[], id: string) {
  return cats.find((c) => c.id === id)?.label ?? id
}
