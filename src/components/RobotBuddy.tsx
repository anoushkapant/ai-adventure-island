import { AnimatePresence, motion } from 'motion/react'
import robotImg from '../assets/robot.png'

export type Mood = 'idle' | 'happy' | 'thinking' | 'confused' | 'excited' | 'sad'

const BADGE: Record<Mood, string> = {
  idle: '🙂',
  happy: '😄',
  thinking: '🤔',
  confused: '😵',
  excited: '🤩',
  sad: '😢',
}

const BADGE_BG: Record<Mood, string> = {
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
      <div className="relative" style={{ width: size, height: size }}>
        <motion.div
          className="h-full w-full"
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
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={mood}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className={[
                'absolute -right-2 -top-2 z-10 grid h-10 w-10 place-items-center rounded-full border-2 border-white text-xl shadow-[0_3px_0_rgba(0,0,0,0.15)]',
                BADGE_BG[mood],
              ].join(' ')}
            >
              {BADGE[mood]}
            </motion.span>
          </AnimatePresence>
          <img
            src={robotImg}
            alt="Robot Blip"
            draggable={false}
            className="h-full w-full select-none object-contain drop-shadow-[0_6px_3px_rgba(0,0,0,0.3)]"
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-xs rounded-3xl border-4 border-white bg-white/95 px-4 py-3 text-center font-display text-lg font-extrabold text-island-ink shadow-[0_6px_0_rgba(0,0,0,0.12)]"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}