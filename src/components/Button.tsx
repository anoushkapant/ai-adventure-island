import { motion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'
import { playSound } from '../lib/sound'
import { useGame } from '../context/GameContext'

type Variant = 'blue' | 'yellow' | 'purple' | 'green' | 'coral' | 'cream'

const VARIANTS: Record<Variant, string> = {
  blue: 'bg-island-blue text-white',
  yellow: 'bg-island-sun text-island-ink',
  purple: 'bg-island-purple text-white',
  green: 'bg-island-green text-white',
  coral: 'bg-island-coral text-white',
  cream: 'bg-white text-island-ink',
}

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  size?: 'md' | 'lg' | 'xl'
  icon?: ReactNode
  children?: ReactNode
  fullWidth?: boolean
  silent?: boolean
}

const SIZES = {
  md: 'text-lg px-7 py-3 gap-2',
  lg: 'text-xl px-9 py-4 gap-3',
  xl: 'text-2xl px-11 py-5 gap-3',
}

export function Button({
  variant = 'blue',
  size = 'lg',
  icon,
  children,
  fullWidth,
  silent,
  className = '',
  onClick,
  ...rest
}: ButtonProps) {
  const { state } = useGame()
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95, y: 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      onClick={(e) => {
        if (!silent) playSound('click', state.settings.sound)
        onClick?.(e)
      }}
      className={[
        'inline-flex items-center justify-center rounded-full font-display font-extrabold tracking-wide',
        'border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_rgba(0,0,0,0.2)]',
        'select-none touch-manipulation',
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {icon && <span className="text-[1.3em] leading-none">{icon}</span>}
      {children}
    </motion.button>
  )
}
