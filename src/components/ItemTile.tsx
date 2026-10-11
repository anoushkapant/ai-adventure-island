import { motion } from 'motion/react'
import type { Item } from '../data/items'

interface ItemTileProps {
  item: Item
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  selected?: boolean
  disabled?: boolean
  badge?: string
}

const SIZES = {
  sm: 'w-20 h-24 text-4xl',
  md: 'w-28 h-32 text-6xl',
  lg: 'w-36 h-40 text-7xl',
}

export function ItemTile({ item, size = 'md', onClick, selected, disabled, badge }: ItemTileProps) {
  const Comp = onClick ? motion.button : motion.div
  return (
    <Comp
      onClick={disabled ? undefined : onClick}
      whileHover={onClick && !disabled ? { scale: 1.06, rotate: -2 } : undefined}
      whileTap={onClick && !disabled ? { scale: 0.93 } : undefined}
      animate={selected ? { scale: 1.05, rotate: 0 } : {}}
      className={[
        SIZES[size],
        'relative flex flex-col items-center justify-center gap-1 rounded-[24px] border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.12)]',
        selected ? 'bg-island-sun' : 'bg-white',
        disabled ? 'opacity-40' : '',
        onClick ? 'cursor-pointer' : '',
      ].join(' ')}
    >
      <span className="leading-none drop-shadow-sm">{item.emoji}</span>
      <span className="max-w-full truncate px-1 font-display text-sm font-bold text-island-ink">
        {item.name}
      </span>
      {badge && (
        <span className="absolute -right-2 -top-2 grid h-8 min-w-8 place-items-center rounded-full border-2 border-white bg-island-purple px-1 text-sm font-bold text-white">
          {badge}
        </span>
      )}
    </Comp>
  )
}
