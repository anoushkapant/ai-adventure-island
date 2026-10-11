import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { Confetti } from './Confetti'
import { useGame } from '../context/GameContext'

export function CelebrationOverlay() {
  const { celebration, dismissCelebration } = useGame()

  useEffect(() => {
    if (!celebration) return
    const t = setTimeout(dismissCelebration, 3200)
    return () => clearTimeout(t)
  }, [celebration, dismissCelebration])

  return (
    <AnimatePresence>
      {celebration && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-island-ink/30 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissCelebration}
        >
          <Confetti count={50} />
          <motion.div
            initial={{ scale: 0.5, y: 40, rotate: -4 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 16 }}
            className="relative z-[71] w-full max-w-sm rounded-[32px] border-8 border-white bg-gradient-to-b from-island-sun to-island-orange p-6 text-center shadow-2xl"
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -8, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-7xl"
            >
              {celebration.emoji}
            </motion.div>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-island-ink drop-shadow">
              {celebration.title}
            </h2>
            {celebration.subtitle && (
              <p className="mt-1 font-display text-lg font-bold text-island-ink/80">{celebration.subtitle}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
