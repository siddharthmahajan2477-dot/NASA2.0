import type { SpacecraftConfig } from './inspection'

export const ingenuityInspection: SpacecraftConfig = {
  id: 'ingenuity', name: 'Ingenuity',
  modelPath: import.meta.env.BASE_URL + 'assets/models/spacecraft/Ingenuity Mars Helicopter.glb',
  rotation: [0, 0, 0], displaySpan: 6.4, cameraDirection: [0.8, 0.4, 1],
  environment: { ground: '#98674d', rock: '#765342', sun: [8, 10, 6], sky: '#352a25', ambient: 0.5 },
  // Rendered-view and transformed-bound verification: docs/level-3.md.
  // Display coordinates identify visible regions, not engineering dimensions.
  components: [
    { id: 'rotors', name: 'Counter-rotating rotors', position: [0.22, 2.4, 0.25], markerOffset: [0.6, 0.28, 0.6], compactLabelOffset: [-38, 10], view: [1, 0.2, 1],
      explanation: 'Two stacked rotors turn in opposite directions. Large, light blades generate lift in thin Martian air; opposing rotation helps counter torque on the body. Blade-pitch adjustments provide flight control.',
      significance: 'Look at both blade levels. Ingenuity needed lift and precise control, not simply a fast-spinning propeller. This intact static model does not depict the damage after Flight 72.',
      source: { title: 'NASA/JPL · Rotor engineering', url: 'https://www.jpl.nasa.gov/news/press_kits/mars_2020/ingenuity/landing/mission/spacecraft/' } },
    { id: 'solar-panel', name: 'Solar panel', position: [0.12, 2.77, 0.55], compactLabelOffset: [38, -10], view: [0.7, 0.7, 1],
      explanation: 'The solar array above the rotors converts sunlight to electrical energy. It recharges the battery system, which supplies motors, electronics and heaters.',
      significance: 'A day’s energy had to support more than flying. Stored energy also helped keep vulnerable systems warm during the night.',
      source: { title: 'NASA · Solar array and energy storage', url: 'https://science.nasa.gov/resource/mars-helicopters-solar-array-as-seen-by-perseverances-mastcam-z/' } },
    { id: 'fuselage', name: 'Electronics housing', position: [0.3, 1.2, 0.46], view: [0.7, 0.15, 1],
      explanation: 'The central fuselage houses computers, batteries, sensors, heaters and communication electronics. Onboard systems execute a flight plan without a real-time Earth pilot.',
      significance: 'This hotspot identifies the visible housing. Internal computers, heaters and individual sensors are explained from NASA records; the model is not cut open to invent their exact locations.',
      source: { title: 'NASA/JPL · Fuselage and onboard systems', url: 'https://www.jpl.nasa.gov/news/press_kits/mars_2020/ingenuity/landing/mission/spacecraft/' } },
    { id: 'landing-legs', name: 'Landing legs', position: [1.6, 0.15, 1.55], markerOffset: [0.4, 0.25, 0.4], view: [1, 0.15, 1],
      explanation: 'Four lightweight carbon-composite landing legs support the helicopter and provide clearance below its body. Landing conditions matter even when the flight itself has been controlled.',
      significance: 'The legs could not make every terrain safe. The final investigation connects navigation, sideways motion and a sloped impact; it does not establish that the landing legs alone caused the accident.',
      source: { title: 'NASA/JPL · Landing gear', url: 'https://www.jpl.nasa.gov/news/press_kits/mars_2020/ingenuity/landing/mission/spacecraft/' } },
  ],
}
