import ListenMode from '../../components/ListenMode'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'
import { requirements, type Draft, type EvidenceRecord, type QuestEvent, type Task, type MissionConfig } from './engine'
import type { MissionState } from './store'
import { TerrainObservation, EngineeringDiagram } from './MissionDiagrams'

export type MissionStore = UseBoundStore<StoreApi<MissionState>>
interface QuestProps { mission: MissionConfig; useMissionStore: MissionStore }
const storyFor = (mission: MissionConfig) => mission.story ?? { label: mission.title, accessibleName: mission.title, entryTitle: mission.title, entryText: 'Inspect the spacecraft and build a case from the evidence.', conclusionTitle: 'Investigation complete', conclusionLead: 'Your findings connect the engineering to its history.', conclusion: [] }

export function MissionQuestHeader({ mission, useMissionStore, onRestart }: QuestProps & { onRestart: () => void }) {
  const story = storyFor(mission)
  const { progress, ready, saving, warning, hydrate, send } = useMissionStore()
  const [confirm, setConfirm] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const cancel = useRef<HTMLButtonElement>(null)
  const restart = useRef<HTMLButtonElement>(null)
  const questIndex = progress.current
  const phase = progress.phase
  useEffect(() => { void hydrate() }, [hydrate])
  useEffect(() => { if (phase !== 'idle' && questIndex >= 0) heading.current?.focus({ preventScroll: true }) }, [questIndex, phase])
  useEffect(() => { if (confirm) cancel.current?.focus() }, [confirm])
  const quest = mission.quests[progress.current]
  const status = warning ?? (saving ? 'Saving investigation…' : 'Investigation saves on this browser. Progress does not sync between devices.')
  return <section className="quest-header" aria-label={(story.accessibleName ?? story.label) + " investigation"}>
    {progress.phase === 'idle' ? <div className="quest-entry"><div><p className="eyebrow">SPACE MEMORY EXPLORER / {story.label}</p><h2>{story.entryTitle}</h2><p>{story.entryText}</p></div><button className="primary-button" disabled={!ready} onClick={() => send({ type: 'start' })}>{ready ? 'Begin investigation' : 'Reading saved investigation…'}</button></div> : <>
      <div className="quest-heading-row"><div><p className="eyebrow">{story.label} / INVESTIGATION {progress.current + 1} OF {mission.quests.length}</p><h2 ref={heading} tabIndex={-1}>{progress.phase === 'complete' ? 'Investigation complete' : quest.title}</h2></div><button ref={restart} className="text-button" onClick={() => setConfirm(true)}>Restart investigation</button></div>
      <ol className="quest-progress" aria-label="Mission progress" style={{ '--quest-count': mission.quests.length } as CSSProperties}>{mission.quests.map((item, index) => {
        const state = progress.completed.includes(item.id) ? 'completed' : index === progress.current ? 'active' : 'locked'
        return <li key={item.id} data-state={state} aria-current={state === 'active' ? 'step' : undefined}><span className="quest-number">{index + 1}</span><span>{item.title}<small>{state}</small></span></li>
      })}</ol>
      {progress.phase === 'active' ? <><p className="quest-opening">{quest.opening}</p><ListenMode text={quest.opening} title={quest.title}/><ol className="objective-tracker" aria-label="Current objectives">{requirements(mission, progress).map((item) => <li key={item.id} data-done={item.done}><span aria-hidden="true">{item.done ? '✓' : '○'}</span>{item.label}<span className="sr-only">{item.done ? ' completed' : ' required'}</span></li>)}<li data-done={progress.completed.includes(quest.id)}><span aria-hidden="true">{progress.completed.includes(quest.id) ? '✓' : '○'}</span>Validate the evidence-based reconstruction</li></ol><a className="quest-work-link" href="#quest-workbench">Open evidence & reconstruction ↓</a></> : null}
    </>}
    <p className={`journey-storage ${warning ? 'has-warning' : ''}`} aria-live="polite">{ready ? status : 'Checking local investigation storage…'}</p>
    {confirm ? <div className="restart-confirm" role="alertdialog" aria-modal="false" aria-labelledby="restart-title" aria-describedby="restart-description" onKeyDown={(event) => { if (event.key === 'Escape') { setConfirm(false); restart.current?.focus() } }}>
      <h3 id="restart-title">Restart this investigation?</h3><p id="restart-description">This clears {story.label} quest progress and collected evidence on this browser. Your settings and other missions stay as they are.</p>
      <button ref={cancel} className="primary-button" onClick={() => { setConfirm(false); restart.current?.focus() }}>Keep investigating</button><button className="text-button" onClick={() => { send({ type: 'restart' }); onRestart(); setConfirm(false); requestAnimationFrame(() => heading.current?.focus()) }}>Confirm restart</button>
    </div> : null}
  </section>
}

