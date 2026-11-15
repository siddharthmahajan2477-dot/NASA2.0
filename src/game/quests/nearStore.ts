import { createMissionStore } from './store'
import { nearMission } from './near'
export const useNearQuestStore = createMissionStore(nearMission)
