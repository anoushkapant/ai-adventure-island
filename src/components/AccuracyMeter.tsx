import { motion } from 'motion/react'
import { accuracyBand } from '../lib/ai'

interface AccuracyMeterProps {
  accuracy: number
}

export function AccuracyMeter({ accuracy }: AccuracyMeterProps) {
  const band = accuracyBand(accuracy)
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between font-display font-bold">
        <span className="text-island-ink/80">🤖 AI Power</span>
        <motion.span
          key={band.label}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-island-ink"
        >
          {band.emoji} {band.label}
        </motion.span>
      </div>
      <div className="h-8 w-full overflow-hidden rounded-full border-4 border-white bg-island-ink/10 shadow-inner">
        <motion.div
          className="flex h-full items-center justify-end rounded-full pr-2 text-sm font-bold text-white"
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(accuracy, 4)}%`, background: band.color }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        >
          {accuracy > 12 && <span className="drop-shadow">{accuracy}%</span>}
        </motion.div>
      </div>
    </div>
  )
}
