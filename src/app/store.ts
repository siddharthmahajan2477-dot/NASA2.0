import { create } from 'zustand'
import { readPreferences, savePreferences, type Preferences } from '../storage/preferences'

export type Screen = 'apollo-film' | 'ingenuity-film' | 'near-film' | 'chronosphere' | 'archive' | 'journeys' | 'explorer' | 'near-briefing' | 'near-inspection' | 'welcome' | 'briefing' | 'settings' | 'sources' | 'inspection' | 'missions' | 'ingenuity-briefing' | 'ingenuity-inspection'
interface AppState {
  screen: Screen
  preferences: Preferences
  storageWarning: string | null
  navigate: (screen: Screen) => void
  setPreference: (key: keyof Preferences, value: boolean) => void
}
const initial = readPreferences()
export const useAppStore = create<AppState>((set) => ({
  screen: 'welcome',
  preferences: initial.preferences,
  storageWarning: initial.warning,
  navigate: (screen) => set({ screen }),
  setPreference: (key, value) => set((state) => {
    const preferences = { ...state.preferences, [key]: value }
    return { preferences, storageWarning: savePreferences(preferences) }
  }),
}))
