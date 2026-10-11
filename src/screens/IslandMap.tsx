import { motion } from 'motion/react'
import { useGame } from '../context/GameContext'
import type { View } from '../types'
import { RobotBuddy } from '../components/RobotBuddy'

interface Dest {
  view: View
  emoji: string
  titleKey: string
  subKey: string
  color: string
}

const DESTINATIONS: Dest[] = [
  { view: 'lab', emoji: '🤖', titleKey: 'dest.lab.title', subKey: 'dest.lab.sub', color: 'island-blue' },
  { view: 'training', emoji: '🧠', titleKey: 'dest.training.title', subKey: 'dest.training.sub', color: 'island-green' },
  { view: 'challenges', emoji: '🎯', titleKey: 'dest.challenges.title', subKey: 'dest.challenges.sub', color: 'island-coral' },
  { view: 'rewards', emoji: '🏆', titleKey: 'dest.rewards.title', subKey: 'dest.rewards.sub', color: 'island-sun' },
  { view: 'story', emoji: '📖', titleKey: 'dest.story.title', subKey: 'dest.story.sub', color: 'island-purple' },
]

export function IslandMap({ onNavigate }: { onNavigate: (v: View) => void }) {
  const { state, t } = useGame()

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-16 pt-5">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-[32px] border-4 border-white bg-island-blue px-4 py-5 text-center shadow-[0_8px_0_rgba(0,0,0,0.2)]"
        >
          <h1 className="font-display text-4xl font-extrabold text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.25)] sm:text-5xl">
            AI Adventure Island
          </h1>
          <p className="mt-1 font-display text-lg font-extrabold text-island-sun">
            {t('island.subtitle')}
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
          {DESTINATIONS.map((d, i) => {
            const dark = d.color === 'island-sun'
            return (
              <motion.button
                key={d.view}
                onClick={() => onNavigate(d.view)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.96 }}
                className={[
                  'flex items-center gap-4 rounded-[32px] border-4 border-white p-4 text-left shadow-[0_8px_0_rgba(0,0,0,0.2)] ring-4 ring-black/5',
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
                  <span
                    className={[
                      'block font-display text-2xl font-extrabold',
                      dark ? 'text-island-ink' : 'text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.2)]',
                    ].join(' ')}
                  >
                    {t(d.titleKey)}
                  </span>
                  <span
                    className={[
                      'block font-display font-extrabold',
                      dark ? 'text-island-ink/70' : 'text-white/85',
                    ].join(' ')}
                  >
                    {t(d.subKey)}
                  </span>
                </span>
              </motion.button>
            )
          })}
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
