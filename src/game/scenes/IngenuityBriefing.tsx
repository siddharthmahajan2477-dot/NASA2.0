import ListenMode from '../../components/ListenMode'
import { useAppStore } from '../../app/store'
import { ingenuityMission } from '../quests/ingenuity'
import { ingenuityReference } from '../../data/ingenuityRecords'
import MissionReference from '../quests/MissionReference'

export default function IngenuityBriefing() {
  const navigate = useAppStore((state) => state.navigate)
  return <div className="ingenuity-briefing"><div className="prose"><p className="eyebrow">INGENUITY / JEZERO CRATER, MARS / 2021–2024</p>
    <p className="lead">Five flights were the plan. Mars had room for more.</p>
    <p>A small helicopter arrived beneath Perseverance. Its first job was to prove that powered, controlled flight could work on another planet. It eventually flew 72 times.</p>
    <p>You are a Space Memory Explorer. Investigate the aircraft, follow its engineering records and reconstruct how a brief experiment became an aerial explorer. The final flight asks you to distinguish direct evidence from a most-likely explanation.</p>
    <p className="central-question">How did an experiment become an explorer?</p>
    <button className="primary-button" onClick={() => navigate('ingenuity-inspection')}>Inspect Ingenuity</button><p className="status-note">Six complete investigations. Progress saves separately from Apollo on this browser when storage is available.</p>
    <button className="text-button" onClick={() => navigate('missions')}>Choose another mission</button>
  </div><ListenMode title="Ingenuity briefing" text="Five flights were the original plan. Investigate the engineering that made powered, controlled flight on Mars possible and follow the evidence through seventy-two flights."/><button className="text-button" onClick={()=>navigate('ingenuity-film')}>Watch mission film</button><MissionReference mission={ingenuityMission} reference={ingenuityReference} /></div>
}
