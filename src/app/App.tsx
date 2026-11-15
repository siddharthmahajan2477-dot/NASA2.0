import ListenMode from '../components/ListenMode'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useAppStore, type Screen } from './store'
import { sources } from '../data/sources'
import { loadNearInspection } from '../game/scenes/nearInspectionModule'
import ErrorBoundary from '../components/ui/ErrorBoundary'

const MissionFilm = lazy(()=>import('../components/MissionFilm'))
const AstronautGuide = lazy(()=>import('../game/scenes/AstronautGuide'))
const Universe = lazy(() => import('../components/Universe'))
const hubScreens = ['chronosphere','archive','journeys','explorer'] as const
const NearBriefing = lazy(() => import('../game/scenes/NearBriefing'))
const NearInspection = lazy(loadNearInspection)
const ApolloInspection = lazy(() => import('../game/scenes/ApolloInspection'))
const IngenuityBriefing = lazy(() => import('../game/scenes/IngenuityBriefing'))
const IngenuityInspection = lazy(() => import('../game/scenes/IngenuityInspection'))
const RendererTest = lazy(() => import('../game/scenes/RendererTest'))
const names: Record<Screen, string> = { 'apollo-film':'Apollo 11 Mission Film','ingenuity-film':'Ingenuity Mission Film','near-film':'NEAR Mission Film', chronosphere:'Chronosphere', archive:'Space Memory Archive', journeys:'Mission Journeys', explorer:'Explorer Progress', 'near-briefing': 'The Landing Nobody Designed For', 'near-inspection': 'The Landing Nobody Designed For', missions: 'Choose a Mission', 'ingenuity-briefing': 'Seventy-Two Flights', 'ingenuity-inspection': 'Seventy-Two Flights', inspection: 'Apollo 11 inspection', welcome: 'Welcome', briefing: 'Apollo 11 briefing', settings: 'Settings', sources: 'Scientific Sources & Credits' }

