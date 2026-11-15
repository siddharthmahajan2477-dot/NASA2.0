import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { ingenuityMission as mission } from '../src/game/quests/ingenuity'
import { apolloMission } from '../src/game/quests/apollo'
import { initialProgress, restoreProgress, transition, type Progress } from '../src/game/quests/engine'
import { ingenuityReference } from '../src/data/ingenuityRecords'
import { ingenuityJourney } from '../src/data/ingenuityJourney'

function solve(progress: Progress) {
  const quest = mission.quests[progress.current]
  for (const id of quest.inspections) progress = transition(mission, progress, { type: 'inspect', id })
  for (const id of quest.evidenceIds) progress = transition(mission, progress, { type: 'collect', id })
  for (const task of quest.tasks) {
    if (task.kind === 'match') for (const row of task.rows) progress = transition(mission, progress, { type: 'answer', key: task.id + ':' + row.id, value: row.correct })
    else progress = transition(mission, progress, { type: 'answer', key: task.id, value: task.correct })
  }
  return transition(mission, progress, { type: 'submit' })
}
const start = () => transition(mission, initialProgress(mission), { type: 'start' })

test('existing Ingenuity GLB has the inspected structure, embedded materials, Draco requirement and no animations', () => {
  const bytes = readFileSync('public/assets/models/spacecraft/Ingenuity Mars Helicopter.glb')
  expect(bytes.length).toBe(2019408)
  expect(bytes.toString('utf8', 0, 4)).toBe('glTF')
  expect(bytes.readUInt32LE(4)).toBe(2)
  expect(bytes.readUInt32LE(8)).toBe(bytes.length)
  expect(bytes.readUInt32LE(16)).toBe(0x4e4f534a)
  const gltf = JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)))
  expect(gltf.meshes).toHaveLength(11)
  expect(gltf.meshes.flatMap((mesh: { primitives: unknown[] }) => mesh.primitives)).toHaveLength(35)
  expect(gltf.materials).toHaveLength(10)
  expect(gltf.images).toHaveLength(16)
  expect(gltf.images.every((image: { bufferView?: number; uri?: string }) => Number.isInteger(image.bufferView) && !image.uri)).toBe(true)
  expect(gltf.extensionsRequired).toContain('KHR_draco_mesh_compression')
  expect(gltf.animations ?? []).toHaveLength(0)
})

