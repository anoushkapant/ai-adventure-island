import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useGame, type Settings } from '../context/GameContext'
import { Button } from './Button'
import { speak } from '../lib/sound'
import type { Lang } from '../i18n'

const OPTIONS: { key: keyof Settings; emoji: string; labelKey: string; hintKey: string; testKey?: string }[] = [
  { key: 'voice', emoji: '🔊', labelKey: 'settings.voice.label', hintKey: 'settings.voice.hint', testKey: 'settings.voiceTest' },
  { key: 'sound', emoji: '🎵', labelKey: 'settings.sound.label', hintKey: 'settings.sound.hint' },
  { key: 'dyslexia', emoji: '🔤', labelKey: 'settings.dyslexia.label', hintKey: 'settings.dyslexia.hint' },
  { key: 'colorblind', emoji: '🎨', labelKey: 'settings.colorblind.label', hintKey: 'settings.colorblind.hint' },
]

const LANGUAGES: { id: Lang; emoji: string; flag: string; labelKey: string }[] = [
  { id: 'en', emoji: '🌎', flag: '🇺🇸', labelKey: 'settings.en' },
  { id: 'tl', emoji: '🏝️', flag: '🇵🇭', labelKey: 'settings.fil' },
]

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, updateSettings, resetProgress, t } = useGame()
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
            className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-[32px] border-8 border-white bg-island-cream p-5 shadow-2xl"
          >
            <h2 className="mb-3 text-center font-display text-3xl font-extrabold text-island-ink">
              {t('settings.title')}
            </h2>

            {/* Language switcher */}
            <p className="mb-2 text-center font-display text-lg font-extrabold text-island-ink/80">
              {t('settings.language')}
            </p>
            <div className="mb-3 grid grid-cols-2 gap-2">
              {LANGUAGES.map((l) => {
                const active = state.settings.lang === l.id
                return (
                  <button
                    key={l.id}
                    onClick={() => updateSettings({ lang: l.id })}
                    className={[
                      'flex items-center justify-center gap-2 rounded-3xl border-4 border-white px-3 py-2 font-display text-lg font-extrabold shadow-sm transition-colors',
                      active ? 'bg-island-sun text-island-ink ring-4 ring-island-ink/20' : 'bg-white/80 text-island-ink/70',
                    ].join(' ')}
                  >
                    <span className="text-2xl">{l.emoji}</span>
                    <span>{l.flag} {t(l.labelKey)}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex flex-col gap-2">
              {OPTIONS.map((opt) => {
                const on = state.settings[opt.key]
                return (
                  <button
                    key={opt.key}
                    onClick={() => {
                      updateSettings({ [opt.key]: !on } as Partial<Settings>)
                      if (opt.key === 'voice' && !on && opt.testKey) speak(t(opt.testKey))
                    }}
                    className="flex items-center gap-3 rounded-3xl border-4 border-white bg-white/80 p-3 text-left shadow-sm"
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-bold text-island-ink">{t(opt.labelKey)}</span>
                      <span className="block text-sm text-island-ink/60">{t(opt.hintKey)}</span>
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
                    {t('settings.yes')}
                  </Button>
                  <Button variant="cream" size="md" fullWidth onClick={() => setConfirmReset(false)}>
                    {t('settings.keep')}
                  </Button>
                </div>
              ) : (
                <Button variant="coral" size="md" fullWidth icon="🧹" onClick={() => setConfirmReset(true)}>
                  {t('settings.reset')}
                </Button>
              )}
              <Button variant="blue" size="lg" fullWidth icon="👌" onClick={onClose}>
                {t('settings.done')}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}