export default function App() {
  const [meetExplorer,setMeetExplorer]=useState(false)
  const screen = useAppStore((state) => state.screen)
  const navigate = useAppStore((state) => state.navigate)
  const reducedMotion = useAppStore((state) => state.preferences.reducedMotion)
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    document.title = `${names[screen]} · Echoes of Exploration`
    heading.current?.focus()
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [screen])

  return <div className="app-shell" data-reduced-motion={reducedMotion}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header flex flex-wrap items-center justify-between gap-4">
      <button className="wordmark" aria-label="Echoes of Exploration home" onClick={() => navigate('welcome')}><span className="orbit-mark" aria-hidden="true">◌</span><span>ECHOES <span className="wordmark-secondary">OF EXPLORATION</span></span></button>
      <span className="edition">INDEPENDENT SCIENCE ADVENTURE <span aria-hidden="true">/</span> {screen.startsWith('near-') ? 'NEAR SHOEMAKER / EROS' : screen.startsWith('ingenuity') ? 'INGENUITY / MARS' : screen === 'missions' ? 'MISSION SELECTION' : 'APOLLO 11 / SURFACE OPERATIONS'}</span>
      <nav aria-label="Connected exploration" className="secondary-nav flex flex-wrap gap-6">{hubScreens.map(route=><button key={route} className="text-button" onClick={()=>navigate(route)}>{names[route]}</button>)}</nav>
      <div className="corner-brand"><span>The missions ended. Their stories live on.</span><strong>OBSERVE. READ. SOLVE.</strong></div>
    </header>
    <main id="main" className={`main-content ${screen === 'welcome' ? 'welcome-layout' : ''}`}>
      {screen === 'welcome' ? <>
        <section className="welcome-copy">
          <p className="eyebrow"><span className="small-line" /> A JOURNEY THROUGH WHAT REMAINS</p>
          <h1 ref={heading} tabIndex={-1}>ECHOES OF<br /><span>EXPLORATION</span></h1>
          <p className="tagline">The missions ended.<br />Their stories live on.</p>
          <p className="learning-motto">OBSERVE. READ. SOLVE.</p><p className="intro">Some machines never came home. Discover the engineering, the evidence, and the people behind what we left on other worlds.</p>
          <div className="welcome-actions flex flex-wrap items-center gap-4">
            <button className="primary-button" onClick={() => navigate('briefing')}>Start Exploration <span aria-hidden="true">↗</span></button>
            <button className="primary-button" onClick={() => navigate('missions')}>Choose a mission</button><span className="status-note">Start Exploration opens Apollo 11. Choose a mission to visit Mars.</span>
          </div>
          <div className="astronaut-invitation"><p>Hey, Explorer! Before you begin, meet the person behind the spacesuit.</p><button className="text-button" aria-expanded={meetExplorer} onClick={()=>setMeetExplorer(v=>!v)}>{meetExplorer?'Close space explorer':'Meet Your Space Explorer'}</button>{meetExplorer&&<Suspense fallback={<p role="status">Opening the spacesuit model.</p>}><AstronautGuide/></Suspense>}</div>
          <nav className="secondary-nav flex flex-wrap gap-6" aria-label="Welcome navigation">
            <button className="text-button" onClick={() => navigate('settings')}>Settings</button>
            <button className="text-button" onClick={() => navigate('sources')}>Scientific Sources & Credits</button>
          </nav>
        </section>
        <aside className="lunar-art" aria-label="Illustrative lunar silhouette; not landing-site imagery" role="img"><div className="moon-disc" /><div className="art-cross cross-one" /><div className="art-cross cross-two" /><p className="art-caption">01 / THE MOON<br /><span>A story begins with what stayed.</span></p></aside>
      </> : <section className="interior-screen">
        <button className="text-button back-button" onClick={() => navigate(screen.endsWith('-film') ? 'missions' : screen === 'near-inspection' ? 'near-briefing' : screen === 'near-briefing' ? 'missions' : screen === 'ingenuity-inspection' ? 'ingenuity-briefing' : screen === 'inspection' ? 'briefing' : screen === 'ingenuity-briefing' ? 'missions' : 'welcome')}>{screen.endsWith('-film') ? 'Back to missions' : screen === 'near-inspection' ? 'Back to briefing' : screen === 'near-briefing' ? 'Back to missions' : screen === 'ingenuity-inspection' || screen === 'inspection' ? '← Back to briefing' : screen === 'ingenuity-briefing' ? '← Back to missions' : '← Back to welcome'}</button>
        <p className="eyebrow">ECHOES OF EXPLORATION / {screen === 'briefing' ? 'CHAPTER 01' : 'FIELD NOTES'}</p>
        <h1 ref={heading} tabIndex={-1}>{screen === 'briefing' || screen === 'inspection' ? 'The Part That Stayed' : names[screen]}</h1>
        {screen === 'apollo-film' || screen === 'ingenuity-film' || screen === 'near-film' ? <Suspense fallback={<p role="status">Opening mission introduction.</p>}><MissionFilm missionId={screen === 'apollo-film'?'apollo-11':screen === 'near-film'?'near-shoemaker':'ingenuity'}/></Suspense> : screen === 'chronosphere' || screen === 'archive' || screen === 'journeys' || screen === 'explorer' ? <Suspense fallback={<p role="status">Opening exploration records.</p>}><Universe screen={screen}/></Suspense> : screen === 'near-briefing' ? <Suspense fallback={<p role="status">Opening NEAR records.</p>}><NearBriefing /></Suspense> : screen === 'near-inspection' ? <Suspense fallback={<p role="status">Opening Eros.</p>}><NearInspection /></Suspense> : screen === 'missions' ? <MissionSelection /> : screen === 'ingenuity-briefing' ? <Suspense fallback={<p role="status">Opening mission records.</p>}><IngenuityBriefing /></Suspense> : screen === 'ingenuity-inspection' ? <Suspense fallback={<p role="status">Opening the Martian surface.</p>}><IngenuityInspection /></Suspense> : screen === 'inspection' ? <Suspense fallback={<p role="status">Opening the lunar surface…</p>}><ApolloInspection /></Suspense> : screen === 'briefing' ? <Briefing /> : screen === 'settings' ? <Settings /> : <Sources />}
      </section>}
    </main>
    <footer className="site-footer flex flex-wrap items-center justify-between gap-4"><span>LOOK CLOSER. THERE’S A STORY HERE.</span><span>Independent project. Not affiliated with or endorsed by NASA.</span></footer>
  </div>
}

