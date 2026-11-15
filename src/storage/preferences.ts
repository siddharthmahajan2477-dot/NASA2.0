export interface Preferences {
  reducedMotion: boolean
  sound: boolean
}

const key = 'echoes.preferences.v1'

export function readPreferences(): { preferences: Preferences; warning: string | null } {
  const defaults = { reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches, sound: false }
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return { preferences: defaults, warning: null }
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object' || !('reducedMotion' in value) || !('sound' in value)
      || typeof value.reducedMotion !== 'boolean' || typeof value.sound !== 'boolean') {
      return { preferences: defaults, warning: 'Saved preferences were unreadable. Defaults are in use.' }
    }
    return { preferences: { reducedMotion: value.reducedMotion, sound: value.sound }, warning: null }
  } catch {
    return { preferences: defaults, warning: 'Preferences cannot be loaded. Changes will still work for this session.' }
  }
}

export function savePreferences(preferences: Preferences): string | null {
  try {
    localStorage.setItem(key, JSON.stringify(preferences))
    return null
  } catch {
    return 'Preferences apply for this session, but could not be saved on this device.'
  }
}
