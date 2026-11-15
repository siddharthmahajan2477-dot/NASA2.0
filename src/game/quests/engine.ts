export interface Option { id: string; label: string; terrain?: 'textured' | 'blank' | 'slope' }
export type Task =
  | { kind: 'match'; id: string; prompt: string; options: Option[]; rows: { id: string; label: string; correct: string; feedback: string }[] }
  | { kind: 'sequence'; id: string; prompt: string; items: Option[]; correct: string[]; feedback: string }
  | { kind: 'select'; id: string; prompt: string; options: Option[]; correct: string[]; feedback: string }
export interface RecordSection { heading: string; body: string; sourceIds?: string[] }
export interface EvidenceRecord { id: string; title: string; body: string; sourceIds: string[]; inspectionId?: string; diagram?: 'seismic' | 'laser' | 'rotors' | 'energy'; sections?: RecordSection[]; context?: string; relevance?: string }
export interface MissionStory { label: string; accessibleName?: string; entryTitle: string; entryText: string; conclusionTitle: string; conclusionLead: string; conclusion: string[] }
export interface Quest { id: string; title: string; opening: string; inspections: string[]; evidenceIds: string[]; tasks: Task[]; hint: string; success: string }
export interface MissionConfig { id: string; title: string; components: Record<string, string>; sources: Record<string, { title: string; url: string }>; evidence: EvidenceRecord[]; quests: Quest[]; story?: MissionStory }
export type Answer = string | string[]
export type Draft = Record<string, Answer>
export interface Progress {
  version: 1
  missionId: string
  phase: 'idle' | 'active' | 'complete'
  current: number
  completed: string[]
  inspected: string[]
  evidence: string[]
  answers: Record<string, Draft>
  feedback: { kind: 'blocked' | 'incorrect' | 'success'; text: string } | null
  hint: boolean
}
export type QuestEvent =
  | { type: 'start' | 'submit' | 'advance' | 'hint' | 'retry' | 'restart' }
  | { type: 'inspect'; id: string }
  | { type: 'collect'; id: string }
  | { type: 'answer'; key: string; value: Answer }

export function initialProgress(config: MissionConfig): Progress {
  return { version: 1, missionId: config.id, phase: 'idle', current: 0, completed: [], inspected: [], evidence: [], answers: {}, feedback: null, hint: false }
}

export function initialDraft(quest: Quest): Draft {
  return Object.fromEntries(quest.tasks.filter((task) => task.kind === 'sequence').map((task) => [task.id, task.kind === 'sequence' ? task.items.map((item) => item.id) : []]))
}
const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((id) => b.includes(id))

export function validAnswer(quest: Quest, key: string, value: unknown): value is Answer {
  for (const task of quest.tasks) {
    if (task.kind === 'match' && task.rows.some((row) => `${task.id}:${row.id}` === key)) return typeof value === 'string' && (value === '' || task.options.some((option) => option.id === value))
    if (task.id === key && task.kind !== 'match' && Array.isArray(value) && value.every((id) => typeof id === 'string') && new Set(value).size === value.length) {
      const choices = (task.kind === 'sequence' ? task.items : task.options).map((item) => item.id)
      return task.kind === 'sequence' ? sameSet(value, choices) : value.every((id) => choices.includes(id))
    }
  }
  return false
}

export function requirements(config: MissionConfig, progress: Progress, quest = config.quests[progress.current]) {
  return [
    ...quest.inspections.map((id) => ({ id: `inspect:${id}`, label: `Inspect ${config.components[id]}`, done: progress.inspected.includes(id) })),
    ...quest.evidenceIds.map((id) => ({ id: `evidence:${id}`, label: `Collect ${config.evidence.find((item) => item.id === id)!.title}`, done: progress.evidence.includes(id) })),
  ]
}

export function validateQuest(config: MissionConfig, progress: Progress, quest = config.quests[progress.current]): Progress['feedback'] {
  const missing = requirements(config, progress, quest).find((item) => !item.done)
  if (missing) return { kind: 'blocked', text: `${missing.label} first. Your reconstruction needs evidence, not a guess.` }
  const draft = progress.answers[quest.id] ?? {}
  for (const task of quest.tasks) {
    if (task.kind === 'match') {
      for (const row of task.rows) if (draft[`${task.id}:${row.id}`] !== row.correct) return { kind: 'incorrect', text: row.feedback }
    } else {
      const answer = draft[task.id]
      const correct = Array.isArray(answer) && (task.kind === 'sequence' ? answer.join('|') === task.correct.join('|') : sameSet(answer, task.correct))
      if (!correct) return { kind: 'incorrect', text: task.feedback }
    }
  }
  return { kind: 'success', text: quest.success }
}

