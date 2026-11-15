export interface FilmChoice {
  id: string
  label: string
  youtubeId: string | null
  title: string
  creator: string
  creatorUrl: string
  context: string
}
export interface MissionFilm {
  id: string
  title: string
  introduction: string
  source: string
  defaultFilm: string
  films: FilmChoice[]
}
// Titles, creators and iframe URLs checked against YouTube's official oEmbed
// endpoint on 2026-11-15. oEmbed is not a guarantee of playback in every browser.
export const missionFilms: Record<string, MissionFilm> = {
  'apollo-11': {
    id: 'apollo-11', title: 'Apollo 11 - The Part That Stayed',
    introduction: 'Three people set out for the Moon. Two reached its surface. Follow the engineering that brought all three home.',
    source: 'https://www.nasa.gov/history/apollo-11-mission-overview/', defaultFilm: 'featured',
    films: [
      { id: 'featured', label: 'Featured Film', youtubeId: 'DWm3mywDMrM',
        title: 'Apollo 11 | 3D Animated Short Film Made in Blender',
        creator: 'Paweł Chądzyński', creatorUrl: 'https://www.youtube.com/@pawel_chadzynski',
        context: 'An independently created Apollo 11 animation. Artistic reconstruction, not archival flight footage or a NASA production.' },
      { id: 'journey', label: 'Full Mission Journey', youtubeId: 'JcvMAL_lTHU',
        title: 'Apollo 11 Moon Landing - 8 days in 5 minutes - 4K',
        creator: 'Anim Mate', creatorUrl: 'https://www.youtube.com/@Anim_Mate',
        context: 'An independently created animated overview of Apollo 11. The title is the creator’s; playback quality depends on YouTube, your connection and device.' },
    ],
  },
  ingenuity: {
    id: 'ingenuity', title: 'Ingenuity - Seventy-Two Flights',
    introduction: 'Five flights were the plan. A small helicopter opened another way to explore Mars.',
    source: 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/', defaultFilm: 'legacy',
    films: [{ id: 'legacy', label: 'Mission Film', youtubeId: 'qMbHE_VXI-8',
      title: 'Legacy of NASA’s Ingenuity Mars Helicopter', creator: 'NASA Jet Propulsion Laboratory',
      creatorUrl: 'https://www.youtube.com/@NASAJPL', context: 'NASA/JPL’s video about the Mars helicopter and its legacy.' }],
  },
  'near-shoemaker': {
    id: 'near-shoemaker', title: 'NEAR Shoemaker - The Landing Nobody Designed For',
    introduction: 'It was built to study a moving rock from orbit. The team chose to bring it down. Then the signal kept coming.',
    source: 'https://science.nasa.gov/mission/near-shoemaker/', defaultFilm: 'descent',
    films: [{ id: 'descent', label: 'Mission Film', youtubeId: 'CFUmUIU_tXY',
      title: 'NEAR Descent Animation', creator: 'NASA Solar System', creatorUrl: 'https://www.youtube.com/@NASASolarSystem',
      context: 'A NASA animation of NEAR’s deliberately planned descent. Animation is a visual explanation, not recorded descent footage.' }],
  },
}

export function youtubeWatchUrl(id: string) { return `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` }
export function youtubeEmbedUrl(id: string, muted: boolean) {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=0&controls=1&playsinline=1&fs=1&rel=0&mute=${muted ? 1 : 0}`
}
