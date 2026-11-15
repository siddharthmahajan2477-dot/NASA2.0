import { lazy, Suspense, type RefObject } from 'react'
import { ArrowRight, ArrowUpRight, Award, BookOpen, Compass, Database, Orbit, Route, Sparkles } from 'lucide-react'
import { useAppStore } from '../app/store'
import { useExplorerProgress } from '../app/useExplorerProgress'
import { missions, routes } from '../data/universe'
import MissionShowcase from './MissionShowcase'
import { missionVisuals } from '../data/missionVisuals'
import ProgressRing from './ui/ProgressRing'
import ScreenLink from './ui/ScreenLink'
const AstronautGuide = lazy(() => import('../game/scenes/AstronautGuide'))

export default function ExplorationHome({ heading }: { heading: RefObject<HTMLHeadingElement | null> }) {
  const navigate = useAppStore(s => s.navigate)
  const progress = useExplorerProgress()
  return <>
    <div className="home-heading"><div><p className="eyebrow">ECHOES OF EXPLORATION <span className="eyebrow-divider" /> OBSERVE. READ. SOLVE.</p><h1 ref={heading} tabIndex={-1} className="font-mono"><span className="sr-only">ECHOES OF EXPLORATION — </span>Explore the impossible<span className="heading-period">.</span></h1></div><div className="home-heading-note"><span className="status-dot" /><p>The missions ended.<br /><strong>Their stories live on.</strong></p></div></div>
    <div className="exploration-grid">
      <Suspense fallback={<div className="astronaut-loading"><img src="/assets/previews/astronaut.webp" alt="NASA astronaut spacesuit model" width="550" height="700" /><p role="status">Preparing your space explorer…</p></div>}><AstronautGuide /></Suspense>
      <aside className="explorer-panel surface-card" aria-label="Your explorer progress">
        <div className="panel-heading"><h2>Explorer Progress</h2><span className="status-dot" /></div><p className="muted">Your next discovery starts here.</p>
        <div className="explorer-identity"><span className="identity-icon"><Orbit size={22} /></span><div><strong>Hello, Explorer.</strong><span>Curiosity is your compass.</span></div></div>
        <div className="overall-ring"><ProgressRing value={progress.awards.quests} max={progress.totalQuests} label="quests complete" size={120} /></div>
        <div className="progress-divider"><span>YOUR MISSION LOG</span><Compass size={15} /></div>
        <div className="mission-progress-list">{missionVisuals.map(visual => {
          const mission = missions.find(m => m.id === visual.id)!
          return <ScreenLink screen={routes[visual.id]} key={visual.id} className={`mission-progress-item tone-${visual.tone}`}><span className="mini-mission-icon"><img src={`/assets/previews/${visual.image}.webp`} alt="" loading="lazy" /></span><span><strong>{visual.name}</strong><small>{progress.credited(visual.id)} of {mission.quests.length} quests</small></span><ArrowUpRight size={15} /></ScreenLink>
        })}</div>
        <div className="explorer-stat-row"><div><Sparkles size={16} /><strong>{progress.awards.xp}</strong><span>XP earned</span></div><div><Award size={16} /><strong>{progress.achievements.length}</strong><span>Achievements</span></div><div><Database size={16} /><strong>{progress.collected}</strong><span>Souvenirs</span></div></div>
        {!progress.ready && <p role="status" className="save-note">Reading saved progress…</p>}{progress.warning && <p role="status" className="save-note">{progress.warning}</p>}
        <ScreenLink screen="explorer" className="primary-button panel-cta">View My Progress <ArrowUpRight size={16} /></ScreenLink><p className="save-note"><span className="status-dot" /> Saved on this browser · no account needed</p>
      </aside>
      <div className="discovery-panels">
        <section className="universe-card" aria-label="Your exploration universe"><img className="universe-earth" src="/assets/previews/earth.webp" alt="NASA Earth model, displayed as an illustrative backdrop" width="700" height="700" /><div className="universe-card-heading"><div><p className="eyebrow">THREE WORLDS. ENDLESS CURIOSITY.</p><h2>Your exploration universe</h2></div><ScreenLink screen="missions" className="icon-button" aria-label="Open mission explorer"><ArrowUpRight size={18} /></ScreenLink></div><div className="universe-rings">{missionVisuals.map(visual => <ScreenLink key={visual.id} screen={routes[visual.id]} aria-label={`Explore ${visual.name} progress`}><ProgressRing value={progress.credited(visual.id)} max={missions.find(m => m.id === visual.id)!.quests.length} label={visual.name} tone={visual.tone} size={105} /></ScreenLink>)}</div><p className="universe-caption">Real missions. Your discoveries.</p></section>
        <div className="feature-bento">
          <section className="feature-card journeys-card"><div className="feature-title"><Route size={20} /><span>FOLLOW THE STORY</span></div><h2>Mission Journeys</h2><p>From a first launch to a lasting legacy.</p><ScreenLink screen="journeys" className="card-link">Explore Journeys <ArrowUpRight size={16} /></ScreenLink></section>
          <section className="feature-card quest-count-card"><span className="feature-title">CURIOSITY, REWARDED</span><strong>{progress.totalQuests}</strong><h2>Scientific quests</h2><button className="card-link" onClick={() => navigate('briefing')} aria-label="Start Exploration">Begin Exploring <ArrowUpRight size={16} /></button></section>
          <section className="feature-card"><div className="feature-title"><Orbit size={20} /><span>EVERY MOMENT MATTERS</span></div><h2>Chronosphere</h2><p>Trace the decisions that changed history.</p><ScreenLink screen="chronosphere" className="card-link">Explore Timeline <ArrowUpRight size={16} /></ScreenLink></section>
          <section className="feature-card"><div className="feature-title"><BookOpen size={20} /><span>NOTHING LEFT BEHIND</span></div><h2>Space Memory Archive</h2><p>Explore the science. Discover the evidence.</p><ScreenLink screen="archive" className="card-link">Open Archive <ArrowUpRight size={16} /></ScreenLink></section>
        </div>
      </div>
    </div>
    <div className="exploration-caption"><span><span className="status-dot" /> AUTHENTIC NASA MODELS · REAL SCIENTIFIC STORIES</span><span>Look closer. There&apos;s a story here. <ArrowRight size={16} /></span></div>
    <MissionShowcase />
  </>
}
