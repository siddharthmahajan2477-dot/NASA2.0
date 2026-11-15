export type Point3 = [number, number, number]

export interface InspectionComponent {
  id: string
  name: string
  position: Point3
  view: Point3
  explanation: string
  significance: string
  source: { title: string; url: string }
  showMarkerInOverview?: boolean
  markerOffset?: Point3
  compactLabelOffset?: [number, number]
}

export interface SpacecraftConfig {
  id: string
  name?: string
  modelPath: string
  rotation: Point3
  displaySpan: number
  cameraDirection: Point3
  environment: { ground: string; rock: string; sun: Point3; sky?: string; ambient?: number }
  components: InspectionComponent[]
}

export const apolloInspection: SpacecraftConfig = {
  id: 'apollo-11',
  modelPath: `${import.meta.env.BASE_URL}assets/models/spacecraft/Apollo Lunar Module.glb`,
  rotation: [0, 0, 0],
  displaySpan: 6.4,
  cameraDirection: [0.6, 0.35, 1],
  environment: { ground: '#77746e', rock: '#777871', sun: [8, 10, 6] },
  // Coordinates are in the centered, grounded display frame (not meters).
  // See docs/level-1.md for rendered-view and geometry verification.
  components: [
    {
      id: 'ascent-stage', name: 'Ascent stage', position: [0.35, 3.6, 1.64], view: [0.45, 0.22, 1],
      explanation: 'The upper stage held the crew cabin, controls and its own rocket engine. It carried Armstrong and Aldrin from the surface back into lunar orbit to meet Columbia.',
      significance: 'The return journey began here. The landing platform below did not need to come along.',
      source: { title: 'NASA · Lunar Module engineering', url: 'https://www.nasa.gov/history/apollos-lunar-module-bridged-technological-leap-to-the-moon/' },
    },
    {
      id: 'descent-stage', name: 'Descent stage', position: [1.15, 1.45, 1.17], view: [0.7, 0.25, 1],
      explanation: 'The lower stage carried the landing engine, propellant and landing gear. It brought the spacecraft down to the Moon and supported it during surface operations.',
      significance: 'It became the launch platform for the ascent stage, then stayed on the Moon. Leaving it behind was part of the design.',
      source: { title: 'NASA · Lunar Module overview (PDF)', url: 'https://www.nasa.gov/wp-content/uploads/static/history/alsj/08_LM_&_SLA_Overview_pp61-68.pdf' },
    },
    {
      id: 'landing-legs', name: 'Landing legs', position: [2.75, 0.45, 0], view: [1, 0.2, 0.65],
      explanation: 'Four landing legs supported the Lunar Module. Their structure absorbed landing energy and helped keep the spacecraft stable on the surface.',
      significance: 'A safe touchdown needed more than a working engine. The spacecraft also had to stay upright.',
      source: { title: 'NASA · Landing gear report', url: 'https://ntrs.nasa.gov/citations/19720018253' },
    },
    {
      id: 'descent-engine', name: 'Descent engine', position: [0.25, 0.52, 0.43], view: [0.8, 0.025, 1],
      showMarkerInOverview: false,
      explanation: 'The throttleable descent engine slowed the Lunar Module for landing. Armstrong could adjust the descent while choosing a safe place to touch down.',
      significance: 'Look beneath the lower stage for the engine bell. This is the landing engine; a separate engine powered the ascent stage.',
      source: { title: 'NASA · Lunar Module propulsion', url: 'https://www.nasa.gov/history/apollos-lunar-module-bridged-technological-leap-to-the-moon/' },
    },
    {
      id: 'ladder', name: 'Ladder', position: [-0.04, 1.08, 2.55], view: [0.3, 0.14, 1],
      explanation: 'The ladder ran down the forward landing leg below the hatch and platform. The astronauts used it to travel between their spacecraft and the lunar surface.',
      significance: 'The last stretch to the footpad was a gap, not another rung. NASA designed clearance for the landing gear and an uncertain surface.',
      source: { title: 'NASA · Lunar lander human factors (PDF)', url: 'https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-022-apollo-lunar-lander.pdf#page=6' },
    },
  ],
}
