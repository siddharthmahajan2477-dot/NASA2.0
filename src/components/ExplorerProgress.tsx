import { ArrowUpRight, Award, LockKeyhole, Sparkles } from 'lucide-react'
import { useExplorerProgress } from '../app/useExplorerProgress'
import { missions, routes, souvenirs } from '../data/universe'
import ProgressRing from './ui/ProgressRing'
import { missionVisuals } from '../data/missionVisuals'
import { useAppStore } from '../app/store'

export default function ExplorerProgress() {
  const progress = useExplorerProgress(), navigate = useAppStore(s => s.navigate)
  return <div className="explorer-dashboard universe">
    <section className="progress-overview"><div><p className="eyebrow">YOUR CURIOSITY LEAVES A TRACE</p><h2>Every discovery counts.</h2><p className="explorer-totals" aria-live="polite">{progress.awards.quests} / {progress.totalQuests} quests credited · {progress.awards.xp} XP</p><p>Earn 100 XP per validated quest, 200 XP per complete mission and 300 XP for all three. Maximum: 2,600 XP. Reading and reopening panels award nothing. Earned receipts survive mission restart.</p></div><div className="progress-overview-rings"><ProgressRing value={progress.awards.quests} max={progress.totalQuests} label="quests complete" size={145} /><ProgressRing value={progress.awards.xp} max={2600} label="XP earned" display={String(progress.awards.xp)} size={125} tone="blue" /><ProgressRing value={progress.achievements.length} max={missions.length + 1} label="achievements" caption="awards" display={`${progress.achievements.length}/${missions.length + 1}`} size={110} tone="gold" /></div></section>
    {!progress.ready && <p role="status">Reading local progress.</p>}{progress.warning && <p role="status">{progress.warning}</p>}
    <div className="progress-missions">{missionVisuals.map(visual => {
      const index = missions.findIndex(m => m.id === visual.id), mission = missions[index], state = progress.states[index]
      return <article key={visual.id} className={`progress-mission tone-${visual.tone}`}><div className="progress-mission-top"><img src={`/assets/previews/${visual.image}.webp`} alt={`${visual.name} NASA model preview`} width="160" height="114" /><ProgressRing value={progress.credited(visual.id)} max={mission.quests.length} label="credited quests" tone={visual.tone} size={95} /></div><h2>{mission.story!.label}</h2><p>Active run: {state.progress.completed.length} / {mission.quests.length} quests · {state.progress.evidence.length} evidence records · {state.progress.phase}</p><div className="active-quest-indicators" aria-hidden="true">{mission.quests.map((q, i) => <span key={q.id} data-complete={state.progress.completed.includes(q.id)}>{i + 1}</span>)}</div>{state.warning && <p role="status">{state.warning} Earned progress may be available only in this session.</p>}<button className="primary-button" onClick={() => navigate(routes[visual.id])}>Resume {mission.story!.label}<ArrowUpRight size={17} /></button></article>
    })}</div>
    <div className="collection-heading"><Award size={22} /><h2>Achievements</h2><span>{progress.achievements.length} / {missions.length + 1} earned</span></div>
    {progress.achievements.length ? <ul className="achievement-list">{progress.achievements.map(a => <li key={a.id}><Award size={22} /><span>{a.label} — {a.xp} XP</span></li>)}</ul> : <div className="empty-achievements"><Sparkles size={24} /><div><h3>Your story is still being written.</h3><p>Finish a mission to earn your first achievement. Every completed quest already counts toward your XP.</p></div></div>}
    <div className="collection-heading"><h2>Mission souvenirs</h2><span>{progress.collected} / {souvenirs.length} collected</span></div><p>Original in-game commemorative memories, not NASA-issued objects.</p>
    <div className="souvenir-grid">{souvenirs.map(s => { const earned = progress.awards.awards.some(a => a.id === `mission:${s.missionId}`); const visual = missionVisuals.find(m => m.id === s.missionId)!; return <article key={s.id} data-earned={earned} className={`souvenir-card tone-${visual.tone}`}><span className="souvenir-icon">{earned ? <Award size={30} /> : <LockKeyhole size={26} />}</span><h3>{s.title}</h3><p className="souvenir-status">{earned ? 'Earned' : 'Locked — complete this mission'}</p><p>{s.meaning}</p><a href={s.source.url} target="_blank" rel="noopener noreferrer">Historical source <ArrowUpRight size={14} /></a></article> })}</div>
  </div>
}