function Briefing() {
  const navigate = useAppStore((state) => state.navigate)
  return <>
    <button className="text-button" onClick={()=>navigate('apollo-film')}>Watch Apollo mission film</button><div className="mission-meta flex flex-wrap gap-6"><span>APOLLO 11</span><span>MOON · SEA OF TRANQUILITY</span><span>JULY 1969</span></div>
    <div className="briefing-layout">
      <div className="prose">
        <p className="lead">The astronauts made it home. Part of their spacecraft stayed behind.</p>
        <p>Apollo 11’s lunar surface activities included deploying scientific experiments. This chapter will investigate the equipment, its engineering, and the record it left behind.</p>
        <p className="central-question">Why did the Lunar Module need two stages?</p><ListenMode title="Apollo briefing" text="The astronauts made it home. Part of their spacecraft stayed behind. Apollo 11 surface activities included deploying scientific experiments. Investigate the equipment, its engineering and the record it left behind. Why did the Lunar Module need two stages?"/>
        <button className="primary-button" onClick={() => navigate('inspection')}>Inspect the Lunar Module →</button><p className="status-note">Five evidence-led investigations are ready. You can also inspect the spacecraft freely.</p>
        <a className="source-link" href={sources[0].url} target="_blank" rel="noopener noreferrer">Read NASA’s Apollo 11 mission overview ↗</a>
      </div>
      <ErrorBoundary message="The 3D renderer could not start. You can continue using the briefing, settings, and sources.">
        <Suspense fallback={<div className="notice" role="status">Loading renderer test…</div>}><RendererTest /></Suspense>
      </ErrorBoundary>
    </div>
  </>
}

function Settings() {
  const preferences = useAppStore((state) => state.preferences)
  const setPreference = useAppStore((state) => state.setPreference)
  const warning = useAppStore((state) => state.storageWarning)
  return <div className="settings-panel prose">
    <p>Make room for the way you explore. Preferences are saved on this browser when storage is available.</p>
    <label className="setting-row"><span><strong>Reduced motion</strong><small>Remove interface transitions. The renderer test has no automatic rotation.</small></span><input type="checkbox" checked={preferences.reducedMotion} onChange={(event) => setPreference('reducedMotion', event.target.checked)} /></label>
    <label className="setting-row"><span><strong>Sound preference</strong><small>Remember your choice for future audio. This foundation contains no sound.</small></span><input type="checkbox" checked={preferences.sound} onChange={(event) => setPreference('sound', event.target.checked)} /></label>
    <p role="status" className="storage-status">{warning ?? 'Preferences save automatically on this browser.'}</p>
  </div>
}

function Sources() {
  const navigate = useAppStore((state) => state.navigate)
  return <div className="sources-panel prose">
    <p>Primary references for Apollo and our scientific foundation. Ingenuity’s briefing and inspection include its complete mission reference, engineering records and NASA/JPL sources.</p>
    <button className="text-button" onClick={() => navigate('ingenuity-briefing')}>Read Ingenuity mission records</button><ul className="source-list">{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a><p>{source.purpose}</p></li>)}</ul>
    <div className="notice"><strong>Visuals & credits</strong><p>The lunar silhouette is original CSS illustration. The geometric renderer test uses Three.js primitives. The Apollo inspection uses the NASA/Michael D. Carbajal Lunar Module model, with original illustrative terrain. No historical photographs, music, or voice recordings are included. The Ingenuity model is credited to NASA/Brian E. Kumanchik. Each inspection includes its model credit and scientific sources.</p><p>Built with React, Vite, TypeScript, Tailwind CSS, Three.js, React Three Fiber, Drei, and Zustand. This independent project does not imply NASA endorsement.</p></div>
  </div>
}

function MissionSelection() {
  const navigate = useAppStore((state) => state.navigate)
  return <div className="mission-selection"><p>Three machines. Three stories. Choose the story you want to recover.</p><div className="mission-cards">
    <article><p className="eyebrow">THE MOON / 1969</p><h2>Apollo 11</h2><p>The Part That Stayed</p><button className="primary-button" onClick={() => navigate('apollo-film')}>Explore Apollo 11</button></article>
    <article><p className="eyebrow">MARS / 2021–2024</p><h2>Ingenuity</h2><p>Seventy-Two Flights</p><button className="primary-button" onClick={() => navigate('ingenuity-film')}>Explore Ingenuity</button></article>
  <article><h2>NEAR Shoemaker</h2><p>The Landing Nobody Designed For</p><button className="primary-button" onClick={() => navigate('near-film')}>Explore NEAR Shoemaker</button></article></div></div>
}