test('six configured quests and detailed records have complete, traceable mission references', () => {
  expect(mission.quests).toHaveLength(6)
  expect(new Set(mission.quests.map((quest) => quest.id)).size).toBe(6)
  expect(mission.evidence).toHaveLength(13)
  for (const record of mission.evidence) {
    expect(record.context).toBeTruthy(); expect(record.relevance).toBeTruthy()
    expect(record.sections!.length).toBeGreaterThan(0)
    for (const id of record.sourceIds) expect(mission.sources[id].url).toMatch(/^https:\/\/(www\.nasa\.gov|science\.nasa\.gov|www\.jpl\.nasa\.gov)\//)
  }
  for (const quest of mission.quests) {
    expect(quest.tasks.length).toBeGreaterThanOrEqual(2)
    for (const id of quest.evidenceIds) expect(mission.evidence.some((record) => record.id === id)).toBe(true)
    for (const id of quest.inspections) expect(Object.hasOwn(mission.components, id)).toBe(true)
  }
  expect(ingenuityReference.timeline).toHaveLength(10)
  expect(ingenuityReference.sections.map((section) => section.id)).toEqual(['objectives', 'engineering', 'teams', 'achievements', 'challenges', 'conclusion', 'credits'])
  expect(ingenuityJourney.region.exactLandingCoordinates).toBeNull()
  expect(ingenuityJourney.spatialRoutes.coordinates).toEqual([])
  expect(ingenuityJourney.flightMilestones.map((flight) => flight.flight)).toEqual([1, 5, 50, 72])
})

test('Ingenuity inspection and evidence prerequisites cannot be bypassed by correct answers or future records', () => {
  let progress = start()
  expect(transition(mission, progress, { type: 'advance' })).toBe(progress)
  expect(transition(mission, progress, { type: 'collect', id: 'likely-scenario' })).toBe(progress)
  progress = transition(mission, progress, { type: 'collect', id: 'original-plan' })
  expect(progress.evidence).toEqual([])
  expect(progress.feedback?.text).toContain('Inspect Electronics housing')
  progress = transition(mission, progress, { type: 'answer', key: 'original-objective', value: ['controlled', 'five'] })
  progress = transition(mission, progress, { type: 'answer', key: 'arrival-order', value: ['arrive', 'deploy', 'night', 'flight'] })
  expect(transition(mission, progress, { type: 'submit' }).feedback?.kind).toBe('blocked')
})

test('wrong classification, hints and reset preserve discovered records and keep later quests locked', () => {
  let progress = start()
  progress = transition(mission, progress, { type: 'inspect', id: 'fuselage' })
  for (const id of ['original-plan', 'arrival']) progress = transition(mission, progress, { type: 'collect', id })
  progress = transition(mission, progress, { type: 'answer', key: 'arrival-order', value: ['arrive', 'deploy', 'night', 'flight'] })
  progress = transition(mission, progress, { type: 'answer', key: 'original-objective', value: ['life'] })
  progress = transition(mission, progress, { type: 'submit' })
  expect(progress.feedback?.text).toContain('science laboratory')
  expect(progress.completed).toEqual([])
  progress = transition(mission, progress, { type: 'hint' })
  expect(progress.hint).toBe(true)
  progress = transition(mission, progress, { type: 'retry' })
  expect(progress.evidence).toEqual(['original-plan', 'arrival'])
  expect(progress.hint).toBe(false)
  expect(progress.answers['five-flight-gamble']).toEqual({ 'arrival-order': ['flight', 'deploy', 'arrive', 'night'] })
})

test('all six Ingenuity quests validate in order, restore the finale and restart cleanly through the shared engine', () => {
  let progress = start()
  for (let index = 0; index < 6; index++) {
    progress = solve(progress)
    expect(progress.completed).toHaveLength(index + 1)
    expect(progress.feedback?.kind).toBe('success')
    if (index < 5) progress = transition(mission, progress, { type: 'advance' })
  }
  expect(progress.phase).toBe('complete')
  expect(progress.evidence).toHaveLength(13)
  expect(restoreProgress(mission, JSON.parse(JSON.stringify(progress)))?.phase).toBe('complete')
  expect(transition(mission, progress, { type: 'submit' })).toBe(progress)
  expect(transition(mission, progress, { type: 'restart' })).toMatchObject({ phase: 'active', current: 0, completed: [], inspected: [], evidence: [] })
})

test('Apollo and Ingenuity schemas stay isolated and future or forged checkpoints recover safely', () => {
  const apollo = initialProgress(apolloMission), ingenuity = start()
  expect(restoreProgress(mission, apollo)).toBeNull()
  expect(restoreProgress(apolloMission, ingenuity)).toBeNull()
  expect(restoreProgress(mission, { ...ingenuity, version: 99 })).toBeNull()
  const forged = restoreProgress(mission, { ...ingenuity, phase: 'complete', current: 50, completed: mission.quests.map((quest) => quest.id), evidence: ['invented'], inspected: ['unknown'] })!
  expect(forged.phase).toBe('active'); expect(forged.current).toBe(0)
  expect(forged.completed).toEqual([]); expect(forged.evidence).toEqual([])
  expect(apollo).toEqual(initialProgress(apolloMission))
})

test('Flight 72 distinguishes observed damage, the most-likely scenario and unsupported joystick claims', () => {
  const classification = mission.quests[5].tasks.find((task) => task.id === 'certainty')!
  if (classification.kind !== 'match') throw new Error('Missing certainty classification')
  expect(Object.fromEntries(classification.rows.map((row) => [row.id, row.correct]))).toEqual({ damage: 'observed', impact: 'likely', pilot: 'unsupported' })
  expect(mission.evidence.find((record) => record.id === 'likely-scenario')!.body).toContain('most-likely')
  expect(mission.evidence.find((record) => record.id === 'navigation')!.relevance).toContain('invented teaching diagrams')
})
