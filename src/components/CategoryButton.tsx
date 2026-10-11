import { motion } from 'motion/react'
import type { CategoryDef } from '../data/items'

interface CategoryButtonProps {
  category: CategoryDef
  onClick?: () => void
  count?: number
  disabled?: boolean
}

export function CategoryButton({ category, onClick, count, disabled }: CategoryButtonProps) {
  const dark = category.color === 'island-sun' || category.color === 'island-sky'
  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      whileHover={!disabled ? { scale: 1.05, y: -3 } : undefined}
      whileTap={!disabled ? { scale: 0.93 } : undefined}
      className={[
        'relative flex flex-col items-center justify-center gap-1 rounded-[28px] border-4 border-white',
        'px-6 py-4 font-display font-extrabold shadow-[0_8px_0_rgba(0,0,0,0.2)] ring-4 ring-black/5',
        dark ? 'text-island-ink' : 'text-white',
        disabled ? 'opacity-50' : '',
      ].join(' ')}
      style={{ background: `var(--color-${category.color})` }}
    >
      <span className="text-4xl leading-none drop-shadow">{category.emoji}</span>
      <span className="text-xl drop-shadow-[0_2px_0_rgba(0,0,0,0.15)]">{category.label}</span>
      {typeof count === 'number' && (
        <span className="absolute -right-2 -top-2 grid h-8 min-w-8 place-items-center rounded-full border-2 border-white bg-white px-1 text-sm text-island-ink shadow">
          {count}
        </span>
      )}
    </motion.button>
  )
}
