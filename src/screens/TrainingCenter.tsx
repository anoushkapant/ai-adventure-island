import { useGame } from '../context/GameContext'
import { ActivityCard, ScreenShell } from '../components/ActivityCard'
import type { View } from '../types'

export function TrainingCenter({ onNavigate }: { onNavigate: (v: View) => void }) {
  const { state } = useGame()
  return (
    <ScreenShell title="🧠 Training Center">
      <div className="flex flex-col gap-4">
        <ActivityCard
          index={0}
          emoji="🍎"
          title="Teach the Robot"
          description="Sort fruits and veggies. Watch the AI learn!"
          color="island-green"
          onClick={() => onNavigate('level1')}
          stars={state.levels['level1']?.stars}
          bestAccuracy={state.levels['level1']?.bestAccuracy}
        />
        <ActivityCard
          index={1}
          emoji="🐾"
          title="Build Your AI Pet"
          description="Pick a pet, train it, unlock powers."
          color="island-purple"
          onClick={() => onNavigate('build')}
          stars={state.levels['build']?.stars}
          bestAccuracy={state.levels['build']?.bestAccuracy}
        />
        <ActivityCard
          index={2}
          emoji="🐲"
          title="Train the Dragon"
          description="A baby dragon needs your help to grow!"
          color="island-coral"
          onClick={() => onNavigate('dragon')}
          stars={state.levels['dragon']?.stars}
          bestAccuracy={state.levels['dragon']?.bestAccuracy}
        />
      </div>
    </ScreenShell>
  )
}
