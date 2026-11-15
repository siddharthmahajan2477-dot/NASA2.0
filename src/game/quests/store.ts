import { create } from 'zustand'
import { useEarnedStore } from './earned'
import { readJourney, saveJourney } from '../../storage/journey'
import { initialProgress, restoreProgress, transition, type MissionConfig, type Progress, type QuestEvent } from './engine'
import { apolloMission } from './apollo'

export interface MissionState {
  progress: Progress
  ready: boolean
  saving: boolean
  warning: string | null
  hydrate: () => Promise<void>
  send: (event: QuestEvent) => void
}

export function createMissionStore(config: MissionConfig) {
  let hydration: Promise<void> | undefined
  let writes = Promise.resolve()
  let revision = 0
  return create<MissionState>((set, get) => ({
    progress: initialProgress(config), ready: false, saving: false, warning: null,
    hydrate: () => {
      hydration ??= (async () => {
        try {
          const saved = await readJourney(config.id)
          const restored = saved === undefined ? initialProgress(config) : restoreProgress(config, saved)
          if (restored) { useEarnedStore.getState().remember(config, restored); if (restored.completed.length) writes = writes.then(() => saveJourney(restored, config)).catch(() => { set({ warning: 'Earned progress could not be saved. This investigation remains available in this session.' }) }) }
          set({ progress: restored ?? initialProgress(config), warning: restored ? null : 'The saved investigation was unreadable. Start a new investigation; your browser preferences are unchanged.', ready: true })
        } catch { set({ ready: true, warning: 'Journey storage is unavailable. You can play, but this investigation will last only for this session.' }) }
      })()
      return hydration
    },
    send: (event) => {
      const previous = get()
      if (!previous.ready) return
      const progress = transition(config, previous.progress, event)
      if (progress === previous.progress) return
      const thisRevision = ++revision
      useEarnedStore.getState().remember(config, progress)
      set({ progress, saving: true })
      // Ordered snapshots prevent a slow pre-restart save overwriting a reset.
      writes = writes.then(async () => {
        try {
          await saveJourney(progress, config)
          if (thisRevision === revision) set({ saving: false, warning: null })
        } catch {
          if (thisRevision === revision) set({ saving: false, warning: 'Your investigation still works in this session, but the latest progress could not be saved. Keep this page open to continue.' })
        }
      })
    },
  }))
}

export const useApolloQuestStore = createMissionStore(apolloMission)
