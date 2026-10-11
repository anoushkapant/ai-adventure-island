import { motion } from 'motion/react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { RobotBuddy } from '../components/RobotBuddy'
import { useGame } from '../context/GameContext'
import type { View } from '../types'

const GLOSSARY = [
  { emoji: '🤖', word: 'AI', meaning: 'Ang AI ay isang computer na natututo at tumutulong sa atin.' },
  { emoji: '📚', word: 'Training Data', meaning: 'Ang mga halimbawang ibinibigay natin sa AI para matuto.' },
  { emoji: '🧪', word: 'Test Data', meaning: 'Bagong-bagong halimbawa na hindi pa nakikita ng AI, para malaman kung gaano ito katalino.' },
  { emoji: '👀', word: 'Patterns', meaning: 'Mga bagay na paulit-ulit na magkakatulad, tulad ng "karamihan sa prutas ay matamis".' },
  { emoji: '⚖️', word: 'Bias', meaning: 'Kapag hindi patas ang hula ng AI dahil may kulang na halimbawa.' },
  { emoji: '🎯', word: 'Classification', meaning: 'Pag-iisama ng mga bagay sa mga grupo, tulad ng "prutas" o "gulay".' },
  { emoji: '✅', word: 'Supervised Learning', meaning: 'Pag-aaral sa pamamagitan ng pagsuri sa mga sagot ng AI at pagtutuwid ng mga mali nito.' },
]

export function RobotLab({ onHome, onSettings }: { onHome: (v: View) => void; onSettings: () => void }) {
  const { say } = useGame()
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-2">
      <Card className="p-5">
        <div className="flex flex-col items-center gap-3">
          <RobotBuddy mood="happy" size={110} />
          <p className="text-center font-display text-lg font-bold text-island-ink">
            Hi! Ako si <span className="text-island-purple">Botoy</span>, ang robot mong kaibigan sa
            isla. 🎉
          </p>
          <Button
            variant="purple"
            size="md"
            icon="🔊"
            onClick={() =>
              say(
                "Hi! Ako si Botoy! Mahilig akong matuto mula sa examples. Kung mas maraming magandang halimbawa ang ibigay mo sa akin, mas magiging matalino ako!",
              )
            }
          >
            Pakinggan mo ako!
          </Button>
        </div>
      </Card>

      <h2 className="mt-5 mb-2 text-center font-display text-2xl font-extrabold text-island-ink drop-shadow-[0_2px_0_rgba(255,255,255,0.8)]">
        🧠 Mga Salita Alam ng Bawat AI Explorer
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {GLOSSARY.map((g, i) => (
          <motion.div
            key={g.word}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="h-full p-4">
              <p className="flex items-center gap-2 font-display text-xl font-extrabold text-island-ink">
                <span className="text-3xl">{g.emoji}</span> {g.word}
              </p>
              <p className="mt-1 font-display font-bold text-island-ink/70">{g.meaning}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button variant="green" icon="🏆" onClick={() => onHome('rewards')}>
          Tingnan ang aking rewards
        </Button>
        <Button variant="purple" icon="⚙️" onClick={onSettings}>
          Settings
        </Button>
        <Button variant="blue" icon="↩️" onClick={() => onHome('map')}>
          Isla 🏝️
        </Button>
      </div>
    </div>
  )
}