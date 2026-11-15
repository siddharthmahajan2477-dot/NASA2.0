import { useState, type ReactNode } from 'react'
import { useAppStore } from '../../app/store'
import SpacecraftViewer from './SpacecraftViewer'
import type { SpacecraftConfig } from './inspection'
import type { MissionConfig } from '../quests/engine'
import { MissionQuestHeader, MissionQuestWorkbench, type MissionStore } from '../quests/MissionQuest'


export interface InspectionStory { opening: string; heading: string; description: string; terrain: string; label: string; credit: ReactNode }
export default function SpacecraftInspection({ config, mission, useMissionStore, story, children }: { config: SpacecraftConfig; mission: MissionConfig; useMissionStore: MissionStore; story: InspectionStory; children?: ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [reset, setReset] = useState(0)
  const reducedMotion = useAppStore((state) => state.preferences.reducedMotion)
  const component = config.components.find((item) => item.id === selected)
  const send = useMissionStore((state) => state.send)
  const inspect = (id: string) => { setSelected(id); send({ type: 'inspect', id }) }
  return <div className="inspection" data-mission={config.id}>
    <p className="inspection-opening">{story.opening}</p>
    <MissionQuestHeader mission={mission} useMissionStore={useMissionStore} onRestart={() => { setSelected(null); setReset((value) => value + 1) }} />
    <div className="inspection-toolbar"><p>Drag to orbit · Scroll or pinch to zoom · Select a numbered component</p><button className="text-button" onClick={() => { setSelected(null); setReset((value) => value + 1) }}>Reset camera</button></div>
    <div className="inspection-layout">
      <div className="inspection-stage">
        <SpacecraftViewer config={config} selected={selected} onSelect={inspect} reset={reset} reducedMotion={reducedMotion} />
        <p className="terrain-note">{story.terrain} <span>Illustrative reconstruction, not surveyed landing-site topography.</span></p>
      </div>
      <aside className="inspection-notes" aria-label="Spacecraft component notes">
        <p className="eyebrow">FIELD INVESTIGATION / {story.label}</p>
        <h2>{story.heading}</h2>
        <p>{story.description}</p>
        <div className="component-list" role="group" aria-label="Choose a spacecraft component">{config.components.map((item, index) => <button key={item.id} aria-pressed={selected === item.id} onClick={() => inspect(item.id)}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{item.name}</button>)}</div>
        <details key={component?.id ?? 'overview'} className="component-detail" open>
          <summary>{component ? `${component.name} · field note` : 'Component notes'}</summary>
          <div aria-live="polite" aria-atomic="true">
          {component ? <><p className="eyebrow">ENGINEERING NOTE</p><h3>{component.name}</h3><p>{component.explanation}</p><p className="component-significance">{component.significance}</p><a href={component.source.url} target="_blank" rel="noopener noreferrer">{component.source.title} ↗</a><button className="text-button close-note" onClick={() => { setSelected(null); setReset((value) => value + 1) }}>Close component note</button></> : <p>Select a marker on the spacecraft, or choose a component above. Each has a different job in the journey.</p>}
          </div>
        </details>
      </aside>
    </div>
    <MissionQuestWorkbench mission={mission} useMissionStore={useMissionStore} />{children}
    <details className="model-credit"><summary>About this reconstruction & sources</summary>{story.credit}</details>
  </div>
}
