import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  color?: string
}

export function Card({ children, className = '', color = 'bg-white' }: CardProps) {
  return (
    <div
      className={[
        'rounded-[28px] border-4 border-white shadow-[0_8px_0_rgba(0,0,0,0.18)]',
        'ring-4 ring-black/5',
        color,
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

export function Pill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full px-3 py-1 font-display font-extrabold',
        'border-2 border-white bg-white/90 text-island-ink shadow-sm',
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
