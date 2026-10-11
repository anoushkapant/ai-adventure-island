import { motion } from 'motion/react'
import { useGame } from '../context/GameContext'
import type { View } from '../types'
import { RobotBuddy } from '../components/RobotBuddy'

interface Dest {
  view: View
  emoji: string
  title: string
  subtitle: string
  color: string
}

const DESTINATIONS: Dest[] = [
  { view: 'lab', emoji: '🤖', title: 'Robot Lab', subtitle: 'Meet your buddy', color: 'island-blue' },
  { view: 'training', emoji: '🧠', title: 'Training Center', subtitle: 'Teach & build AI', color: 'island-green' },
  { view: 'challenges', emoji: '🎯', title: 'AI Challenges', subtitle: 'Detective & Bias', color: 'island-coral' },
  { view: 'rewards', emoji: '🏆', title: 'Rewards Castle', subtitle: 'Stars & stickers', color: 'island-sun' },
  { view: 'story', emoji: '📖', title: 'AI Storybook', subtitle: 'Fun stories', color: 'island-purple' },
]

export function IslandMap({ onNavigate }: { onNavigate: (v: View) => void }) {
  const { state } = useGame()

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 select-none text-6xl opacity-70">
        <span className="absolute left-4 top-6 animate-float">🌴</span>
        <span className="absolute right-6 top-10 animate-float [animation-delay:0.6s]">☁️</span>
        <span className="absolute bottom-24 left-8 animate-float [animation-delay:1.2s]">🌺</span>
        <span className="absolute bottom-40 right-10 animate-float [animation-delay:0.3s]">🦜</span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-16 pt-6">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="font-display text-4xl font-extrabold text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.2)] sm:text-5xl">
            AI Adventure Island
          </h1>
          <p className="mt-1 font-display text-lg font-bold text-island-ink/80">
            🧠 Learn AI by teaching your own friendly robot friends!
          </p>
        </motion.div>

        <div className="my-6 flex flex-wrap items-center justify-center gap-4">
          <RobotBuddy mood={state.pet ? 'excited' : 'happy'} size={90} />
          {state.pet && (
            <div className="rounded-3xl border-4 border-white bg-white/85 px-4 py-3 text-center shadow">
              <div className="text-4xl">
                {state.pet.body === 'panda' && '🐼'}
                {state.pet.body === 'fox' && '🦊'}
                {state.pet.body === 'unicorn' && '🦄'}
                {state.pet.body === 'penguin' && '🐧'}
                {state.pet.body === 'frog' && '🐸'}
              </div>
              <div className="font-display font-bold">{state.pet.name}</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {DESTINATIONS.map((d, i) => (
            <motion.button
              key={d.view}
              onClick={() => onNavigate(d.view)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.96 }}
              className={[
                'flex items-center gap-4 rounded-[28px] border-4 border-white p-4 text-left shadow-[0_8px_0_rgba(0,0,0,0.15)]',
                i === 0 ? 'sm:col-span-2' : '',
              ].join(' ')}
              style={{ background: `var(--color-${d.color})` }}
            >
              <motion.span
                animate={{ rotate: [0, -6, 6, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                className="text-5xl drop-shadow"
              >
                {d.emoji}
              </motion.span>
              <span>
                <span className="block font-display text-2xl font-extrabold text-island-ink drop-shadow-sm">
                  {d.title}
                </span>
                <span className="block font-display font-bold text-island-ink/70">{d.subtitle}</span>
              </span>
            </motion.button>
          ))}
        </div>

        {state.decorations.length > 0 && (
          <div className="mt-8 rounded-3xl border-4 border-white bg-white/70 p-4 text-center">
            <p className="font-display font-bold text-island-ink/70">🏝️ Your island decorations</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 text-3xl">
              {state.decorations.map((id) => (
                <span key={id} className="animate-float">
                  {decorEmoji(id)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function decorEmoji(id: string) {
  const map: Record<string, string> = {
    palm: '🌴',
    flowers: '🌺',
    rainbow: '🌈',
    rocket: '🚀',
    castle: '🏰',
    balloon: '🎈',
    stars: '🌟',
    crystal: '💎',
  }
  return map[id] ?? '⭐'
}
