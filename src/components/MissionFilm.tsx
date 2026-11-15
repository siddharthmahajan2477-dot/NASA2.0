import { useState } from 'react'
import { missionFilms, youtubeEmbedUrl, youtubeWatchUrl, type MissionFilm as FilmConfig } from '../data/missionFilms'
import { useAppStore, type Screen } from '../app/store'
const destinations: Record<string, Screen> = { 'apollo-11': 'briefing', ingenuity: 'ingenuity-briefing', 'near-shoemaker': 'near-briefing' }

// A keyed child isolates film selection and destroys playback on mission changes.
export default function MissionFilm({ missionId }: { missionId: string }) {
  return <FilmPage key={missionId} film={missionFilms[missionId]} />
}
function FilmPage({ film }: { film: FilmConfig }) {
  const navigate = useAppStore(s => s.navigate), sound = useAppStore(s => s.preferences.sound)
  const [selected, setSelected] = useState(film.defaultFilm)
  const [watching, setWatching] = useState(false), [failed, setFailed] = useState(false), [replay, setReplay] = useState(0)
  const choice = film.films.find(f => f.id === selected) ?? film.films[0]
  const videoId = choice?.youtubeId
  const available = typeof videoId === 'string' && /^[A-Za-z0-9_-]{11}$/.test(videoId)
  function select(id: string) { setWatching(false); setFailed(false); setSelected(id) }
  function watch() { setFailed(false); setReplay(n => n + 1); setWatching(true) }
  return <section className="mission-film" aria-label="Optional mission film">
    <p className="eyebrow">MISSION FILM / OPTIONAL INTRODUCTION</p><h2>{film.title}</h2><p className="lead">{film.introduction}</p>
    {film.films.length > 1 && <div className="film-choices" role="group" aria-label="Apollo film choices">
      {film.films.map(f => <button key={f.id} aria-pressed={f.id === choice?.id} onClick={() => select(f.id)}>{f.label}</button>)}
    </div>}
    {choice && <article className="film-description" aria-live="polite"><h3>{choice.title}</h3><p>Video by <a href={choice.creatorUrl} target="_blank" rel="noopener noreferrer">{choice.creator}</a></p><p>{choice.context}</p></article>}
    {available && !failed ? <>
      {!watching ? <div className="film-empty"><p>The film loads only when you choose to watch. Watching is never required.</p><button className="primary-button" onClick={watch}>Watch Film</button></div> : <>
        <div className="film-player"><iframe key={`${choice.id}:${replay}`} title={choice.title}
          src={youtubeEmbedUrl(videoId, !sound)} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin" onError={() => { setWatching(false); setFailed(true) }} /></div>
        <div className="film-actions"><button onClick={watch}>Watch Again</button><button onClick={() => setWatching(false)}>Stop Film</button><button onClick={() => { setWatching(false); setFailed(true) }}>Video unavailable?</button></div>
      </>}
    </> : <div className="film-empty" role="status"><p>{available ? 'YouTube playback may be blocked or unavailable. Try the direct link, or continue your mission.' : 'This film is not currently configured for playback. Your mission is ready to explore.'}</p>{available && <button onClick={watch}>Retry Film</button>}</div>}
    {videoId && <p><a href={youtubeWatchUrl(videoId)} target="_blank" rel="noopener noreferrer">Watch on YouTube</a></p>}
    <p className="film-privacy">Optional YouTube player, using the privacy-enhanced domain. YouTube still processes playback-related data. Its native controls provide play, pause, seek, volume and fullscreen where supported. Playback restrictions may appear inside the player; the app cannot detect every iframe failure.</p>
    <div className="welcome-actions"><button className="primary-button" onClick={() => navigate(destinations[film.id])}>Continue to Mission</button><button className="text-button" onClick={() => navigate(destinations[film.id])}>Skip to Mission</button></div>
    <a href={film.source} target="_blank" rel="noopener noreferrer">Official mission history &amp; sources</a>
    <p>Videos remain hosted by their original YouTube publishers. Credits and rights remain with their respective creators. Independent educational project. Not affiliated with or endorsed by NASA.</p>
  </section>
}
