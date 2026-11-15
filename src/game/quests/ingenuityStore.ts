import { createMissionStore } from './store'
import { ingenuityMission } from './ingenuity'

// Same database and validated schema; a different missionId is a different key.
export const useIngenuityQuestStore = createMissionStore(ingenuityMission)
