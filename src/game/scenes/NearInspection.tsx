import SpacecraftInspection from './SpacecraftInspection'
import { nearConfig } from './nearConfig'
import { nearMission } from '../quests/near'
import { useNearQuestStore } from '../quests/nearStore'
import MissionReference from '../quests/MissionReference'
import { nearReference } from '../../data/nearRecords'
import NearJourney from './NearJourney'
export default function NearInspection() { return <SpacecraftInspection config={nearConfig} mission={nearMission} useMissionStore={useNearQuestStore} story={{opening:'Built to look down. Still speaking from the ground.',heading:'An orbiter with another chapter ahead.',description:'Explore the spacecraft, then follow the Eros journey below the quest workbench.',terrain:'EROS / ILLUSTRATIVE DISPLAY STAGING',label:'NEAR SHOEMAKER',credit:<p>Original NASA NEAR GLB and Eros STL. Display ground is illustrative staging, not the surface at touchdown. Independent project; not affiliated with or endorsed by NASA.</p>}}><NearJourney /><MissionReference mission={nearMission} reference={nearReference} /></SpacecraftInspection> }
