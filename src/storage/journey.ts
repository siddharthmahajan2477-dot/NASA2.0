import { restoreProgress, type MissionConfig, type Progress } from '../game/quests/engine'

const databaseName = 'echoes.journey.v1'
const storeName = 'missions'

async function transaction<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    let db: IDBDatabase | undefined
    let settled = false
    const finish = (error?: Error, result?: T) => {
      if (settled) return
      settled = true; clearTimeout(timer); db?.close()
      if (error) reject(error); else resolve(result as T)
    }
    const timer = setTimeout(() => finish(new Error('Journey storage timed out')), 3000)
    try {
      const opening = indexedDB.open(databaseName, 1)
      opening.onupgradeneeded = () => { if (!opening.result.objectStoreNames.contains(storeName)) opening.result.createObjectStore(storeName) }
      opening.onerror = () => finish(new Error('Journey storage unavailable'))
      opening.onblocked = () => finish(new Error('Journey storage is busy'))
      opening.onsuccess = () => {
        db = opening.result
        if (settled) { db.close(); return }
        // The watchdog detects an unavailable database open, not transaction
        // duration. Once open, IndexedDB owns commit/abort notification; a busy
        // renderer must not turn a valid in-flight commit into a false failure.
        clearTimeout(timer)
        try {
          const tx = db.transaction(storeName, mode)
          const request = action(tx.objectStore(storeName))
          tx.oncomplete = () => finish(undefined, request.result)
          tx.onabort = tx.onerror = () => finish(new Error('Journey could not be saved or read'))
        } catch { finish(new Error('Journey storage unavailable')) }
      }
    } catch { finish(new Error('Journey storage unavailable')) }
  })
}

export async function readJourney(id: string): Promise<unknown> { return transaction('readonly', (store) => store.get(id)) }
// Award receipts are validated completion snapshots, not editable XP totals.
// Same database/version/store; atomic with mission save and monotonic across restart.
export async function saveJourney(progress: Progress, config?: MissionConfig): Promise<void> {
 await transaction('readwrite', store => {
  const request = store.put(progress, progress.missionId)
  const candidate = config ? restoreProgress(config, progress) : null
  if (config && candidate?.completed.length) {
   const key = `earned:${config.id}`
   const previous = store.get(key)
   previous.onsuccess = () => {
    const valid = restoreProgress(config, previous.result)
    if (candidate.completed.length > (valid?.completed.length ?? 0)) store.put(candidate, key)
   }
  }
  return request
 })
}
