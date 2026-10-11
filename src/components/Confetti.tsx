import { motion } from 'motion/react'
import { useMemo } from 'react'

const COLORS = ['#2d6cdf', '#f7e03b', '#a220df', '#08ab4e', '#e5296b', '#f5b338']
const EMOJIS = ['⭐', '🎉', '🏅', '🌟', '✨', '💫']

interface ConfettiProps {
  count?: number
}

export function Confetti({ count = 40 }: ConfettiProps) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.8 + Math.random() * 1.6,
        rotate: Math.random() * 360,
        size: 14 + Math.random() * 16,
        color: COLORS[i % COLORS.length],
        emoji: Math.random() > 0.6 ? EMOJIS[i % EMOJIS.length] : null,
      })),
    [count],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '-12vh', x: 0, opacity: 0, rotate: 0 }}
          animate={{ y: '112vh', x: [0, 20, -20, 10], opacity: [0, 1, 1, 0], rotate: p.rotate + 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{ left: `${p.left}%`, position: 'absolute', fontSize: p.size }}
        >
          {p.emoji ?? (
            <div
              style={{
                width: p.size,
                height: p.size * 0.6,
                background: p.color,
                borderRadius: 4,
                transform: 'rotate(20deg)',
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}
