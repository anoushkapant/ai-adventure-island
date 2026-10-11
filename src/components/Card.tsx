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
        'rounded-[28px] border-4 border-white/70 shadow-[0_12px_30px_rgba(38,50,74,0.16)]',
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
        'inline-flex items-center gap-1 rounded-full px-3 py-1 font-display font-bold',
        'bg-white/80 text-island-ink shadow-sm',
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
