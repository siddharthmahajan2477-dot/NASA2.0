import type { EvidenceRecord, RecordSection } from '../game/quests/engine'

export const ingenuitySources = {
  overview: { title: 'NASA · Ingenuity mission and timeline', url: 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/' },
  model: { title: 'NASA/Brian E. Kumanchik · Ingenuity 3D model', url: 'https://science.nasa.gov/3d-resources/ingenuity-mars-helicopter/' },
  spacecraft: { title: 'NASA/JPL · Spacecraft engineering', url: 'https://www.jpl.nasa.gov/news/press_kits/mars_2020/ingenuity/landing/mission/spacecraft/' },
  introduction: { title: 'NASA/JPL · Original demonstration objectives', url: 'https://www.jpl.nasa.gov/news/press_kits/ingenuity/landing/' },
  first: { title: 'NASA · Historic first flight, April 19, 2021', url: 'https://www.nasa.gov/news-release/nasas-ingenuity-mars-helicopter-succeeds-in-historic-first-flight/' },
  cold: { title: 'NASA · It’s Cold on Mars, April 2, 2021', url: 'https://science.nasa.gov/blog/its-cold-on-mars/' },
  night: { title: 'NASA · Surviving the first night alone', url: 'https://www.nasa.gov/solar-system/nasas-mars-helicopter-survives-first-cold-martian-night-on-its-own/' },
  solar: { title: 'NASA · Solar array and stored energy', url: 'https://science.nasa.gov/resource/mars-helicopters-solar-array-as-seen-by-perseverances-mastcam-z/' },
  control: { title: 'NASA · Flight control and aerodynamic performance', url: 'https://science.nasa.gov/blog/what-were-learning-about-ingenuitys-flight-control-and-aerodynamic-performance/' },
  operations: { title: 'NASA · From test flights to aerial scouting', url: 'https://www.nasa.gov/solar-system/planets/mars/nasas-ingenuity-mars-helicopter-reaches-a-total-of-30-minutes-aloft/' },
  legacy: { title: 'NASA · The legacy of Ingenuity', url: 'https://science.nasa.gov/resource/the-legacy-of-ingenuity-the-frontier-of-extraterrestrial-flight/' },
  numbers: { title: 'NASA · Ingenuity by the numbers', url: 'https://science.nasa.gov/resource/ingenuity-mars-helicopter-by-the-numbers/' },
  finalStatus: { title: 'NASA/JPL · Flight 72 status, January 19, 2024', url: 'https://science.nasa.gov/blog/flight-72-status-update/' },
  investigation: { title: 'NASA · Accident investigation, December 11, 2024', url: 'https://www.nasa.gov/missions/mars-2020-perseverance/ingenuity-helicopter/nasa-performs-first-aircraft-accident-investigation-on-another-world/' },
  ending: { title: 'NASA · End of flight mission, January 25, 2024', url: 'https://www.nasa.gov/news-release/after-three-years-on-mars-nasas-ingenuity-helicopter-mission-ends/' },
  log: { title: 'NASA · Completed flight log (PDF)', url: 'https://science.nasa.gov/wp-content/uploads/2024/06/ingenuity-helicopter-flight-log.pdf' },
}

// Narration-ready sections are independent of quest state and 3D objects.
// All records remain readable in the mission reference, regardless of unlocks.
export const ingenuityEvidence: EvidenceRecord[] = [
  {
    id: 'original-plan', title: 'An experiment with five flights', inspectionId: 'fuselage', sourceIds: ['introduction', 'spacecraft'],
    context: 'Before the first flight · technology demonstration',
    body: 'Ingenuity was sent to test powered, controlled flight on Mars. Up to five experimental flights were planned in a 30-day demonstration window. It was not a miniature version of Perseverance’s science laboratory.',
    sections: [{ heading: 'What counted as a useful result?', body: 'Engineers needed evidence that a very light aircraft could take off, stay under control and land in the Martian atmosphere. Even a short flight would test a capability that had never been demonstrated on another planet.' }, { heading: 'Equipment and purpose', body: 'The helicopter carried cameras, computers and sensors for flight and engineering observations, rather than a dedicated scientific instrument payload. Its small housing had to fit those systems alongside batteries and heaters.' }],
    relevance: 'Judge the original mission against what it was designed to prove, rather than assuming it had a rover’s job.',
  },
  {
    id: 'arrival', title: 'From a rover’s belly to open sky', sourceIds: ['overview', 'first', 'night'],
    context: 'February–April 2021 · arrival and deployment',
    body: 'Ingenuity arrived at Jezero Crater beneath Perseverance on February 18, 2021. It was deployed onto the surface on April 3. After surviving on its own, it first flew on April 19.',
    sections: [{ heading: 'The first flight', body: 'The autonomous test rose to about 3 metres, hovered, then landed. The flight lasted 39.1 seconds. The short journey answered a large engineering question: controlled powered flight on another planet was possible.' }],
    relevance: 'Arrival, deployment and flight were separate achievements. A helicopter still attached to a rover had not yet proved it could fly.',
  },
  {
    id: 'thin-air', title: 'Less air, less lift', sourceIds: ['introduction'], diagram: 'rotors',
    context: 'Flight environment · qualitative engineering explanation',
    body: 'Mars has roughly one percent of Earth’s atmospheric density near the surface. Rotors have much less air to push against. Lower gravity reduces the aircraft’s weight, but does not remove the need to generate lift.',
    sections: [{ heading: 'A linked design problem', body: 'Large, rapidly turning blades and a lightweight vehicle help address the thin atmosphere. These choices work together. Lower gravity helps; it does not make a heavy vehicle with small, slow blades a safe substitute.' }],
    relevance: 'The diagram shows relationships, not a calculator for real flight performance. No numerical flight physics is simulated.',
  },
  {
    id: 'rotor-control', title: 'Two rotors, opposite directions', inspectionId: 'rotors', sourceIds: ['spacecraft', 'control'],
    context: 'Rotor system · lift and control',
    body: 'Two stacked rotors turn in opposite directions. Their opposing torques help prevent the body from simply spinning the other way. The blades are carbon-fibre structures, not solid heavy metal paddles.',
    sections: [{ heading: 'Control is more than speed', body: 'Ingenuity controls flight by adjusting blade pitch: the angle at which blades meet the air. That changes lift and allows control of the aircraft. It is misleading to treat it as a consumer drone controlled only by changing motor speeds.' }],
    relevance: 'Lift, torque and control solve different parts of the flight problem. The static model shows the engineering arrangement, not a running rotor simulation.',
  },
  {
    id: 'sunlight', title: 'Daylight has another job', inspectionId: 'solar-panel', sourceIds: ['solar'], diagram: 'energy',
    context: 'Power system · energy must last beyond a flight',
    body: 'The solar array above the rotors charges the lithium-ion battery system. Stored energy powers flight, electronics and heaters. Sunlight is a source; the battery stores energy for use when the panel is not producing it.',
    sections: [{ heading: 'One supply, several demands', body: 'A flight and a cold night draw on the same stored resource. A useful planning strategy protects essential systems and checks the battery’s condition before committing energy to another flight. This is qualitative reasoning, not a historical power-allocation schedule.' }],
    relevance: 'A successful landing still leaves the helicopter with an energy problem to solve.',
  },
  {
    id: 'night-survival', title: 'Landing was not the end of the day', inspectionId: 'fuselage', sourceIds: ['night', 'cold'],
    context: 'April 2021 · surviving without rover-supplied power',
    body: 'After deployment, Ingenuity had to supply its own heater from its own battery. Insulation and heaters protected temperature-sensitive parts inside. The team checked overnight survival and recharging before flight preparations continued.',
    sections: [{ heading: 'Why the rover moved', body: 'Perseverance moved clear so sunlight could reach the helicopter’s panel. The rover no longer supplied power through the old physical connection. Ingenuity needed to recharge and manage its own heat.' }, { heading: 'A careful trade-off', body: 'Keeping the interior warmer consumes energy. Turning off essential protection to maximise flying time is not a sound survival strategy. Flight preparation also depends on temperatures and available charge.' }],
    relevance: '“It landed” and “it can survive until tomorrow” are different conclusions. Neither should be assumed from the other.',
  },
  {
    id: 'autonomy', title: 'Instructions travel. Reflexes stay onboard.', inspectionId: 'fuselage', sourceIds: ['first', 'control'],
    context: 'Flight operations · planning from Earth',
    body: 'Earth teams planned flights and sent instructions. During flight, onboard software combined sensor information and controlled the helicopter. Communication delays ruled out an Earth operator making immediate joystick corrections.',
    sections: [{ heading: 'A plan is not a remote pilot', body: 'People chose objectives and reviewed results, while the aircraft handled the rapid control decisions needed during flight. This division of work allowed a carefully prepared route to be flown without a live human pilot at Mars.' }],
    relevance: 'The planning challenge here is an educational example. You are not piloting a historical flight or viewing real telemetry.',
  },
  {
    id: 'navigation', title: 'The ground becomes a reference', sourceIds: ['spacecraft', 'investigation'],
    context: 'Visual navigation · observations and estimation',
    body: 'A downward-facing navigation camera tracked visible surface features between images. Together with other sensors, those observations helped estimate motion. Distinct features on relatively flat ground are easier to follow than smooth, repetitive sand.',
    sections: [{ heading: 'Reading the illustrative observations', body: 'A cluster of separated pebbles gives recognizable points that can be compared between frames. A blank patch offers few points. Steep, repeating ripples also challenge assumptions about the ground. Texture alone does not prove that terrain is safe to land on.' }],
    relevance: 'The three observation drawings are invented teaching diagrams, not NASA flight images. No precise camera lens is identified by a hotspot in this model.',
  },
  {
    id: 'operations-demo', title: 'A new job after five', sourceIds: ['operations', 'legacy'],
    context: 'After the demonstration · operations and scouting',
    body: 'After the initial five flights, the mission moved into an operations demonstration. Ingenuity explored how an aerial viewpoint could help rover planning, including observations of terrain that was hard to assess from ground level.',
    sections: [{ heading: 'What changed?', body: 'The technology demonstration asked whether flight worked. Continued operations asked how flight could contribute to exploration. Aerial images could inform choices about routes and interesting areas, while further flights supplied engineering experience.' }],
    relevance: 'A broader role did not turn Ingenuity into a rover, a sample collector or a laboratory with new science instruments.',
  },
  {
    id: 'seventy-two', title: 'The plan and the record', sourceIds: ['numbers', 'overview', 'log'],
    context: 'Mission record · completed flights, not promised ones',
    body: 'The original demonstration planned up to five flights. Ingenuity completed 72 across nearly three years. NASA records more than two hours of total flight time and a maximum altitude of about 24 metres.',
    sections: [{ heading: 'Useful milestones', body: 'The first flight was April 19, 2021. The fifth flight on May 7 completed the initial flight series. NASA marks the fiftieth flight on April 13, 2023. The last was January 18, 2024. These are flight-history milestones, not stages of an animated simulation.' }],
    relevance: 'Longevity matters because repeated operations test hardware, procedures and assumptions over time—not because a larger number automatically answers every scientific question.',
  },
  {
    id: 'final-flight', title: 'A short hop to check the aircraft', sourceIds: ['finalStatus', 'log', 'investigation'],
    context: 'January 18, 2024 · Flight 72',
    body: 'Flight 72 was intended as a brief vertical flight to check systems and photograph the area after the preceding flight ended early. Ingenuity climbed to its planned height and began descending. Communications were lost near the end of the flight.',
    sections: [{ heading: 'Read a status report in its time', body: 'The January 19 report described what was known immediately afterward. It was not yet the completed accident investigation. Later evidence and analysis changed what engineers could reasonably explain.' }],
    relevance: 'A report written just after an event and a later investigation answer different questions.',
  },
  {
    id: 'damage-evidence', title: 'What the pictures established', sourceIds: ['ending', 'investigation'],
    context: 'After Flight 72 · observed damage',
    body: 'Communications were reestablished the following day. Later imagery showed rotor-blade damage that ended Ingenuity’s ability to fly. The images establish damage; they do not provide a complete eyewitness view of touchdown.',
    sections: [{ heading: 'Keep observation separate from explanation', body: 'An image of a damaged blade is direct evidence of its condition. Describing the exact motions and loads that produced it requires a reconstruction using the available flight data and engineering analysis.' }],
    relevance: 'The 3D model remains an intact engineering visualization. It is not a reconstruction of the damaged aircraft after Flight 72.',
  },
  {
    id: 'likely-scenario', title: 'A most-likely explanation', sourceIds: ['investigation'],
    context: 'December 11, 2024 · later accident-investigation account',
    body: 'NASA’s investigation linked too few trackable surface features to unreliable motion estimates. Its most-likely scenario involved excessive horizontal motion, a hard impact on a sand-ripple slope, rapid changes in attitude and damaging rotor loads.',
    sections: [{ heading: 'The limit of the evidence', body: 'Engineers considered multiple viable scenarios. The available data supported a most-likely account, not certainty about every motion. Testing navigation over a broader range of terrain and improving robustness are sensible lessons from this case.' }],
    relevance: 'State which parts are observed and which are inferred. An honest uncertainty statement is part of a good engineering explanation.',
  },
]

export interface MissionReferenceData { title: string; sections: (RecordSection & { id: string; sourceIds: string[] })[]; timeline: { date: string; event: string; sourceIds: string[] }[] }
export const ingenuityReference: MissionReferenceData = {
  title: 'Ingenuity mission reference',
  sections: [
    { id: 'objectives', heading: 'Mission objectives', body: 'The original objective was to demonstrate powered, controlled flight in the Martian atmosphere. The planned five-flight experiment grew into operations demonstrations and further engineering tests. Its cameras supplied navigation observations and aerial imagery; it did not carry a Perseverance-style scientific instrument payload.', sourceIds: ['introduction', 'legacy'] },
    { id: 'engineering', heading: 'Spacecraft engineering', body: 'The vehicle combined counter-rotating carbon-fibre rotors, an array above them, a compact electronics housing and four landing legs. Onboard computers, sensors, batteries and heaters supported autonomous flight and survival. Inspect the model for the visible arrangement, then read the individual engineering records below for the underlying systems.', sourceIds: ['spacecraft'] },
    { id: 'teams', heading: 'People and collaborating teams', body: 'JPL led system architecture and development, built the fuselage and integrated the aircraft. AeroVironment built the rotor system, landing gear and solar-panel substrate; SolAero integrated the panel. NASA Ames and Langley contributed rotorcraft analysis. MiMi Aung was project manager during the first-flight period. NASA’s December 2024 account identifies Teddy Tzanetos as project manager and Håvard Grip as Ingenuity’s first pilot. These are historical roles, not a current personnel directory.', sourceIds: ['spacecraft', 'night', 'investigation'] },
    { id: 'achievements', heading: 'Achievements and historical significance', body: 'Ingenuity demonstrated a new way of exploring another planet. Its flight record exceeded the initial plan and its imagery added an aerial viewpoint to rover exploration. Its primary contribution was technology and operations knowledge, alongside useful reconnaissance—not the discovery of life or the collection of samples.', sourceIds: ['legacy', 'numbers'] },
    { id: 'challenges', heading: 'Operational challenges', body: 'Thin air made lift difficult. Nights required energy and thermal protection. Interplanetary communications made onboard control essential. Visual navigation relied on useful ground features. The evidence records explain how each challenge influenced design or operations; no single engineering choice solved all of them.', sourceIds: ['introduction', 'cold', 'control', 'investigation'] },
    { id: 'conclusion', heading: 'Mission conclusion and legacy', body: 'Flight 72 on January 18, 2024 was the final flight. NASA announced the end of the flight mission on January 25. A later investigation described the most-likely accident sequence while acknowledging uncertainty. The flight data, operational experience and limits that engineers identified remain useful for designing future aerial explorers.', sourceIds: ['ending', 'investigation', 'legacy'] },
    { id: 'credits', heading: 'Sources, reconstruction and credits', body: 'Spacecraft model: NASA/Brian E. Kumanchik. The intact NASA model, original procedural terrain and original teaching diagrams illustrate engineering concepts. The terrain is not surveyed Jezero topography. Diagrams are not real flight telemetry. No historical quotations, generated mission-control conversations or fabricated NASA photographs are used. This independent project is not affiliated with or endorsed by NASA.', sourceIds: ['model'] },
  ],
  timeline: [
    { date: 'July 30, 2020', event: 'Launch with the Mars 2020 mission.', sourceIds: ['overview'] },
    { date: 'February 18, 2021', event: 'Arrival at Jezero Crater beneath Perseverance.', sourceIds: ['overview'] },
    { date: 'April 3, 2021', event: 'Deployment onto the Martian surface.', sourceIds: ['night'] },
    { date: 'April 4, 2021', event: 'First independent night survived.', sourceIds: ['overview', 'night'] },
    { date: 'April 19, 2021', event: 'First powered, controlled flight on another planet.', sourceIds: ['first'] },
    { date: 'May 7, 2021', event: 'Fifth flight completes the initial demonstration series.', sourceIds: ['overview', 'operations'] },
    { date: 'April 13, 2023', event: 'Fiftieth flight.', sourceIds: ['overview'] },
    { date: 'January 18, 2024', event: 'Flight 72: the final flight.', sourceIds: ['finalStatus', 'log'] },
    { date: 'January 25, 2024', event: 'NASA announces the end of the flight mission.', sourceIds: ['ending'] },
    { date: 'December 11, 2024', event: 'NASA describes the accident investigation’s most-likely scenario.', sourceIds: ['investigation'] },
  ],
}
