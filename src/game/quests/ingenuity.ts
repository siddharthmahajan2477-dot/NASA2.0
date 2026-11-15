import type { MissionConfig } from './engine'
import { ingenuityEvidence, ingenuitySources } from '../../data/ingenuityRecords'

export const ingenuityMission: MissionConfig = {
  id: 'ingenuity', title: 'Ingenuity — Seventy-Two Flights',
  components: { rotors: 'Counter-rotating rotors', 'solar-panel': 'Solar panel', fuselage: 'Electronics housing', 'landing-legs': 'Landing legs' },
  sources: ingenuitySources, evidence: ingenuityEvidence,
  story: {
    label: 'INGENUITY', accessibleName: 'Ingenuity', entryTitle: 'Find out how five flights became seventy-two.',
    entryText: 'Six investigations. Follow the flight experiment from its first night alone to the evidence from its final landing.',
    conclusionTitle: 'Seventy-two flights. A new way to explore.', conclusionLead: 'Five were the plan. The rest changed what engineers could ask for next.',
    conclusion: [
      'The first question was whether a small helicopter could fly on Mars at all. You followed the air, the energy and the decisions that made the answer possible.',
      'Ingenuity went on to offer another view of the ground: one that could help a rover team decide where to look and how to get there. The experiment had become useful in ways a short first hop could only suggest.',
      'The final flight left damaged blades and an incomplete view of the landing. Engineers built the best explanation the evidence allowed, and kept the uncertainty visible. That is part of the work, too.',
      'Ingenuity will not take off again. The next aircraft can still learn from every flight it made.',
    ],
  },
  quests: [
    {
      id: 'five-flight-gamble', title: 'The Five-Flight Gamble',
      opening: 'Start beneath the rotors. This small box had to do something no aircraft had done before—and live long enough to try.',
      inspections: ['fuselage'], evidenceIds: ['original-plan', 'arrival'],
      tasks: [
        { kind: 'sequence', id: 'arrival-order', prompt: 'Reconstruct the steps from arrival to the first flight.', items: [{ id: 'flight', label: 'First autonomous flight — April 19, 2021' }, { id: 'deploy', label: 'Deploy from Perseverance — April 3, 2021' }, { id: 'arrive', label: 'Arrive beneath Perseverance — February 18, 2021' }, { id: 'night', label: 'Survive the first night alone — April 4, 2021' }], correct: ['arrive', 'deploy', 'night', 'flight'], feedback: 'Arrival did not put the helicopter in the air. It had to deploy, survive independently and prepare before the first flight.' },
        { kind: 'select', id: 'original-objective', prompt: 'Assemble the original engineering challenge. Keep only claims supported by the records.', options: [{ id: 'controlled', label: 'Prove powered, controlled flight in the Martian atmosphere' }, { id: 'five', label: 'Attempt up to five demonstration flights' }, { id: 'life', label: 'Use an onboard laboratory to search for life' }, { id: 'samples', label: 'Carry Mars samples back to Earth' }], correct: ['controlled', 'five'], feedback: 'The original challenge was controlled flight, with up to five tests. Ingenuity did not carry a science laboratory or a sample-return system.' },
      ],
      hint: 'Follow what had to happen before an aircraft could leave the ground. Then separate a technology test from a rover’s science mission.',
      success: 'A short flight could answer the original question. NASA first needed proof that controlled flight on Mars could work.',
    },
    {
      id: 'thin-air', title: 'Flight in Thin Air', opening: 'The blades look large beside the body. On Mars, that relationship was a practical answer to a difficult atmosphere.',
      inspections: ['rotors'], evidenceIds: ['thin-air', 'rotor-control'],
      tasks: [
        { kind: 'match', id: 'design-links', prompt: 'Connect each challenge to the engineering response. Use the lift diagram and inspected hardware.', options: [{ id: 'light', label: 'Use a lightweight aircraft with large, rapidly turning blades' }, { id: 'opposed', label: 'Use opposing rotor rotation to counter torque' }, { id: 'pitch', label: 'Adjust blade pitch through onboard flight control' }, { id: 'gravity', label: 'Rely on low gravity alone; no lift is needed' }], rows: [{ id: 'density', label: 'Very little air available for generating lift', correct: 'light', feedback: 'Lower gravity helps with weight, but the rotors still need lift. The thin-air record connects low mass and the rotor design.' }, { id: 'torque', label: 'Rotor torque would tend to turn the body', correct: 'opposed', feedback: 'Look at the two rotor levels. Opposite rotation helps counter the twisting effect on the body.' }, { id: 'control', label: 'Lift and attitude must change during flight', correct: 'pitch', feedback: 'Ingenuity adjusts blade pitch. It is not controlled only by spinning motors faster or slower like a consumer quadcopter.' }] },
        { kind: 'select', id: 'lift-proof', prompt: 'Which two records support these design links?', options: [{ id: 'thin-air', label: 'Less air, less lift' }, { id: 'rotor-control', label: 'Two rotors, opposite directions' }, { id: 'arrival', label: 'From a rover’s belly to open sky' }], correct: ['thin-air', 'rotor-control'], feedback: 'Use the environment record and rotor engineering record. Arrival dates alone do not explain lift or torque.' },
      ], hint: 'Thin air affects lift; opposite rotation addresses torque; blade pitch helps control the flight. They are three different connections.',
      success: 'Mars offered less weight to lift, but much less air to work with. The aircraft’s light body and rotor design addressed that mismatch together.',
    },
    {
      id: 'martian-night', title: 'Surviving the Martian Night', opening: 'The aircraft is back on the ground. Its battery still has work to do after the Sun goes down.',
      inspections: ['solar-panel', 'fuselage'], evidenceIds: ['sunlight', 'night-survival'],
      tasks: [
        { kind: 'sequence', id: 'energy-path', prompt: 'Build the energy path for an independent Martian night. This is a qualitative teaching model, not an operational timetable.', items: [{ id: 'protect', label: 'Stored energy powers protection through the night' }, { id: 'store', label: 'Battery stores collected energy' }, { id: 'review', label: 'Review temperatures and recharge before preparing another flight' }, { id: 'collect', label: 'The exposed solar panel receives daylight' }], correct: ['collect', 'store', 'protect', 'review'], feedback: 'The panel gathers energy, the battery stores it, and protection uses it through the night. Review survival and recharge before committing to another flight.' },
        { kind: 'select', id: 'energy-strategy', prompt: 'Keep the parts of a defensible power-management strategy.', options: [{ id: 'heater', label: 'Preserve energy for essential heating and electronics' }, { id: 'check', label: 'Check temperature and charge before the next flight' }, { id: 'sun', label: 'Keep the deployed solar panel exposed to sunlight' }, { id: 'ignore', label: 'Spend all charge on flying because landing proves overnight survival' }, { id: 'rover', label: 'Assume a permanent power cable still connects the deployed helicopter to Perseverance' }], correct: ['heater', 'check', 'sun'], feedback: 'Landing does not guarantee overnight survival. The deployed helicopter needs its own energy for protection, and the former rover power connection is gone.' },
      ], hint: 'Separate collecting energy, storing it and using it. A flight is only one demand on the battery.',
      success: 'Daylight helped pay for the night. A safe landing mattered, but survival depended on charge, insulation and heat as well.',
    },
    {
      id: 'autonomous-flight', title: 'No Pilot at the Controls', opening: 'A flight plan can cross space. A last-second joystick correction cannot. Look at what the aircraft had to work out for itself.',
      inspections: ['fuselage'], evidenceIds: ['autonomy', 'navigation'],
      tasks: [
        { kind: 'select', id: 'terrain-observation', prompt: 'Study these original teaching drawings. Which observation offers the clearest visual references on relatively flat ground? This does not certify a safe landing site.', options: [{ id: 'pebbles', label: 'Observation A — separated pebbles on flat ground', terrain: 'textured' }, { id: 'blank', label: 'Observation B — nearly featureless ground', terrain: 'blank' }, { id: 'ripples', label: 'Observation C — steep, repeating sand ripples', terrain: 'slope' }], correct: ['pebbles'], feedback: 'Distinct pebbles can be recognized across images. Blank ground provides few references; steep repetitive terrain can also undermine navigation assumptions. Texture is helpful, not a safety certificate.' },
        { kind: 'sequence', id: 'autonomy-order', prompt: 'Reconstruct a simplified autonomous control loop. This illustrates decisions, not recorded telemetry.', items: [{ id: 'adjust', label: 'Onboard control adjusts the aircraft using the motion estimate' }, { id: 'plan', label: 'Earth team uploads a prepared flight plan' }, { id: 'estimate', label: 'Combine tracked features and sensor readings to estimate motion' }, { id: 'observe', label: 'Capture ground observations during flight' }], correct: ['plan', 'observe', 'estimate', 'adjust'], feedback: 'People prepare the plan. During flight the aircraft observes, estimates and controls onboard; it does not wait for an Earth joystick command.' },
      ], hint: 'Look for features you could recognize in the next picture. Then keep the fast observe–estimate–control loop on the aircraft.',
      success: 'The people chose the plan. Ingenuity had to make the rapid corrections. Its view of the ground was part of how it knew it was moving.',
    },
    {
      id: 'beyond-five', title: 'Beyond Five Flights', opening: 'The first question had an answer. Keeping the helicopter flying let the team ask what an aerial view could contribute.',
      inspections: ['landing-legs'], evidenceIds: ['operations-demo', 'seventy-two'],
      tasks: [
        { kind: 'match', id: 'mission-roles', prompt: 'Match the observation or result to the role it supports.', options: [{ id: 'demonstration', label: 'Demonstrate a new flight capability' }, { id: 'scout', label: 'Help rover planners assess terrain from above' }, { id: 'engineering', label: 'Learn from repeated aircraft operations' }, { id: 'laboratory', label: 'Analyse collected rock samples in an onboard science laboratory' }], rows: [{ id: 'first', label: 'The first controlled hop on Mars', correct: 'demonstration', feedback: 'The first hop proved a flight capability. It was not a sampling or laboratory experiment.' }, { id: 'images', label: 'Aerial views of possible routes and areas of interest', correct: 'scout', feedback: 'Aerial imagery offered context for rover planning. It did not mean the helicopter had collected the rocks below.' }, { id: 'repeated', label: 'Experience across many takeoffs, flights and landings', correct: 'engineering', feedback: 'Repeated operations teach engineers about performance and limits. Do not assign Ingenuity a science laboratory it did not carry.' }] },
        { kind: 'sequence', id: 'milestones', prompt: 'Put the verified flight milestones in order.', items: [{ id: 'last', label: 'Flight 72 — January 18, 2024' }, { id: 'fifth', label: 'Fifth flight — May 7, 2021' }, { id: 'first', label: 'First flight — April 19, 2021' }, { id: 'fiftieth', label: 'Fiftieth flight — April 13, 2023' }], correct: ['first', 'fifth', 'fiftieth', 'last'], feedback: 'Use both the milestone dates and the flight numbers. Five was the original demonstration plan, not the eventual mission total.' },
      ], hint: 'Separate proving flight, helping a rover choose where to go, and learning how an aircraft keeps operating. Then follow the dated flight record.',
      success: 'The experiment grew into an aerial scout and a longer engineering test. Seventy-two flights meant many chances to learn beyond the original five.',
    },
    {
      id: 'flight-seventy-two', title: 'The Seventy-Second Flight', opening: 'The final landing left evidence, but no complete eyewitness account. Recover what is known—and keep the explanation honest.',
      inspections: ['rotors'], evidenceIds: ['final-flight', 'damage-evidence', 'likely-scenario'],
      tasks: [
        { kind: 'sequence', id: 'final-events', prompt: 'Reconstruct the final flight and the later investigation without filling gaps with invented events.', items: [{ id: 'analysis', label: 'NASA describes a most-likely accident scenario — December 2024' }, { id: 'hop', label: 'Flight 72 climbs and begins its descent — January 18, 2024' }, { id: 'images', label: 'Later images establish rotor damage' }, { id: 'plan', label: 'Plan a brief flight to check systems after Flight 71 ended early' }, { id: 'reconnect', label: 'Reestablish contact the following day after communications loss' }], correct: ['plan', 'hop', 'reconnect', 'images', 'analysis'], feedback: 'The short hop came before restored contact and damage images. The most-likely accident explanation came later, after investigation—not from a live eyewitness view.' },
        { kind: 'match', id: 'certainty', prompt: 'Classify the strength of each claim.', options: [{ id: 'observed', label: 'Observed or documented fact' }, { id: 'likely', label: 'Most-likely investigation scenario' }, { id: 'unsupported', label: 'Unsupported claim' }], rows: [{ id: 'damage', label: 'Post-flight images showed damaged rotor blades', correct: 'observed', feedback: 'The images are direct evidence of blade condition. They are not merely a prediction.' }, { id: 'impact', label: 'Horizontal motion and a sloped impact caused damaging attitude changes', correct: 'likely', feedback: 'NASA identifies this as the most-likely scenario. The account should not turn an engineering reconstruction into certainty about every motion.' }, { id: 'pilot', label: 'An Earth pilot steered into the ground with a joystick', correct: 'unsupported', feedback: 'Ingenuity flew autonomously. There is no evidence for a real-time Earth joystick accident.' }] },
        { kind: 'select', id: 'final-lessons', prompt: 'Support a final engineering conclusion with the evidence. Which statements should remain in your explanation?', options: [{ id: 'navigation', label: 'Limited visual references could undermine motion estimates needed for landing' }, { id: 'uncertainty', label: 'Damage is established; the precise accident sequence remains a most-likely reconstruction' }, { id: 'certain', label: 'The photos prove every motion and load at touchdown with certainty' }, { id: 'worthless', label: 'The damaged rotors erase the engineering value of the earlier flights' }], correct: ['navigation', 'uncertainty'], feedback: 'Connect navigation to landing, and preserve the investigation’s uncertainty. Damage does not erase the value of 72 flights, and the images cannot reveal every detail of the impact.' },
      ], hint: 'Read the January status and December investigation as separate records. Damage can be observed even when the chain that caused it must be reconstructed.',
      success: 'The evidence establishes damaged blades. The investigation offers a most-likely chain from weak visual references to a hard landing. Both the explanation and its limits can guide the next design.',
    },
  ],
}