export function transition(config: MissionConfig, progress: Progress, event: QuestEvent): Progress {
  if (event.type === 'restart') return { ...initialProgress(config), phase: 'active', answers: { [config.quests[0].id]: initialDraft(config.quests[0]) } }
  if (event.type === 'start') return progress.phase === 'idle' ? transition(config, progress, { type: 'restart' }) : progress
  if (progress.phase !== 'active') return progress
  const quest = config.quests[progress.current]
  if (event.type === 'advance') {
    if (!progress.completed.includes(quest.id) || progress.current >= config.quests.length - 1) return progress
    const next = config.quests[progress.current + 1]
    return { ...progress, current: progress.current + 1, answers: { ...progress.answers, [next.id]: initialDraft(next) }, feedback: null, hint: false }
  }
  if (progress.completed.includes(quest.id)) return progress
  if (event.type === 'inspect') return quest.inspections.includes(event.id) && !progress.inspected.includes(event.id) ? { ...progress, inspected: [...progress.inspected, event.id] } : progress
  if (event.type === 'collect') {
    const record = config.evidence.find((item) => item.id === event.id)
    if (!record || !quest.evidenceIds.includes(event.id) || progress.evidence.includes(event.id)) return progress
    if (record.inspectionId && !progress.inspected.includes(record.inspectionId)) return { ...progress, feedback: { kind: 'blocked', text: `Inspect ${config.components[record.inspectionId]} on the spacecraft or its accessible component list before collecting this record.` } }
    return { ...progress, evidence: [...progress.evidence, event.id], feedback: null }
  }
  if (event.type === 'hint') return { ...progress, hint: true }
  if (event.type === 'retry') return { ...progress, answers: { ...progress.answers, [quest.id]: initialDraft(quest) }, feedback: null, hint: false }
  if (event.type === 'answer') return validAnswer(quest, event.key, event.value) ? { ...progress, answers: { ...progress.answers, [quest.id]: { ...progress.answers[quest.id], [event.key]: event.value } }, feedback: null } : progress
  const feedback = validateQuest(config, progress)
  if (feedback?.kind !== 'success') return { ...progress, feedback }
  const completed = [...progress.completed, quest.id]
  return { ...progress, completed, feedback, phase: completed.length === config.quests.length ? 'complete' : 'active' }
}

// Restore only known records and validated, ordered completions. Invalid or
// future-version data never fabricates a completed objective.
export function restoreProgress(config: MissionConfig, raw: unknown): Progress | null {
  if (!raw || typeof raw !== 'object') return null
  const value = raw as Partial<Progress>
  if (value.version !== 1 || value.missionId !== config.id || !Array.isArray(value.completed) || !Array.isArray(value.inspected) || !Array.isArray(value.evidence) || !value.answers || typeof value.answers !== 'object') return null
  const inspected = value.inspected.filter((id): id is string => typeof id === 'string' && Object.hasOwn(config.components, id))
  const evidence = value.evidence.filter((id): id is string => typeof id === 'string' && config.evidence.some((record) => record.id === id && (!record.inspectionId || inspected.includes(record.inspectionId))))
  const answers: Record<string, Draft> = {}
  for (const quest of config.quests) {
    const draft = value.answers[quest.id]
    answers[quest.id] = { ...initialDraft(quest), ...Object.fromEntries(Object.entries(draft && typeof draft === 'object' ? draft : {}).filter(([key, answer]) => validAnswer(quest, key, answer))) }
  }
  const result = { ...initialProgress(config), inspected: [...new Set(inspected)], evidence: [...new Set(evidence)], answers }
  for (const quest of config.quests) {
    if (!value.completed.includes(quest.id) || validateQuest(config, result, quest)?.kind !== 'success') break
    result.completed.push(quest.id)
  }
  result.current = Math.min(result.completed.length, config.quests.length - 1)
  if (typeof value.current === 'number' && value.current >= 0 && value.current === result.completed.length - 1 && result.completed.length < config.quests.length) result.current = value.current
  result.phase = result.completed.length === config.quests.length ? 'complete' : value.phase === 'idle' && result.completed.length === 0 ? 'idle' : 'active'
  const reachable = config.quests.slice(0, result.current + 1)
  result.inspected = result.inspected.filter((id) => reachable.some((quest) => quest.inspections.includes(id)))
  result.evidence = result.evidence.filter((id) => reachable.some((quest) => quest.evidenceIds.includes(id)))
  result.answers = Object.fromEntries(reachable.map((quest) => [quest.id, result.answers[quest.id]]))
  if (result.completed.includes(config.quests[result.current].id)) result.feedback = { kind: 'success', text: config.quests[result.current].success }
  return result
}
