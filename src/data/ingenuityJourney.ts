// Source-backed preparation for the later 3D Mission Journey. No map, playback
// system, surveyed terrain, inferred waypoint or invented flight path is built.
export const ingenuityJourney = {
  missionId: 'ingenuity',
  region: { planet: 'Mars', name: 'Jezero Crater', sourceIds: ['overview'], exactLandingCoordinates: null },
  flightMilestones: [
    { flight: 1, date: '2021-04-19', airfield: 'Wright Brothers Field', sourceIds: ['first', 'log'] },
    { flight: 5, date: '2021-05-07', airfield: null, sourceIds: ['overview', 'log'] },
    { flight: 50, date: '2023-04-13', airfield: null, sourceIds: ['overview', 'log'] },
    { flight: 72, date: '2024-01-18', airfield: 'Airfield Chi', sourceIds: ['log'] },
  ],
  spatialRoutes: {
    status: 'not-integrated', coordinates: [], sourceIds: ['log'],
    limitation: 'The flight log supplies historical summaries. These records contain no verified spatial track geometry. Do not turn flight totals or dates into a fabricated historical route.',
  },
} as const
