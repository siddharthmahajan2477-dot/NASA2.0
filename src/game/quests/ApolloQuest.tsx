import { apolloMission } from './apollo'
import { useApolloQuestStore } from './store'
import { MissionQuestHeader, MissionQuestWorkbench } from './MissionQuest'

export function ApolloQuestHeader({ onRestart }: { onRestart: () => void }) {
  return <MissionQuestHeader mission={apolloMission} useMissionStore={useApolloQuestStore} onRestart={onRestart} />
}
export function ApolloQuestWorkbench() {
  return <MissionQuestWorkbench mission={apolloMission} useMissionStore={useApolloQuestStore} />
}