export function MissionQuestWorkbench({ mission, useMissionStore }: QuestProps) {
  const { progress, send } = useMissionStore()
  const feedback = useRef<HTMLParagraphElement>(null)
  if (progress.phase === 'idle') return null
  if (progress.phase === 'complete') return <MissionConclusion mission={mission} useMissionStore={useMissionStore} />
  const quest = mission.quests[progress.current]
  const completed = progress.completed.includes(quest.id)
  const draft = progress.answers[quest.id] ?? {}
  return <section id="quest-workbench" className="quest-workbench" aria-label="Evidence and reconstruction">
    <div className="workbench-intro"><p className="eyebrow">FIELD RECORDS / {progress.evidence.length} DISCOVERED</p><h2>Inspect. Read. Make the connection.</h2><p>Use the spacecraft above to inspect required components. Open the records below, then collect the evidence you need.</p></div>
    <div className="evidence-grid">{quest.evidenceIds.map((id) => <EvidenceCard mission={mission} useMissionStore={useMissionStore} key={id} record={mission.evidence.find((record) => record.id === id)!} />)}</div>
    <div className="evidence-listen"><h3>Listen to the evidence</h3>{quest.evidenceIds.map(id=>{const record=mission.evidence.find(r=>r.id===id)!;return <ListenMode key={id} title={record.title} text={[record.title,record.context,record.body,...(record.sections??[]).flatMap(s=>[s.heading,s.body]),record.relevance].filter(Boolean).join('\n\n')}/>})}</div><form className="reasoning-board" onSubmit={(event) => { event.preventDefault(); send({ type: 'submit' }); requestAnimationFrame(() => feedback.current?.focus({ preventScroll: true })) }}>
      <p className="eyebrow">YOUR RECONSTRUCTION</p>
      <fieldset disabled={completed} className="tasks-fieldset"><legend className="sr-only">{quest.title} challenges</legend>{quest.tasks.map((task) => <TaskControl key={task.id} task={task} draft={draft} send={send} />)}</fieldset>
      {progress.feedback ? <p ref={feedback} tabIndex={-1} role="status" className={`quest-feedback ${progress.feedback.kind}`}>{progress.feedback.text}</p> : null}
      <div className="quest-actions">{completed ? <button type="button" className="primary-button" onClick={() => send({ type: 'advance' })}>Continue investigation</button> : <><button className="primary-button" type="submit">Check reconstruction</button><button className="text-button" type="button" onClick={() => send({ type: 'hint' })}>Show a hint</button><button className="text-button" type="button" onClick={() => send({ type: 'retry' })}>Reset current challenge</button></>}</div>
      {progress.hint ? <p className="quest-hint" role="note"><strong>Look again:</strong> {quest.hint}</p> : null}
    </form>
    {progress.completed.length ? <details className="completed-findings"><summary>Findings recovered so far</summary><ol>{mission.quests.filter((item) => progress.completed.includes(item.id)).map((item) => <li key={item.id}><strong>{item.title}</strong><p>{item.success}</p></li>)}</ol></details> : null}
  </section>
}

function EvidenceCard({ record, mission, useMissionStore }: QuestProps & { record: EvidenceRecord }) {
  const progress = useMissionStore((state) => state.progress)
  const send = useMissionStore((state) => state.send)
  const collected = progress.evidence.includes(record.id)
  const canCollect = !record.inspectionId || progress.inspected.includes(record.inspectionId)
  return <details className="evidence-card" data-collected={collected}>
    <summary>{record.title}<small>{collected ? 'Collected' : 'Open record'}</small></summary>
    <div className="evidence-body"><RecordContent record={record} mission={mission} />
      {!collected && !canCollect ? <p className="record-requirement">First inspect {mission.components[record.inspectionId!]} using its existing hotspot or component list above.</p> : null}
      <button className="text-button" disabled={collected || !canCollect} onClick={() => send({ type: 'collect', id: record.id })}>{collected ? `Collected: ${record.title}` : `Collect evidence: ${record.title}`}</button>
    </div>
  </details>
}

