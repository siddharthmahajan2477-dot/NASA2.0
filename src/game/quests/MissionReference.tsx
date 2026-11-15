import type { MissionConfig } from './engine'
import type { MissionReferenceData } from '../../data/ingenuityRecords'
import { RecordContent } from './MissionQuest'

export default function MissionReference({ mission, reference }: { mission: MissionConfig; reference: MissionReferenceData }) {
  const links = (ids: string[]) => <ul className="evidence-sources">{ids.map((id) => <li key={id}><a href={mission.sources[id].url} target="_blank" rel="noopener noreferrer">{mission.sources[id].title}</a></li>)}</ul>
  return <details className="mission-reference"><summary>{reference.title} — complete records & sources</summary>
    <p>Read the full mission record at any time. These reference pages do not collect quest evidence or unlock objectives. Dates describe historical events; illustrations explain concepts.</p>
    {reference.sections.map((section) => <details key={section.id}><summary>{section.heading}</summary><p>{section.body}</p>{links(section.sourceIds)}</details>)}
    <details><summary>Mission timeline</summary><ol className="reference-timeline">{reference.timeline.map((event) => <li key={event.date}><strong>{event.date}</strong><p>{event.event}</p>{links(event.sourceIds)}</li>)}</ol></details>
    <details><summary>Detailed engineering and evidence records</summary><div className="reference-records">{mission.evidence.map((record) => <details key={record.id}><summary>{record.title}</summary><RecordContent record={record} mission={mission} /></details>)}</div></details>
  </details>
}
