import { lazy, Suspense, useEffect, useRef } from 'react'
import SiteHeader from '../components/SiteHeader'
import ExplorationHome from '../components/ExplorationHome'
import MissionShowcase from '../components/MissionShowcase'
import { useAppStore, type Screen } from './store'
import { sources } from '../data/sources'
import { loadNearInspection } from '../game/scenes/nearInspectionModule'
import ErrorBoundary from '../components/ui/ErrorBoundary'

const MissionFilm = lazy(()=>import('../components/MissionFilm'))
const Universe = lazy(() => import('../components/Universe'))
const NearBriefing = lazy(() => import('../game/scenes/NearBriefing'))
const NearInspection = lazy(loadNearInspection)
const ApolloInspection = lazy(() => import('../game/scenes/ApolloInspection'))
const IngenuityBriefing = lazy(() => import('../game/scenes/IngenuityBriefing'))
const IngenuityInspection = lazy(() => import('../game/scenes/IngenuityInspection'))
const RendererTest = lazy(() => import('../game/scenes/RendererTest'))
const names: Record<Screen, string> = { 'apollo-film':'Apollo 11 Mission Film','ingenuity-film':'Ingenuity Mission Film','near-film':'NEAR Mission Film', chronosphere:'Chronosphere', archive:'Space Memory Archive', journeys:'Mission Journeys', explorer:'Explorer Progress', 'near-briefing': 'The Landing Nobody Designed For', 'near-inspection': 'The Landing Nobody Designed For', missions: 'Choose a Mission', 'ingenuity-briefing': 'Seventy-Two Flights', 'ingenuity-inspection': 'Seventy-Two Flights', inspection: 'Apollo 11 inspection', welcome: 'Welcome', briefing: 'Apollo 11 briefing', settings: 'Settings', sources: 'Scientific Sources & Credits' }

