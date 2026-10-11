import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { GameProvider, useGame } from './context/GameContext'
import { TopBar } from './components/TopBar'
import { SettingsPanel } from './components/SettingsPanel'
import { CelebrationOverlay } from './components/CelebrationOverlay'
import { IslandMap } from './screens/IslandMap'
import { RobotLab } from './screens/RobotLab'
import { TrainingCenter } from './screens/TrainingCenter'
import { Challenges } from './screens/Challenges'
import { RewardsCastle } from './screens/RewardsCastle'
import { Storybook } from './screens/Storybook'
import { Level1TeachRobot } from './screens/Level1TeachRobot'
import { Level2Detective } from './screens/Level2Detective'
import { Level3Bias } from './screens/Level3Bias'
import { BuildPet } from './screens/BuildPet'
import { TrainDragon } from './screens/TrainDragon'
import type { View } from './types'

const TITLES: Partial<Record<View, string>> = {
  lab: 'titles.lab',
  training: 'titles.training',
  challenges: 'titles.challenges',
  rewards: 'titles.rewards',
  story: 'titles.story',
  level1: 'titles.level1',
  level2: 'titles.level2',
  level3: 'titles.level3',
  build: 'titles.build',
  dragon: 'titles.dragon',
}

const SECTIONS: View[] = ['lab', 'training', 'challenges', 'rewards', 'story']

function AppInner() {
  const { t } = useGame()
  const [view, setView] = useState<View>('map')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const home = (v: View) => {
    setView(v)
    window.scrollTo({ top: 0 })
  }
  const back = (v: View) => setView(v)

  return (
    <div className="relative min-h-full">
      <Background />

      <div className="no-scrollbar relative h-[100dvh] overflow-y-auto">
        <TopBar
          title={t(TITLES[view] ?? (view === 'map' ? 'titles.map' : 'nope'))}
          onHome={() => (view === 'map' ? undefined : home('map'))}
          onSettings={() => setSettingsOpen(true)}
          showHome={view !== 'map'}
        />

        <AnimatePresence mode="wait">
          <motion.main
            key={view}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.28 }}
          >
            {view === 'map' && <IslandMap onNavigate={home} />}
            {view === 'lab' && <RobotLab onHome={back} onSettings={() => setSettingsOpen(true)} />}
            {view === 'training' && <TrainingCenter onNavigate={back} />}
            {view === 'challenges' && <Challenges onNavigate={back} />}
            {view === 'rewards' && <RewardsCastle onHome={back} />}
            {view === 'story' && <Storybook onHome={back} />}
            {view === 'level1' && <Level1TeachRobot onHome={back} />}
            {view === 'level2' && <Level2Detective onHome={back} />}
            {view === 'level3' && <Level3Bias onHome={back} />}
            {view === 'build' && <BuildPet onHome={back} />}
            {view === 'dragon' && <TrainDragon onHome={back} />}
          </motion.main>
        </AnimatePresence>

        <footer className="relative py-6 text-center">
          <p className="font-display text-sm font-bold text-island-ink/60">
            {t('footer')}
          </p>
        </footer>
      </div>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <CelebrationOverlay />

      {/* quick island-map shortcut at very bottom on touch */}
      {view !== 'map' && !SECTIONS.includes(view) && (
        <button
          onClick={() => home('map')}
          className="fixed bottom-4 right-4 z-40 grid h-14 w-14 place-items-center rounded-2xl border-4 border-white bg-island-sun text-2xl shadow-lg"
          aria-label="Go to island map"
        >
          🏠
        </button>
      )}
    </div>
  )
}

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/60 to-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <AppInner />
    </GameProvider>
  )
}