import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useGame, type Settings } from '../context/GameContext'
import { Button } from './Button'
import { speak } from '../lib/sound'

const OPTIONS: { key: keyof Settings; emoji: string; label: string; hint: string }[] = [
  { key: 'voice', emoji: '🔊', label: 'Read out loud', hint: 'The robot reads words to you' },
  { key: 'sound', emoji: '🎵', label: 'Fun sounds', hint: 'Happy chimes and beeps' },
  { key: 'dyslexia', emoji: '🔤', label: 'Easy-read font', hint: 'Dyslexia-friendly letters' },
  { key: 'colorblind', emoji: '🎨', label: 'Colorblind mode', hint: 'Extra shapes and outlines' },
]

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, updateSettings, resetProgress } = useGame()
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center bg-island-ink/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-[32px] border-8 border-white bg-island-cream p-5 shadow-2xl"
          >
            <h2 className="mb-3 text-center font-display text-3xl font-extrabold text-island-ink">
              ⚙️ Settings
            </h2>

            <div className="flex flex-col gap-2">
              {OPTIONS.map((opt) => {
                const on = state.settings[opt.key]
                return (
                  <button
                    key={opt.key}
                    onClick={() => {
                      updateSettings({ [opt.key]: !on } as Partial<Settings>)
                      if (opt.key === 'voice') speak('Hello explorer!')
                    }}
                    className="flex items-center gap-3 rounded-3xl border-4 border-white bg-white/80 p-3 text-left shadow-sm"
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-bold text-island-ink">{opt.label}</span>
                      <span className="block text-sm text-island-ink/60">{opt.hint}</span>
                    </span>
                    <span
                      className={[
                        'relative h-9 w-16 shrink-0 rounded-full border-4 border-white transition-colors',
                        on ? 'bg-island-green' : 'bg-slate-300',
                      ].join(' ')}
                    >
                      <motion.span
                        layout
                        className="absolute top-0 h-6 w-6 rounded-full bg-white shadow"
                        style={{ left: on ? '2.1rem' : '0.05rem' }}
                      />
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {confirmReset ? (
                <div className="flex gap-2">
                  <Button
                    variant="coral"
                    size="md"
                    fullWidth
                    onClick={() => {
                      resetProgress()
                      setConfirmReset(false)
                    }}
                  >
                    ✅ Yes, start over
                  </Button>
                  <Button variant="cream" size="md" fullWidth onClick={() => setConfirmReset(false)}>
                    ↩️ Keep playing
                  </Button>
                </div>
              ) : (
                <Button variant="coral" size="md" fullWidth icon="🧹" onClick={() => setConfirmReset(true)}>
                  Reset my progress
                </Button>
              )}
              <Button variant="blue" size="lg" fullWidth icon="👌" onClick={onClose}>
                All done!
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
