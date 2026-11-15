import { expect, test } from '@playwright/test'
import { apolloMission as config } from '../src/game/quests/apollo'
import { initialProgress, restoreProgress, transition, type MissionConfig, type Progress } from '../src/game/quests/engine'

function solve(state: Progress, mission: MissionConfig = config) {
  const quest = mission.quests[state.current]
  for (const id of quest.inspections) state = transition(mission, state, { type: 'inspect', id })
  for (const id of quest.evidenceIds) state = transition(mission, state, { type: 'collect', id })
  for (const task of quest.tasks) {
    if (task.kind === 'match') for (const row of task.rows) state = transition(mission, state, { type: 'answer', key: `${task.id}:${row.id}`, value: row.correct })
    else state = transition(mission, state, { type: 'answer', key: task.id, value: task.correct })
  }
  return transition(mission, state, { type: 'submit' })
}
const started = () => transition(config, initialProgress(config), { type: 'start' })

test('idle state cannot collect, inspect, answer or advance; start initializes only quest one', () => {
  const idle = initialProgress(config)
  for (const event of [{ type: 'inspect', id: 'ascent-stage' }, { type: 'collect', id: 'cabin' }, { type: 'advance' }, { type: 'submit' }] as const) expect(transition(config, idle, event)).toBe(idle)
  expect(started()).toMatchObject({ phase: 'active', current: 0, completed: [], evidence: [], inspected: [] })
})

test('future records, unrelated inspections and invalid answer IDs cannot alter progress', () => {
  const state = started()
  expect(transition(config, state, { type: 'collect', id: 'seismic' })).toBe(state)
  expect(transition(config, state, { type: 'inspect', id: 'ladder' })).toBe(state)
  expect(transition(config, state, { type: 'answer', key: 'roles:upper', value: 'invented-engine' })).toBe(state)
  expect(transition(config, state, { type: 'answer', key: 'history', value: ['return'] })).toBe(state)
  expect(transition(config, state, { type: 'advance' })).toBe(state)
})

test('correct answers cannot bypass required inspection or evidence collection', () => {
  let state = started()
  state = transition(config, state, { type: 'collect', id: 'cabin' })
  expect(state.evidence).toEqual([])
  expect(state.feedback?.text).toContain('Inspect Ascent stage')
  state = transition(config, state, { type: 'answer', key: 'roles:upper', value: 'return' })
  state = transition(config, state, { type: 'answer', key: 'roles:lower', value: 'land' })
  state = transition(config, state, { type: 'answer', key: 'stage-proof', value: ['cabin', 'platform'] })
  state = transition(config, state, { type: 'submit' })
  expect(state.feedback?.kind).toBe('blocked')
  expect(state.completed).toEqual([])
})

test('wrong reasoning returns contextual feedback, hints and retry preserve collected records', () => {
  let state = started()
  for (const id of ['ascent-stage', 'descent-stage']) state = transition(config, state, { type: 'inspect', id })
  for (const id of ['cabin', 'platform']) state = transition(config, state, { type: 'collect', id })
  const unchanged = transition(config, state, { type: 'collect', id: 'cabin' })
  expect(unchanged).toBe(state)
  state = transition(config, state, { type: 'answer', key: 'roles:upper', value: 'land' })
  state = transition(config, state, { type: 'submit' })
  expect(state.feedback).toMatchObject({ kind: 'incorrect' })
  expect(state.feedback?.text).toContain('crew cabin')
  state = transition(config, state, { type: 'hint' })
  expect(state.hint).toBe(true)
  state = transition(config, state, { type: 'retry' })
  expect(state.evidence).toEqual(['cabin', 'platform'])
  expect(state.answers['two-halves']).toEqual({})
  expect(state.hint).toBe(false)
})

test('validated completion is idempotent and only then unlocks the next quest', () => {
  let state = solve(started())
  expect(state.completed).toEqual(['two-halves'])
  expect(state.current).toBe(0)
  expect(transition(config, state, { type: 'submit' })).toBe(state)
  expect(transition(config, state, { type: 'answer', key: 'roles:upper', value: 'land' })).toBe(state)
  state = transition(config, state, { type: 'advance' })
  expect(state.current).toBe(1)
  expect(state.feedback).toBeNull()
  expect(transition(config, state, { type: 'advance' })).toBe(state)
})

test('all five quests require their mechanics and lead to a stable completion and clean restart', () => {
  let state = started()
  for (let index = 0; index < config.quests.length; index++) {
    expect(state.current).toBe(index)
    state = solve(state)
    expect(state.completed).toHaveLength(index + 1)
    if (index < config.quests.length - 1) state = transition(config, state, { type: 'advance' })
  }
  expect(state.phase).toBe('complete')
  expect(state.evidence).toHaveLength(11)
  expect(transition(config, state, { type: 'advance' })).toBe(state)
  const restored = restoreProgress(config, JSON.parse(JSON.stringify(state)))!
  expect(restored.phase).toBe('complete')
  expect(restored.completed).toEqual(state.completed)
  state = transition(config, state, { type: 'restart' })
  expect(state).toMatchObject({ phase: 'active', current: 0, evidence: [], completed: [], inspected: [] })
})

test('save validation rejects future schemas and repairs corrupt or forged progression', () => {
  expect(restoreProgress(config, { version: 999 })).toBeNull()
  expect(restoreProgress(config, null)).toBeNull()
  const forged = { ...started(), current: -1, completed: config.quests.map((quest) => quest.id), inspected: ['unknown', '__proto__'], evidence: ['seismic', 'unknown'], answers: { science: { 'science-links:psep': 'vibrations' } } }
  const restored = restoreProgress(config, forged)!
  expect(restored.current).toBe(0)
  expect(restored.completed).toEqual([])
  expect(restored.inspected).toEqual([])
  expect(restored.evidence).toEqual([])
  expect(Object.keys(restored.answers)).toEqual(['two-halves'])
})

test('a checkpoint between solved and next quest restores without skipping the success moment', () => {
  const solved = solve(started())
  const restored = restoreProgress(config, solved)!
  expect(restored.current).toBe(0)
  expect(restored.feedback?.kind).toBe('success')
  expect(transition(config, restored, { type: 'advance' }).current).toBe(1)
})

test('the same engine accepts another mission configuration without Apollo-specific logic', () => {
  const other: MissionConfig = { ...config, id: 'test-mission', title: 'Another investigation', quests: [config.quests[0]] }
  const progress = solve(transition(other, initialProgress(other), { type: 'start' }), other)
  expect(progress.missionId).toBe('test-mission')
  expect(progress.phase).toBe('complete')
  expect(restoreProgress(config, progress)).toBeNull()
})