function TaskControl({ task, draft, send }: { task: Task; draft: Draft; send: (event: QuestEvent) => void }) {
  if (task.kind === 'match') return <fieldset className="reasoning-task"><legend>{task.prompt}</legend><div className="match-rows">{task.rows.map((row) => <label key={row.id}><span>{row.label}</span><select aria-label={row.label} value={typeof draft[`${task.id}:${row.id}`] === 'string' ? draft[`${task.id}:${row.id}`] as string : ''} onChange={(event) => send({ type: 'answer', key: `${task.id}:${row.id}`, value: event.target.value })}><option value="">Choose the connection…</option>{task.options.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></label>)}</div></fieldset>
  const value = draft[task.id]
  const ids = Array.isArray(value) ? value : []
  if (task.kind === 'select') return <fieldset className="reasoning-task"><legend>{task.prompt}</legend><div className="classification-options">{task.options.map((option) => <label key={option.id}><input type="checkbox" aria-label={option.label} checked={ids.includes(option.id)} onChange={(event) => send({ type: 'answer', key: task.id, value: event.target.checked ? [...ids, option.id] : ids.filter((id) => id !== option.id) })} /><span>{option.terrain ? <TerrainObservation kind={option.terrain} /> : null}{option.label}</span></label>)}</div></fieldset>
  const order = ids.length ? ids : task.items.map((item) => item.id)
  const move = (index: number, delta: number) => { const next = [...order]; [next[index], next[index + delta]] = [next[index + delta], next[index]]; send({ type: 'answer', key: task.id, value: next }) }
  return <fieldset className="reasoning-task"><legend>{task.prompt}</legend><ol className="sequence-board" aria-label={task.prompt}>{order.map((id, index) => {
    const item = task.items.find((entry) => entry.id === id)!
    return <li key={id} data-event-id={id}><span className="sequence-position" aria-hidden="true">{index + 1}</span><span>{item.label}</span><div><button type="button" aria-label={`Move ${item.label} earlier`} disabled={index === 0} onClick={() => move(index, -1)}>↑</button><button type="button" aria-label={`Move ${item.label} later`} disabled={index === order.length - 1} onClick={() => move(index, 1)}>↓</button></div></li>
  })}</ol></fieldset>
}

function ScienceDiagram({ kind }: { kind: NonNullable<EvidenceRecord['diagram']> }) {
  if (kind === 'rotors' || kind === 'energy') return <EngineeringDiagram kind={kind} />
  return <figure className="science-diagram"><svg viewBox="0 0 360 105" role="img" aria-label={kind === 'seismic' ? 'Schematic: lunar ground vibrations are sensed by a seismometer and recorded.' : 'Schematic: a laser pulse travels from an Earth station to a lunar reflector and returns to Earth.'}>
    {kind === 'seismic' ? <><path d="M12 75H348M20 57l10-8 10 16 10-27 10 38 10-26 10 7h35" fill="none" stroke="#a4ced3" strokeWidth="2"/><rect x="130" y="40" width="55" height="35" fill="#29414a" stroke="#a4ced3"/><path d="M185 57H220l8-9 8 17 8-17 8 9h80" fill="none" stroke="#a4ced3" strokeWidth="2"/><text x="15" y="96">Ground motion</text><text x="123" y="25">Sensor</text><text x="250" y="96">Record</text></> : <><circle cx="30" cy="50" r="18" fill="#29414a" stroke="#a4ced3"/><rect x="312" y="31" width="25" height="38" fill="#29414a" stroke="#a4ced3"/><path d="M55 38H303l-9-5m9 5-9 5M305 64H57l9-5m-9 5 9 5" fill="none" stroke="#a4ced3" strokeWidth="2"/><text x="111" y="25">Laser pulse →</text><text x="106" y="90">← Returned light</text><text x="4" y="103">Earth</text><text x="290" y="103">Moon</text></>}
  </svg><figcaption>Instrument schematic; not to scale.</figcaption></figure>
}

export function RecordContent({ record, mission }: { record: EvidenceRecord; mission: MissionConfig }) {
  return <>{record.context ? <p className="record-context">{record.context}</p> : null}<p>{record.body}</p>
    {record.diagram ? <ScienceDiagram kind={record.diagram} /> : null}
    {record.sections?.map((section) => <section key={section.heading}><h4>{section.heading}</h4><p>{section.body}</p></section>)}
    {record.relevance ? <p className="record-relevance"><strong>Why it matters:</strong> {record.relevance}</p> : null}
    <ul className="evidence-sources">{record.sourceIds.map((id) => <li key={id}><a href={mission.sources[id].url} target="_blank" rel="noopener noreferrer">{mission.sources[id].title} <span className="sr-only">(opens in a new tab)</span></a></li>)}</ul>
  </>
}

function MissionConclusion({ mission, useMissionStore }: QuestProps) {
  const story = storyFor(mission)
  return <section id="quest-workbench" className="mission-conclusion" aria-label={(story.accessibleName ?? story.label) + ' mission conclusion'}><p className="eyebrow">{mission.quests.length} INVESTIGATIONS / ONE RECOVERED STORY</p><h2>{story.conclusionTitle}</h2><p className="conclusion-lead">{story.conclusionLead}</p>{story.conclusion.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    <ol className="conclusion-findings">{mission.quests.map((quest) => <li key={quest.id}><strong>{quest.title}</strong><p>{quest.success}</p></li>)}</ol>
    <details className="completed-findings"><summary>Review the {mission.evidence.length} recovered evidence records</summary><div className="evidence-grid">{mission.evidence.map((record) => <EvidenceCard mission={mission} useMissionStore={useMissionStore} key={record.id} record={record} />)}</div></details>
    <p className="conclusion-signoff">The missions ended. Their stories live on.</p><p className="journey-storage">Revisit the spacecraft, review the evidence, or restart the investigation above.</p>
  </section>
}
