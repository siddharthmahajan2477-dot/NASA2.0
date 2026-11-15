import type { MissionConfig } from './engine'

export const apolloMission: MissionConfig = {
  id: 'apollo-11',
  story: {
    label: 'APOLLO 11', accessibleName: 'Apollo', entryTitle: 'Find out why part of Eagle stayed.', entryText: 'Five investigations. Inspect the hardware, collect the records, and reconstruct the journey home.',
    conclusionTitle: 'They came home. Part of Eagle stayed.', conclusionLead: 'That was how it was meant to work.',
    conclusion: [
      "The descent stage had landed them safely and given the ascent stage a place to leave from. Its journey ended at Tranquility Base. The crew's did not.",
      'Armstrong and Aldrin carried samples back to Columbia. The experiments they deployed opened other ways to study the Moon: ground vibrations, and light returned to Earth.',
      'Decades later, an orbiting camera could still pick out the landing stage. A machine no longer flying, still part of the record.',
    ],
  }, title: 'The Part That Stayed',
  components: { 'ascent-stage': 'Ascent stage', 'descent-stage': 'Descent stage', 'descent-engine': 'Descent engine', 'landing-legs': 'Landing legs', ladder: 'Ladder' },
  sources: {
    engineering: { title: 'NASA · Lunar Module engineering', url: 'https://www.nasa.gov/history/apollos-lunar-module-bridged-technological-leap-to-the-moon/' },
    mission: { title: 'NASA · Apollo 11 mission overview', url: 'https://www.nasa.gov/history/apollo-11-mission-overview/' },
    gear: { title: 'NASA · Landing gear technical report', url: 'https://ntrs.nasa.gov/citations/19720018253' },
    ladder: { title: 'NASA · Lunar lander human factors, p. 6 (PDF)', url: 'https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-022-apollo-lunar-lander.pdf#page=6' },
    easep: { title: 'NASA · Apollo 11 surface experiments', url: 'https://www.nasa.gov/history/50-years-ago-one-small-step-one-giant-leap/' },
    kit: { title: 'NASA · Apollo 11 press kit (PDF)', url: 'https://science.nasa.gov/wp-content/uploads/2023/09/Apollo_11.pdf' },
    lroc: { title: 'NASA · Apollo 11 landing site, LROC', url: 'https://science.nasa.gov/resource/apollo-11-landing-site/' },
  },
  evidence: [
    { id: 'cabin', title: 'A cabin that could leave', inspectionId: 'ascent-stage', body: 'The upper stage carried the crew cabin and an engine of its own. After the surface stay, it took Armstrong and Aldrin back into lunar orbit to rendezvous with Columbia.', sourceIds: ['engineering', 'mission'] },
    { id: 'platform', title: 'A platform built to stay', inspectionId: 'descent-stage', body: 'The lower stage carried the landing engine, propellant and landing gear. It supported surface operations and served as the platform for liftoff. It did not have to accompany the crew back to orbit.', sourceIds: ['engineering', 'mission'] },
    { id: 'thrust', title: 'Slow down before touchdown', inspectionId: 'descent-engine', body: 'The throttleable descent engine supplied braking thrust during the landing approach. The crew could control the final descent and choose a safe touchdown area. This engine was separate from the ascent engine.', sourceIds: ['engineering'] },
    { id: 'support', title: 'Stay upright after touchdown', inspectionId: 'landing-legs', body: 'The landing gear was designed for energy absorption and stability. Four legs and their footpads supported the Lunar Module on the surface; they could not substitute for rocket thrust during descent.', sourceIds: ['gear', 'kit'] },
    { id: 'access', title: 'The route out of Eagle', inspectionId: 'ladder', body: 'The astronauts left through the forward hatch, crossed the small egress platform and climbed down the ladder on the forward landing leg. They reached its footpad before stepping onto the lunar soil.', sourceIds: ['kit', 'ladder'] },
    { id: 'gap', title: 'The missing last rung', inspectionId: 'ladder', body: 'The ladder stopped above the footpad. NASA allowed clearance for collapsible landing gear and uncertainty about the surface. Getting from the lowest rung to the footpad required crossing that gap.', sourceIds: ['ladder'] },
    { id: 'seismic', title: 'PSEP: listening to the Moon', body: 'The Passive Seismic Experiment Package measured ground vibrations, including signals used to investigate lunar seismic activity. It was one of the two basic EASEP experiments. Its sensors did not measure Earth–Moon distance.', sourceIds: ['easep', 'kit'], diagram: 'seismic' },
    { id: 'laser', title: 'LRRR: a return address for light', body: 'The Laser Ranging Retroreflector returned laser pulses sent from Earth. Timing the round trip enabled precise measurements of Earth–Moon distance. The reflector did not generate the laser beam.', sourceIds: ['easep', 'kit'], diagram: 'laser' },
    { id: 'package', title: 'A small science package', body: 'Apollo 11 carried EASEP, the Early Apollo Scientific Experiments Package: PSEP and LRRR were its two basic experiments. Later missions carried the expanded ALSEP. A separate solar-wind composition experiment also flew on Apollo 11. There was no lunar rover on this mission.', sourceIds: ['kit'] },
    { id: 'departure', title: 'A rendezvous, not a direct flight home', body: 'After landing and surface exploration, Eagle’s ascent stage lifted off. It rendezvoused and docked with Columbia in lunar orbit. Armstrong, Aldrin and the samples transferred to Columbia; the ascent stage was later jettisoned. The crew returned to Earth in Columbia’s command module.', sourceIds: ['mission'] },
    { id: 'later-view', title: 'One last look, decades later', body: 'Images from the Lunar Reconnaissance Orbiter Camera show the Apollo 11 descent stage and the trails left by the astronauts. The object left at the landing site was not the cabin that carried them back to orbit.', sourceIds: ['lroc'] },
  ],
  quests: [
    {
      id: 'two-halves', title: 'The Machine in Two Halves', opening: 'An odd shape, until you ask what each half had to do. Inspect the cabin and the landing platform. Then build a case for leaving one behind.',
      inspections: ['ascent-stage', 'descent-stage'], evidenceIds: ['cabin', 'platform'],
      tasks: [
        { kind: 'match', id: 'roles', prompt: 'Assign a job to each stage.', options: [{ id: 'return', label: 'Carry the crew back to lunar orbit' }, { id: 'land', label: 'Land, support the spacecraft and provide a liftoff platform' }], rows: [
          { id: 'upper', label: 'Upper ascent stage', correct: 'return', feedback: 'Look inside the upper-stage record: the crew cabin and ascent engine travelled together. Which job needs both?' },
          { id: 'lower', label: 'Lower descent stage', correct: 'land', feedback: 'The lower stage brought the landing engine and legs. Its job on the surface did not require it to return to orbit.' },
        ] },
        { kind: 'select', id: 'stage-proof', prompt: 'Attach the evidence that supports this division of jobs. Select both records.', options: [{ id: 'cabin', label: 'A cabin that could leave' }, { id: 'platform', label: 'A platform built to stay' }], correct: ['cabin', 'platform'], feedback: 'A two-part conclusion needs both records: the upper stage could fly away, and the lower stage had already done its landing job.' },
      ], hint: 'Follow the crew cabin. Then find the stage carrying the landing legs. They have different destinations after the surface stay.', success: 'The strange shape makes sense now: one stage for landing, another for leaving. The separation was a plan, not a failure.',
    },
    {
      id: 'landing', title: 'The Landing Problem', opening: 'Reaching the ground is only half the problem. Eagle also had to stay upright. Connect the hardware to the problem it solved.',
      inspections: ['descent-engine', 'landing-legs'], evidenceIds: ['thrust', 'support'],
      tasks: [{ kind: 'match', id: 'landing-links', prompt: 'Build the cause-and-effect chain. Match each challenge to the engineering response.', options: [
        { id: 'engine', label: 'Descent engine: controlled braking thrust' }, { id: 'gear', label: 'Landing gear: absorb energy and support a stable touchdown' }, { id: 'ascent', label: 'Ascent engine: return the crew to lunar orbit' },
      ], rows: [
        { id: 'slow', label: 'Reduce downward speed before contact', correct: 'engine', feedback: 'Footpads cannot brake a falling spacecraft in flight. Find the component that produces controllable thrust.' },
        { id: 'steady', label: 'Absorb landing energy and keep Eagle supported', correct: 'gear', feedback: 'Rocket thrust controlled the descent. Once the surface was reached, the landing gear supplied support and stability.' },
      ] }], hint: 'Separate the two moments: before contact, then at touchdown. A rocket and a landing leg solve different problems.', success: 'A controlled descent got Eagle down. The landing gear made touchdown a place the crew could work from.',
    },
    {
      id: 'first-step', title: 'The First Step', opening: 'There was no staircase to the soil. Look closely at the hatch, platform and ladder, then reconstruct the route.',
      inspections: ['ladder'], evidenceIds: ['access', 'gap'],
      tasks: [
        { kind: 'sequence', id: 'path', prompt: 'Rebuild the outward route. Move each location into order using the arrows.', items: [{ id: 'soil', label: 'Lunar soil' }, { id: 'ladder', label: 'Forward-leg ladder' }, { id: 'cabin', label: 'Cabin and forward hatch' }, { id: 'footpad', label: 'Landing footpad' }, { id: 'platform', label: 'Egress platform' }], correct: ['cabin', 'platform', 'ladder', 'footpad', 'soil'], feedback: 'Start inside the cabin. The hatch opens onto a platform above the ladder. The footpad comes before the soil.' },
        { kind: 'match', id: 'clearance', prompt: 'Explain the gap visible below the ladder.', options: [{ id: 'clearance', label: 'Clearance for landing-gear compression and an uncertain surface' }, { id: 'missing', label: 'An accidental missing rung discovered after landing' }], rows: [{ id: 'gap', label: 'Why did the ladder stop above the footpad?', correct: 'clearance', feedback: 'The gap was allowed for in the design. Read the NASA human-factors record before treating it as damage.' }] },
      ], hint: 'Trace downward from the small platform under the hatch. The ladder does not end on the soil; a footpad is still in the way.', success: 'Cabin, platform, ladder, footpad, soil. Even the first step depended on the shape of the machine that brought them there.',
    },
    {
      id: 'science', title: 'The Science That Stayed', opening: 'The crew had little time outside. Two small experiments gave the visit a longer scientific reach. Work out which questions each could answer.',
      inspections: [], evidenceIds: ['seismic', 'laser', 'package'],
      tasks: [
        { kind: 'match', id: 'science-links', prompt: 'Connect each instrument to the scientific question its measurement addresses.', options: [{ id: 'vibrations', label: 'What can ground vibrations reveal about lunar seismic activity?' }, { id: 'distance', label: 'How far is the Moon from Earth, using timed laser pulses?' }], rows: [
          { id: 'psep', label: 'PSEP · Passive Seismic Experiment Package', correct: 'vibrations', feedback: 'A seismometer responds to ground motion. It cannot time a laser pulse travelling from Earth.' },
          { id: 'lrrr', label: 'LRRR · Laser Ranging Retroreflector', correct: 'distance', feedback: 'A retroreflector sends incoming light back toward its source. Earth stations time that return to measure distance.' },
        ] },
        { kind: 'select', id: 'easep-manifest', prompt: 'Build the two-experiment EASEP manifest. Leave later or separate equipment out.', options: [{ id: 'psep', label: 'PSEP' }, { id: 'lrrr', label: 'LRRR' }, { id: 'alsep', label: 'Later expanded ALSEP configuration' }, { id: 'rover', label: 'Lunar rover' }, { id: 'swc', label: 'Separate solar-wind composition experiment' }], correct: ['psep', 'lrrr'], feedback: 'The two basic EASEP experiments were PSEP and LRRR. Solar-wind composition was separate; the expanded ALSEP and lunar rover do not belong in this Apollo 11 manifest.' },
      ], hint: 'One instrument listened for motion. The other returned light. EASEP was the small Apollo 11 package, not the later expanded ALSEP.', success: 'One listened to the ground. One returned light to Earth. Neither needed a seat on the journey home.',
    },
    {
      id: 'stayed', title: 'The Part That Stayed', opening: 'You have the engineering records. Now connect the whole journey—and check what a later spacecraft saw at the landing site.',
      inspections: [], evidenceIds: ['departure', 'later-view'],
      tasks: [
        { kind: 'sequence', id: 'history', prompt: 'Reconstruct the final mission sequence. This is an event diagram, not an animation of separated model parts.', items: [{ id: 'rendezvous', label: 'Rendezvous with Columbia; crew and samples transfer' }, { id: 'return', label: 'Crew returns to Earth in Columbia’s command module' }, { id: 'surface', label: 'Surface exploration and science deployment' }, { id: 'landing', label: 'Eagle lands on the Moon' }, { id: 'ascent', label: 'Ascent stage departs the surface' }], correct: ['landing', 'surface', 'ascent', 'rendezvous', 'return'], feedback: 'The crew had to leave the surface before meeting Columbia, and meet Columbia before returning to Earth. The descent stage did not make either trip.' },
        { kind: 'select', id: 'surface-record', prompt: 'Identify the investigated hardware left at the surface. Choose all that apply.', options: [{ id: 'descent', label: 'Descent stage and its landing gear' }, { id: 'psep', label: 'Deployed PSEP' }, { id: 'lrrr', label: 'Deployed LRRR' }, { id: 'ascent', label: 'Ascent-stage crew cabin' }, { id: 'columbia', label: 'Columbia command module' }], correct: ['descent', 'psep', 'lrrr'], feedback: 'The descent stage and deployed experiments stayed. The cabin lifted off; Columbia was the crew’s ride home. This list covers the investigated hardware, not every object left behind.' },
        { kind: 'match', id: 'conclusion', prompt: 'Complete the engineering explanation.', options: [{ id: 'finished', label: 'Its landing job was finished; the separate ascent stage carried the crew to orbit' }, { id: 'broken', label: 'A breakdown forced the crew to abandon a stage that was meant to return' }], rows: [{ id: 'why', label: 'Why was the descent stage left behind?', correct: 'finished', feedback: 'The two-stage design was intentional. Link the first investigation to the departure record rather than inventing a breakdown.' }] },
        { kind: 'select', id: 'final-proof', prompt: 'Support that conclusion with the engineering, departure and later-observation records.', options: [{ id: 'platform', label: 'A platform built to stay' }, { id: 'departure', label: 'A rendezvous, not a direct flight home' }, { id: 'later-view', label: 'One last look, decades later' }, { id: 'gap', label: 'The missing last rung' }], correct: ['platform', 'departure', 'later-view'], feedback: 'Use the platform record for design intent, the rendezvous record for what left, and the LROC record for what remained. The ladder gap explains access, not stage separation.' },
      ], hint: 'Follow the people home, then follow the hardware that did not go with them. The later LROC observation is an independent check on the landing site.', success: 'The descent stage stayed because the design worked. The crew could leave the landing hardware behind and carry their discoveries home.',
    },
  ],
}
