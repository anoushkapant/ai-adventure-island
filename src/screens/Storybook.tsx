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
    emoji: '🏝️',
    title: 'Ang Isla',
    text: 'Isang maaraw na araw sa isang makulay na isla sa Pilipinas, ipinanganak ang mga robot amigos. Pero hindi pa sila masyadong matalino. Kailangan nila ng guro... at ang guro na iyon ay ikaw!',
  },
  {
    emoji: '🤖',
    title: 'Natututo ang mga Robot',
    text: 'Hindi basta-basta alam ng mga robot ang lahat. Natututo sila sa mga halimbawa — tulad ng pagtuturo mo na ang manga at saging ay prutas!',
  },
  {
    emoji: '🥭',
    title: 'Sanayin ang Robot',
    text: 'Tuwing mag-uuri ka ng isang bagay, tumatalino ang robot. Ang bawat halimbawa ay isang kislap ng mahika na tinatawag na training data.',
  },
  {
    emoji: '🧪',
    title: 'Mag-Isip ka Nang Mabuti',
    text: 'Kapag nakakita ang robot ng bagong nilalang, ginagamit nito ang mga pattern. "Hmm, maliit, pula at matamis... dapat prutas iyan!" Tumutulong ang patterns sa paaga ng robot.',
  },
  {
    emoji: '⚖️',
    title: 'Ang Hindi Patas na Hula',
    text: 'Isang robot, puro pusa at aso lang ang natutunan. Nang makakita ito ng kuneho, mali ang hula nito! Dahil kulang ang halimbawa, naging hindi patas ang sagot. Ganoon ang tinatawag na bias.',
  },
  {
    emoji: '🌈',
    title: 'Ikaw ang Mahika',
    text: 'Kapag nagbigay ka sa mga robot ng maraming iba-iba at patas na halimbawa, sila ay nagiging super katulong. At tandaan — okay lang ang magkamali. Ganoon din natututo ang mga siyentista!',
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
            Bumalik
          </Button>
          <div className="flex gap-1">
            {PAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Pahina ${i + 1}`}
                className={[
                  'h-4 w-4 rounded-full border-2 border-white',
                  i === page ? 'bg-island-purple' : 'bg-island-ink/20',
                ].join(' ')}
              />
            ))}
          </div>
          <Button variant="cream" size="md" icon="▶️" disabled={isLast} onClick={() => go(page + 1)}>
            Sunod
          </Button>
        </div>

        <Button
          variant="purple"
          size="md"
          icon="🔊"
          fullWidth
          onClick={() => say(`${current.title}. ${current.text}`)}
        >
          Basahin mo sa akin
        </Button>
      </Card>

      <div className="mt-4 text-center">
        <Button variant="cream" size="md" icon="↩️" onClick={() => onHome('map')}>
          Bumalik
        </Button>
      </div>
    </div>
  )
}