import { AnimatePresence, motion } from 'motion/react'

export type Mood = 'idle' | 'happy' | 'thinking' | 'confused' | 'excited' | 'sad'

const FACE: Record<Mood, string> = {
  idle: '🙂',
  happy: '😄',
  thinking: '🤔',
  confused: '😵',
  excited: '🤩',
  sad: '😢',
}

const ANTENNA: Record<Mood, string> = {
  idle: '📡',
  happy: '✨',
  thinking: '💭',
  confused: '❓',
  excited: '🎉',
  sad: '💧',
}

const BODY: Record<Mood, string> = {
  idle: 'bg-island-blue',
  happy: 'bg-island-green',
  thinking: 'bg-island-purple',
  confused: 'bg-island-coral',
  excited: 'bg-island-sun',
  sad: 'bg-slate-400',
}

interface RobotBuddyProps {
  mood?: Mood
  size?: number
  message?: string
  className?: string
}

export function RobotBuddy({ mood = 'idle', size = 120, message, className = '' }: RobotBuddyProps) {
  const shake = mood === 'confused' || mood === 'sad'
  return (
    <div className={['flex flex-col items-center gap-3', className].join(' ')}>
      <motion.div
        className="relative"
        animate={
          shake
            ? { rotate: [0, -6, 6, -6, 6, 0] }
            : { y: [0, -8, 0] }
        }
        transition={
          shake
            ? { duration: 0.6, repeat: Infinity, repeatDelay: 0.8 }
            : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{ width: size, height: size }}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={mood}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 text-3xl"
          >
            {ANTENNA[mood]}
          </motion.span>
        </AnimatePresence>

        <div
          className={[
            'mt-4 flex h-[82%] w-full flex-col items-center justify-center rounded-[30%] border-4 border-white/80 shadow-[0_8px_0_rgba(0,0,0,0.15)] transition-colors',
            BODY[mood],
          ].join(' ')}
        >
          <div className="flex gap-3">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/90 text-lg">
              {mood === 'sad' ? '×' : '●'}
            </span>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/90 text-lg">
              {mood === 'sad' ? '×' : '●'}
            </span>
          </div>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={mood}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="mt-1 text-2xl"
            >
              {FACE[mood]}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-xs rounded-3xl border-4 border-white bg-white/95 px-4 py-3 text-center font-display text-lg font-bold text-island-ink shadow-lg"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
