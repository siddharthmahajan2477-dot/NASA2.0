import { ArrowUpRight, Play, Route } from 'lucide-react'
import { useAppStore } from '../app/store'
import { useUniverseState } from '../app/universeState'
import { useExplorerProgress } from '../app/useExplorerProgress'
import { missions, routes } from '../data/universe'
import ScreenLink from './ui/ScreenLink'

import { missionVisuals } from '../data/missionVisuals'

export default function MissionShowcase({ selection = false }: { selection?: boolean }) {
  const navigate = useAppStore(s => s.navigate)
  const { credited, states } = useExplorerProgress()
  const set = useUniverseState(s => s.set)
  return <section className="mission-showcase" aria-label="Explore the missions">
    {!selection && <div className="section-heading"><div><p className="eyebrow">REAL MACHINES. EXTRAORDINARY STORIES.</p><h2>Some things never came home.</h2></div><button className="text-button" onClick={() => navigate('missions')}>Choose a mission <ArrowUpRight size={17} /></button></div>}
    <div className="mission-cards">{missionVisuals.map(visual => {
      const mission = missions.find(m => m.id === visual.id)!
      const index = missions.indexOf(mission)
      const started = states[index].progress.phase !== 'idle'
      return <article key={visual.id} className={`mission-card tone-${visual.tone}`}>
        <div className="mission-card-visual"><div className="mission-card-label"><span>{visual.place}</span><span>{visual.year}</span></div><img src={`/assets/previews/${visual.image}.webp`} alt={`Rendered preview of the authentic NASA ${visual.name} model`} loading="lazy" width="600" height="425" /><span className="quest-chip">{mission.quests.length} scientific quests</span></div>
        <div className="mission-card-body"><div className="mission-title-row"><h3>{visual.name}</h3><span>{credited(visual.id)}/{mission.quests.length} complete</span></div><p>{visual.story}</p>
          <div className="mission-card-actions"><button className="primary-button" onClick={() => navigate(selection ? visual.film : routes[visual.id])}>{selection ? `Explore ${visual.name}` : started ? 'Continue Progress' : 'Explore Mission'}<ArrowUpRight size={17} /></button><ScreenLink screen={visual.film} className="icon-button" aria-label={`Watch ${visual.name} Film`} title="Watch Film"><Play size={17} /></ScreenLink><ScreenLink screen="journeys" className="icon-button" aria-label={`View ${visual.name} Journey`} title="View Journey" onClick={() => set({ mission: visual.id, event: `${visual.id}:0` })}><Route size={18} /></ScreenLink></div>
        </div>
      </article>
    })}</div>
  </section>
}