export default function App() {
  const screen = useAppStore((state) => state.screen)
  const navigate = useAppStore((state) => state.navigate)
  const reducedMotion = useAppStore((state) => state.preferences.reducedMotion)
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const restoreScreen = () => {
      const destination = window.location.hash.slice(1)
      if (destination in names) useAppStore.setState({ screen: destination as Screen })
      else if (!destination) useAppStore.setState({ screen: 'welcome' })
    }
    restoreScreen()
    window.addEventListener('popstate', restoreScreen)
    window.addEventListener('hashchange', restoreScreen)
    return () => { window.removeEventListener('popstate', restoreScreen); window.removeEventListener('hashchange', restoreScreen) }
  }, [])

  useEffect(() => {
    document.title = `${names[screen]} · Echoes of Exploration`
    heading.current?.focus()
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [screen])

  return <div className="app-shell font-sans" data-reduced-motion={reducedMotion}>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader />
    <main id="main" className={`main-content ${screen === 'welcome' ? 'welcome-layout' : ''}`}>
      {screen === 'welcome' ? <ExplorationHome heading={heading} /> : <section className={`interior-screen ${screen.startsWith('ingenuity') ? 'tone-rust' : screen.startsWith('near') ? 'tone-blue' : 'tone-gold'}`}>
        <button className="text-button back-button" onClick={() => navigate(screen.endsWith('-film') ? 'missions' : screen === 'near-inspection' ? 'near-briefing' : screen === 'near-briefing' ? 'missions' : screen === 'ingenuity-inspection' ? 'ingenuity-briefing' : screen === 'inspection' ? 'briefing' : screen === 'ingenuity-briefing' ? 'missions' : 'welcome')}>{screen.endsWith('-film') ? 'Back to missions' : screen === 'near-inspection' ? 'Back to briefing' : screen === 'near-briefing' ? 'Back to missions' : screen === 'ingenuity-inspection' || screen === 'inspection' ? '← Back to briefing' : screen === 'ingenuity-briefing' ? '← Back to missions' : '← Back to welcome'}</button>
        <p className="eyebrow">ECHOES OF EXPLORATION / {screen === 'briefing' ? 'CHAPTER 01' : 'FIELD NOTES'}</p>
        <h1 ref={heading} tabIndex={-1}>{screen === 'briefing' || screen === 'inspection' ? 'The Part That Stayed' : names[screen]}</h1>
        {screen === 'apollo-film' || screen === 'ingenuity-film' || screen === 'near-film' ? <Suspense fallback={<p role="status">Opening mission introduction.</p>}><MissionFilm missionId={screen === 'apollo-film'?'apollo-11':screen === 'near-film'?'near-shoemaker':'ingenuity'}/></Suspense> : screen === 'chronosphere' || screen === 'archive' || screen === 'journeys' || screen === 'explorer' ? <Suspense fallback={<p role="status">Opening exploration records.</p>}><Universe screen={screen}/></Suspense> : screen === 'near-briefing' ? <Suspense fallback={<p role="status">Opening NEAR records.</p>}><NearBriefing /></Suspense> : screen === 'near-inspection' ? <Suspense fallback={<p role="status">Opening Eros.</p>}><NearInspection /></Suspense> : screen === 'missions' ? <MissionSelection /> : screen === 'ingenuity-briefing' ? <Suspense fallback={<p role="status">Opening mission records.</p>}><IngenuityBriefing /></Suspense> : screen === 'ingenuity-inspection' ? <Suspense fallback={<p role="status">Opening the Martian surface.</p>}><IngenuityInspection /></Suspense> : screen === 'inspection' ? <Suspense fallback={<p role="status">Opening the lunar surface…</p>}><ApolloInspection /></Suspense> : screen === 'briefing' ? <Briefing /> : screen === 'settings' ? <Settings /> : <Sources />}
      </section>}
    </main>
    <footer className="site-footer"><div className="corner-brand"><strong>OBSERVE. READ. SOLVE.</strong><span>The missions ended. Their stories live on.</span></div><span>Independent educational project.<br />Not affiliated with or endorsed by NASA.</span></footer>
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
        <p className="central-question">Why did the Lunar Module need two stages?</p>
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
    <label className="setting-row"><span><strong>Sound preference</strong><small>Allow mission films to start unmuted. YouTube volume controls remain available. No browser narration is used.</small></span><input type="checkbox" checked={preferences.sound} onChange={(event) => setPreference('sound', event.target.checked)} /></label>
    <p role="status" className="storage-status">{warning ?? 'Preferences save automatically on this browser.'}</p>
  </div>
}

function Sources() {
  const navigate = useAppStore((state) => state.navigate)
  return <div className="sources-panel prose">
    <p>Primary references for Apollo and our scientific foundation. Ingenuity’s briefing and inspection include its complete mission reference, engineering records and NASA/JPL sources.</p>
    <button className="text-button" onClick={() => navigate('ingenuity-briefing')}>Read Ingenuity mission records</button><ul className="source-list">{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a><p>{source.purpose}</p></li>)}</ul>
    <div className="notice"><strong>Visuals & credits</strong><p>The homepage uses the existing NASA-supplied astronaut and Earth models. Lightweight preview images are rendered directly from the same project models with illustrative studio lighting; they are not mission photographs. The Apollo inspection uses the NASA/Michael D. Carbajal Lunar Module model, with original illustrative terrain. The Ingenuity model is credited to NASA/Brian E. Kumanchik. Each inspection includes its model credit and scientific sources. Mission films retain their original YouTube publisher credits.</p><p>Built with React, Vite, TypeScript, Tailwind CSS, Three.js, React Three Fiber, Drei, and Zustand. This independent project does not imply NASA endorsement.</p></div>
  </div>
}

function MissionSelection() {
  return <div className="mission-selection"><p>Three machines. Three stories. Choose the story you want to recover.</p><MissionShowcase selection /></div>
}
