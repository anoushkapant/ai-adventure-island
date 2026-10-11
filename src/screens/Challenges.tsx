import { useGame } from '../context/GameContext'
import { ActivityCard, ScreenShell } from '../components/ActivityCard'
import type { View } from '../types'

export function Challenges({ onNavigate }: { onNavigate: (v: View) => void }) {
  const { state } = useGame()
  return (
    <ScreenShell title="🎯 AI Challenges">
      <div className="flex flex-col gap-4">
        <ActivityCard
          index={0}
          emoji="🕵️"
          title="Robot Detective 🕵️"
          description="Huhula ang AI. Tama ba ang hula nito?"
          color="island-blue"
          onClick={() => onNavigate('level2')}
          stars={state.levels['level2']?.stars}
          bestAccuracy={state.levels['level2']?.bestAccuracy}
        />
        <ActivityCard
          index={1}
          emoji="⚖️"
          title="Hanapin ang Bias"
          description="Alamin kung bakit may hindi patas na hula ang AI."
          color="island-coral"
          onClick={() => onNavigate('level3')}
          stars={state.levels['level3']?.stars}
          bestAccuracy={state.levels['level3']?.bestAccuracy}
        />
      </div>
    </ScreenShell>
  )
}
