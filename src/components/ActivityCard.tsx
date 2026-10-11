import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface ActivityCardProps {
  emoji: string
  title: string
  description: string
  color: string
  onClick: () => void
  stars?: number
  bestAccuracy?: number
  index?: number
}

export function ActivityCard({
  emoji,
  title,
  description,
  color,
  onClick,
  stars = 0,
  bestAccuracy,
  index = 0,
}: ActivityCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="flex w-full items-center gap-4 rounded-[28px] border-4 border-white p-4 text-left shadow-[0_8px_0_rgba(0,0,0,0.15)]"
      style={{ background: `var(--color-${color})` }}
    >
      <span className="text-5xl drop-shadow">{emoji}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-2xl font-extrabold text-island-ink">{title}</span>
        <span className="block font-display font-bold text-island-ink/70">{description}</span>
        {typeof bestAccuracy === 'number' && bestAccuracy > 0 && (
          <span className="mt-1 inline-block rounded-full bg-white/70 px-2 py-0.5 text-sm font-bold text-island-ink">
            Best: {bestAccuracy}%
          </span>
        )}
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        {stars > 0 && <span className="text-2xl">{'⭐'.repeat(Math.min(stars, 3))}</span>}
        <span className="text-3xl">▶️</span>
      </span>
    </motion.button>
  )
}

export function ScreenShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-4">
      <h2 className="mb-4 text-center font-display text-3xl font-extrabold text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.2)]">
        {title}
      </h2>
      {children}
    </div>
  )
}
