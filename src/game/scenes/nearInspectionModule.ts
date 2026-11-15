// Share one module promise between briefing preparation and the lazy route.
let pending: Promise<typeof import('./NearInspection')> | undefined
export function loadNearInspection() {
 pending ??= import('./NearInspection').catch(error => { pending=undefined; throw error })
 return pending
}
