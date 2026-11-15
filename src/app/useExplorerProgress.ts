import { useEffect, useState } from 'react'
import { missions, stores, souvenirs } from '../data/universe'
import { awardSummary, useEarnedStore } from '../game/quests/earned'
import { readJourney } from '../storage/journey'

export function useExplorerProgress() {
  const proofs = useEarnedStore(s => s.proofs)
  const remember = useEarnedStore(s => s.remember)
  const a = stores[0](), b = stores[1](), c = stores[2]()
  const [receiptsReady, setReceiptsReady] = useState(false)
  const [receiptWarning, setReceiptWarning] = useState(false)
  useEffect(() => {
    let active = true
    // Receipts remain independent of active runs so a restart never erases XP.
    void Promise.all(missions.map(async (mission, index) => {
      await stores[index].getState().hydrate()
      try { remember(mission, await readJourney(`earned:${mission.id}`)) }
      catch { if (active) setReceiptWarning(true) }
    })).then(() => { if (active) setReceiptsReady(true) })
    return () => { active = false }
  }, [remember])
  const states = [a, b, c]
  const awards = awardSummary(missions, proofs)
  const totalQuests = missions.reduce((sum, m) => sum + m.quests.length, 0)
  const achievements = awards.awards.filter(a => !a.id.startsWith('quest:'))
  const collected = souvenirs.filter(s => awards.awards.some(a => a.id === `mission:${s.missionId}`)).length
  return {
    states, proofs, awards, achievements, collected, totalQuests,
    ready: receiptsReady && states.every(s => s.ready),
    warning: states.find(s => s.warning)?.warning ?? (receiptWarning ? 'Saved achievements could not be read. Available session progress is shown.' : null),
    credited: (id: string) => awards.awards.filter(a => a.id.startsWith(`quest:${id}:`)).length,
  }
}
