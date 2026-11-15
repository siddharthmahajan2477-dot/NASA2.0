import SpacecraftInspection from './SpacecraftInspection'
import { apolloInspection } from './inspection'
import { apolloMission } from '../quests/apollo'
import { useApolloQuestStore } from '../quests/store'

export default function ApolloInspection() {
  return <SpacecraftInspection config={apolloInspection} mission={apolloMission} useMissionStore={useApolloQuestStore} story={{
    opening: 'The astronauts made it home. Not everything did.', heading: 'Two stages. One way home.',
    description: 'Look at the cabin above the landing platform. Only one of them needed to leave.', terrain: 'SEA OF TRANQUILITY / JULY 1969', label: 'LUNAR MODULE',
    credit: <><p>Lunar Module model: NASA/Michael D. Carbajal. This is NASA's general Lunar Module visualization, not a certified reconstruction of every Apollo 11 Eagle detail. Shown with both stages together during surface operations; the descent stage remained after departure. Terrain and lighting are illustrative. No supplied animation clips are used.</p><p><a href="https://science.nasa.gov/3d-resources/apollo-lunar-module/" target="_blank" rel="noopener noreferrer">NASA model & credit</a> · <a href="https://www.nasa.gov/missions/apollo/apollo-11-mission-overview/" target="_blank" rel="noopener noreferrer">Apollo 11 mission record</a></p></>,
  }} />
}
