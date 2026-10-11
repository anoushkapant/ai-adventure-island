import { motion } from 'motion/react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { RobotBuddy } from '../components/RobotBuddy'
import { useGame } from '../context/GameContext'
import type { View } from '../types'

const GLOSSARY = [
  { emoji: '🤖', word: 'AI', meaning: 'AI is a computer that can learn and help us solve problems.' },
  { emoji: '📚', word: 'Training Data', meaning: 'The examples we give AI to learn from.' },
  { emoji: '🧪', word: 'Test Data', meaning: 'Brand new examples the AI has never seen, to check how smart it is.' },
  { emoji: '👀', word: 'Patterns', meaning: 'Things that look the same again and again, like "most fruits are sweet".' },
  { emoji: '⚖️', word: 'Bias', meaning: 'When AI makes unfair guesses because some examples were missing.' },
  { emoji: '🎯', word: 'Classification', meaning: 'Sorting things into groups, like "fruit" or "veggie".' },
  { emoji: '✅', word: 'Supervised Learning', meaning: 'Learning by checking AI answers and fixing its mistakes.' },
]

export function RobotLab({ onHome, onSettings }: { onHome: (v: View) => void; onSettings: () => void }) {
  const { say } = useGame()
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-2">
      <Card className="p-5">
        <div className="flex flex-col items-center gap-3">
          <RobotBuddy mood="happy" size={110} />
          <p className="text-center font-display text-lg font-bold text-island-ink">
            Hi, I'm <span className="text-island-purple">Bot-Bot</span>! I'm your robot friend on the
            island. 🎉
          </p>
          <Button
            variant="purple"
            size="md"
            icon="🔊"
            onClick={() =>
              say(
                "Hi! I'm Bott Bot! I love learning from examples. The more good examples you give me, the smarter I get!",
              )
            }
          >
            Hear me talk!
          </Button>
        </div>
      </Card>

      <h2 className="mt-5 mb-2 text-center font-display text-2xl font-extrabold text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.2)]">
        🧠 Words Every AI Explorer Knows
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
          See my rewards
        </Button>
        <Button variant="purple" icon="⚙️" onClick={onSettings}>
          Settings
        </Button>
        <Button variant="blue" icon="↩️" onClick={() => onHome('map')}>
          Island Map
        </Button>
      </div>
    </div>
  )
}