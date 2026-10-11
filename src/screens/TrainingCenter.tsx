import { useGame } from '../context/GameContext'
import { ActivityCard, ScreenShell } from '../components/ActivityCard'
import type { View } from '../types'

export function TrainingCenter({ onNavigate }: { onNavigate: (v: View) => void }) {
  const { state, t } = useGame()
  return (
    <ScreenShell title={t('training.title')}>
      <div className="flex flex-col gap-4">
        <ActivityCard
          index={0}
          emoji="🍎"
          title={t('training.l1.title')}
          description={t('training.l1.desc')}
          color="island-green"
          onClick={() => onNavigate('level1')}
          stars={state.levels['level1']?.stars}
          bestAccuracy={state.levels['level1']?.bestAccuracy}
        />
        <ActivityCard
          index={1}
          emoji="🐾"
          title={t('training.pet.title')}
          description={t('training.pet.desc')}
          color="island-purple"
          onClick={() => onNavigate('build')}
          stars={state.levels['build']?.stars}
          bestAccuracy={state.levels['build']?.bestAccuracy}
        />
        <ActivityCard
          index={2}
          emoji="🐲"
          title={t('training.dragon.title')}
          description={t('training.dragon.desc')}
          color="island-coral"
          onClick={() => onNavigate('dragon')}
          stars={state.levels['dragon']?.stars}
          bestAccuracy={state.levels['dragon']?.bestAccuracy}
        />
      </div>
    </ScreenShell>
  )
}
