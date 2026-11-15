import SpacecraftInspection from './SpacecraftInspection'
import { ingenuityInspection } from './ingenuityConfig'
import { ingenuityMission } from '../quests/ingenuity'
import { useIngenuityQuestStore } from '../quests/ingenuityStore'
import MissionReference from '../quests/MissionReference'
import { ingenuityReference } from '../../data/ingenuityRecords'

export default function IngenuityInspection() {
  return <SpacecraftInspection config={ingenuityInspection} mission={ingenuityMission} useMissionStore={useIngenuityQuestStore} story={{
    opening: 'Five flights were the plan. Mars had room for more.', heading: 'A small aircraft. A new kind of journey.', label: 'INGENUITY', terrain: 'JEZERO CRATER / MARS',
    description: 'Follow the engineering from the solar array to the four feet on the ground. Each helped the helicopter stay useful for another day.',
    credit: <><p>Ingenuity model: NASA/Brian E. Kumanchik. This is an intact engineering visualization, not the damaged aircraft after Flight 72. Materials and textures come from the supplied GLB. Terrain, lighting and diagrams are illustrative; no model animations are used.</p><p>Four visible regions are verified. Individual navigation-camera lenses and communication hardware are not assigned precise hotspots; their functions are explained through NASA records. This independent project is not affiliated with or endorsed by NASA.</p><a href={ingenuityMission.sources.model.url} target="_blank" rel="noopener noreferrer">NASA model & credit</a></>,
  }}><MissionReference mission={ingenuityMission} reference={ingenuityReference} /></SpacecraftInspection>
}
