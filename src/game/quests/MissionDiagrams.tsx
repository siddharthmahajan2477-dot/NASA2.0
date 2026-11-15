export function TerrainObservation({ kind }: { kind: 'textured' | 'blank' | 'slope' }) {
  return <svg className="terrain-observation" viewBox="0 0 240 100" role="img" aria-label={kind === 'textured' ? 'Illustrative flat ground with separated, recognizable pebbles' : kind === 'blank' ? 'Illustrative smooth ground with few distinct visible features' : 'Illustrative steep sand ripples with repeating ridges'}>
    <rect width="240" height="100" fill="#795846" />
    {kind === 'textured' ? <>{[[25, 22], [85, 65], [123, 30], [187, 75], [210, 24], [48, 81]].map(([x, y], i) => <path key={x} d={'M' + x + ' ' + y + 'l' + (8 + i) + ' -4 6 8 -13 5z'} fill="#c6a487" stroke="#392f2a" />)}<path d="M25 22l9 8m89 0 8 8m55 38 8 8" stroke="#ecdbad" strokeWidth="2" /></> : kind === 'slope' ? <>{[15, 50, 85].map((y) => <path key={y} d={'M0 ' + y + ' Q80 ' + (y - 30) + ' 240 ' + (y + 10)} fill="none" stroke="#b28e6d" strokeWidth="9" />)}</> : <path d="M0 85Q100 73 240 80" fill="none" stroke="#83614b" strokeWidth="4" />}
  </svg>
}

export function EngineeringDiagram({ kind }: { kind: 'rotors' | 'energy' }) {
  return <figure className="science-diagram"><svg viewBox="0 0 360 145" role="img" aria-label={kind === 'rotors' ? 'Illustrative lift diagram: two stacked rotors turn in opposite directions; lift acts upward and weight downward.' : 'Illustrative energy path: sunlight charges the battery, which supplies heaters, electronics and flight motors.'}>
    {kind === 'rotors' ? <><path d="M180 40v65M60 60h240M85 82h190" stroke="#bfced0" strokeWidth="4" /><path d="M180 32V8l-6 8m6-8 6 8M180 111v25l-6-8m6 8 6-8M70 43q100-35 220 0l-8-13m8 13-16 2M85 98q95 28 190 0l-7 13m7-13-16-2" stroke="#eccca0" fill="none" strokeWidth="2" /><text x="196" y="19">Lift</text><text x="196" y="135">Weight</text><text x="8" y="128">Opposite rotation</text></> : <><rect x="11" y="40" width="75" height="42" /><rect x="126" y="40" width="85" height="42" /><path d="M87 61h37m88 0h35M247 22v80m0-80h30m-30 40h30m-30 40h30" fill="none" stroke="#e2bd91" strokeWidth="2" /><text x="16" y="65">Sunlight</text><text x="136" y="65">Battery</text><text x="280" y="26">Heaters</text><text x="260" y="66">Electronics</text><text x="280" y="106">Motors</text></>}
  </svg><figcaption>Illustrative engineering diagram. Not to scale; no flight telemetry or numerical simulation.</figcaption></figure>
}
