import { useGame } from '../context/GameContext'
import { ActivityCard, ScreenShell } from '../components/ActivityCard'
import type { View } from '../types'

export function Challenges({ onNavigate }: { onNavigate: (v: View) => void }) {
  const { state, t } = useGame()
  return (
    <ScreenShell title={t('challenges.title')}>
      <div className="flex flex-col gap-4">
        <ActivityCard
          index={0}
          emoji="🕵️"
          title={t('challenges.l2.title') + ' 🕵️'}
          description={t('challenges.l2.desc')}
          color="island-blue"
          onClick={() => onNavigate('level2')}
          stars={state.levels['level2']?.stars}
          bestAccuracy={state.levels['level2']?.bestAccuracy}
        />
        <ActivityCard
          index={1}
          emoji="⚖️"
          title={t('challenges.l3.title')}
          description={t('challenges.l3.desc')}
          color="island-coral"
          onClick={() => onNavigate('level3')}
          stars={state.levels['level3']?.stars}
          bestAccuracy={state.levels['level3']?.bestAccuracy}
        />
      </div>
    </ScreenShell>
  )
}
