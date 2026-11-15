import { ArrowUpRight, Box } from 'lucide-react'
import { useAppStore } from '../app/store'
import { missionVisuals } from '../data/missionVisuals'
import { routes } from '../data/universe'

export default function MissionPreview({ missionId }: { missionId: string }) {
  const visual = missionVisuals.find(m => m.id === missionId)!
  const navigate = useAppStore(s => s.navigate)
  return <figure className={`briefing-model tone-${visual.tone}`}><div className="briefing-model-heading"><Box size={18} /><span>THE REAL MACHINE</span><span>{visual.place}</span></div><img src={`/assets/previews/${visual.image}.webp`} alt={`Studio rendering of the original NASA ${visual.name} model`} width="600" height="425" /><figcaption><strong>{visual.name}</strong><span>Authentic NASA model · illustrative studio view</span><button className="primary-button" onClick={() => navigate(routes[visual.id])}>Open 3D inspection <ArrowUpRight size={16} /></button></figcaption></figure>
}
