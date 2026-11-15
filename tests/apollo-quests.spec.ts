import type { Page } from '@playwright/test'
import { test, expect } from './static-assets'
import { expectSpacecraftFrame, waitForInspection } from './rendering'

async function openInspection(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Start Exploration' }).click()
  await page.getByRole('button', { name: 'Inspect the Lunar Module' }).click()
  await waitForInspection(page)
}
async function collect(page: Page, title: string) {
  const card = page.locator('.evidence-card').filter({ has: page.locator('summary', { hasText: title }) })
  await card.locator('summary').click()
  await expect(card.locator('.evidence-sources a').first()).toHaveAttribute('href', /^https:\/\/(www\.nasa\.gov|science\.nasa\.gov|ntrs\.nasa\.gov)\//)
  await card.getByRole('button', { name: `Collect evidence: ${title}`, exact: true }).click()
  await expect(card).toHaveAttribute('data-collected', 'true')
}
async function inspect(page: Page, name: string) {
  await page.getByRole('group', { name: 'Choose a spacecraft component' }).getByRole('button', { name, exact: true }).click()
  await expect(page.locator('.component-detail')).toContainText(name)
}
async function sequence(page: Page, ids: string[]) {
  const board = page.locator('.sequence-board')
  for (let target = 0; target < ids.length; target++) {
    let position = (await board.locator('li').evaluateAll((items) => items.map((item) => item.getAttribute('data-event-id')))).indexOf(ids[target])
    while (position > target) {
      await board.locator(`[data-event-id="${ids[target]}"]`).getByRole('button', { name: /earlier$/ }).press('Enter')
      position--
    }
  }
}
async function next(page: Page, title: string) {
  await page.getByRole('button', { name: 'Check reconstruction', exact: true }).click()
  await expect(page.locator('.quest-feedback')).toHaveClass(/success/)
  await page.getByRole('button', { name: 'Continue investigation', exact: true }).click()
  await expect(page.locator('.quest-header h2')).toHaveText(title)
}
async function firstQuest(page: Page) {
  await inspect(page, 'Ascent stage'); await inspect(page, 'Descent stage')
  await collect(page, 'A cabin that could leave'); await collect(page, 'A platform built to stay')
  await page.getByLabel('Upper ascent stage', { exact: true }).selectOption('return')
  await page.getByLabel('Lower descent stage', { exact: true }).selectOption('land')
  await page.getByRole('checkbox', { name: 'A cabin that could leave', exact: true }).check()
  await page.getByRole('checkbox', { name: 'A platform built to stay', exact: true }).check()
}

test('full Apollo investigation: inspections, evidence, reasoning, finale, save and restart', async ({ page }, testInfo) => {
  test.setTimeout(180000)
  const errors: string[] = []
  let modelRequests = 0
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('request', (request) => { if (decodeURI(request.url()).endsWith('/Apollo Lunar Module.glb')) modelRequests++ })
  await page.addInitScript(() => localStorage.setItem('echoes.preferences.v1', JSON.stringify({ reducedMotion: true, sound: false })))
  await openInspection(page)
  await expect(page.locator('.spacecraft-viewport')).toHaveAttribute('data-model-state', 'loaded', { timeout: 30000 })
  await expectSpacecraftFrame(page.locator('canvas'))
  await page.getByRole('button', { name: 'Begin investigation', exact: true }).press('Enter')
  await expect(page.locator('.quest-header h2')).toHaveText('The Machine in Two Halves')
  await expect(page.locator('.quest-progress [data-state="locked"]')).toHaveCount(4)
  await page.getByRole('button', { name: 'Check reconstruction', exact: true }).click()
  await expect(page.locator('.quest-feedback')).toContainText('Inspect Ascent stage first')
  await expect(page.getByRole('button', { name: 'Continue investigation' })).toHaveCount(0)
  // Use a real 3D hotspot for the first required inspection.
  await page.getByRole('button', { name: 'Inspect Ascent stage', exact: true }).click()
  await inspect(page, 'Descent stage')
  await collect(page, 'A cabin that could leave'); await collect(page, 'A platform built to stay')
  await page.getByLabel('Upper ascent stage', { exact: true }).selectOption('land')
  await page.getByRole('button', { name: 'Check reconstruction', exact: true }).click()
  await expect(page.locator('.quest-feedback')).toContainText('crew cabin')
  await page.getByRole('button', { name: 'Show a hint', exact: true }).click()
  await expect(page.getByRole('note')).toContainText('Follow the crew cabin')
  await page.getByRole('button', { name: 'Reset current challenge', exact: true }).click()
  await expect(page.getByLabel('Upper ascent stage', { exact: true })).toHaveValue('')
  await expect(page.locator('.evidence-card[data-collected="true"]')).toHaveCount(2)
  await page.getByLabel('Upper ascent stage', { exact: true }).selectOption('return')
  await page.getByLabel('Lower descent stage', { exact: true }).selectOption('land')
  await page.getByRole('checkbox', { name: 'A cabin that could leave', exact: true }).check()
  await page.getByRole('checkbox', { name: 'A platform built to stay', exact: true }).check()
  await next(page, 'The Landing Problem')
  await inspect(page, 'Descent engine'); await inspect(page, 'Landing legs')
  await collect(page, 'Slow down before touchdown'); await collect(page, 'Stay upright after touchdown')
  await page.getByLabel('Reduce downward speed before contact', { exact: true }).selectOption('gear')
  await page.getByRole('button', { name: 'Check reconstruction', exact: true }).click()
  await expect(page.locator('.quest-feedback')).toContainText('Footpads cannot brake')
  await page.getByLabel('Reduce downward speed before contact', { exact: true }).selectOption('engine')
  await page.getByLabel('Absorb landing energy and keep Eagle supported', { exact: true }).selectOption('gear')
  await next(page, 'The First Step')
  await inspect(page, 'Ladder')
  await collect(page, 'The route out of Eagle'); await collect(page, 'The missing last rung')
  await page.getByRole('button', { name: 'Check reconstruction', exact: true }).click()
  await expect(page.locator('.quest-feedback')).toContainText('Start inside the cabin')
  await sequence(page, ['cabin', 'platform', 'ladder', 'footpad', 'soil'])
  await page.getByLabel('Why did the ladder stop above the footpad?', { exact: true }).selectOption('clearance')
  await next(page, 'The Science That Stayed')
  await collect(page, 'PSEP: listening to the Moon'); await collect(page, 'LRRR: a return address for light'); await collect(page, 'A small science package')
  await expect(page.getByRole('img', { name: /lunar ground vibrations/ })).toBeVisible()
  await expect(page.getByRole('img', { name: /laser pulse travels/ })).toBeVisible()
  await page.getByLabel('PSEP · Passive Seismic Experiment Package', { exact: true }).selectOption('vibrations')
  await page.getByLabel('LRRR · Laser Ranging Retroreflector', { exact: true }).selectOption('distance')
  await page.getByRole('checkbox', { name: 'PSEP', exact: true }).check()
  await page.getByRole('checkbox', { name: 'LRRR', exact: true }).check()
  await page.getByRole('checkbox', { name: 'Lunar rover', exact: true }).check()
  await page.getByRole('button', { name: 'Check reconstruction', exact: true }).click()
  await expect(page.locator('.quest-feedback')).toContainText('lunar rover do not belong')
  await page.getByRole('checkbox', { name: 'Lunar rover', exact: true }).uncheck()
  await page.locator('#quest-workbench').screenshot({ path: testInfo.outputPath('apollo-science.png') })
  await next(page, 'The Part That Stayed')
  await collect(page, 'A rendezvous, not a direct flight home'); await collect(page, 'One last look, decades later')
  await sequence(page, ['landing', 'surface', 'ascent', 'rendezvous', 'return'])
  for (const name of ['Descent stage and its landing gear', 'Deployed PSEP', 'Deployed LRRR']) await page.getByRole('checkbox', { name, exact: true }).check()
  await page.getByLabel('Why was the descent stage left behind?', { exact: true }).selectOption('finished')
  for (const name of ['A platform built to stay', 'A rendezvous, not a direct flight home', 'One last look, decades later']) await page.getByRole('checkbox', { name, exact: true }).check()
  await page.getByRole('button', { name: 'Check reconstruction', exact: true }).click()
  await expect(page.locator('.quest-header h2')).toHaveText('Investigation complete')
  await expect(page.getByRole('region', { name: 'Apollo mission conclusion' })).toContainText('That was how it was meant to work.')
  await expect(page.locator('.quest-progress [data-state="completed"]')).toHaveCount(5)
  expect(modelRequests).toBe(1)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await expect(page.locator('.quest-header .journey-storage')).toContainText('Investigation saves on this browser')
  await page.screenshot({ path: testInfo.outputPath('apollo-complete.png'), fullPage: true })
  await openInspection(page)
  await expect(page.locator('.quest-header h2')).toHaveText('Investigation complete')
  await page.getByRole('button', { name: 'Restart investigation', exact: true }).click()
  await expect(page.getByRole('alertdialog')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Keep investigating' })).toBeFocused()
  await page.getByRole('button', { name: 'Keep investigating' }).click()
  await expect(page.locator('.quest-header h2')).toHaveText('Investigation complete')
  await page.getByRole('button', { name: 'Restart investigation', exact: true }).click()
  await page.getByRole('button', { name: 'Confirm restart', exact: true }).click()
  await expect(page.locator('.quest-header h2')).toHaveText('The Machine in Two Halves')
  await expect(page.locator('.objective-tracker [data-done="true"]')).toHaveCount(0)
  await expect(page.locator('.evidence-card[data-collected="true"]')).toHaveCount(0)
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('echoes.preferences.v1')!).reducedMotion)).toBe(true)
  expect(errors).toEqual([])
})

test('partial mission saves across refresh without bypassing inspections or locked progression', async ({ page }) => {
  test.setTimeout(60000)
  await openInspection(page)
  await page.getByRole('button', { name: 'Begin investigation', exact: true }).click()
  const cabin = page.locator('.evidence-card').filter({ has: page.locator('summary', { hasText: 'A cabin that could leave' }) })
  await cabin.locator('summary').click()
  await expect(cabin.getByRole('button')).toBeDisabled()
  await inspect(page, 'Ascent stage')
  await cabin.getByRole('button').click()
  await page.getByLabel('Upper ascent stage', { exact: true }).selectOption('return')
  await expect(page.locator('.quest-header .journey-storage')).toContainText('Investigation saves on this browser')
  await openInspection(page)
  await expect(page.locator('.quest-header h2')).toHaveText('The Machine in Two Halves')
  await expect(page.locator('.objective-tracker [data-done="true"]')).toHaveCount(2)
  await expect(page.getByLabel('Upper ascent stage', { exact: true })).toHaveValue('return')
  await page.getByRole('button', { name: 'Check reconstruction', exact: true }).click()
  await expect(page.locator('.quest-feedback')).toContainText('Inspect Descent stage first')
  await expect(page.locator('.quest-progress [data-state="locked"]')).toHaveCount(4)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('unavailable journey storage keeps the investigation playable and explains the session limit', async ({ page }) => {
  // Includes cold 3D startup and the complete first investigation. Match the
  // inspection-flow budget under concurrent software WebGL; step assertions
  // and all required gameplay/storage checks retain their existing deadlines.
  test.setTimeout(90000)
  await page.addInitScript(() => {
    IDBFactory.prototype.open = (() => { throw new DOMException('Blocked for storage fallback test', 'SecurityError') }) as typeof IDBFactory.prototype.open
  })
  await openInspection(page)
  await expect(page.locator('.quest-header .journey-storage')).toContainText('only for this session')
  await page.getByRole('button', { name: 'Begin investigation', exact: true }).click()
  await firstQuest(page)
  await next(page, 'The Landing Problem')
  await expect(page.locator('.quest-header .journey-storage')).toContainText('could not be saved')
})

test('an incompatible saved checkpoint recovers safely and can be replaced by a new investigation', async ({ page }) => {
  test.setTimeout(60000)
  await page.goto('/')
  await page.evaluate(() => new Promise<void>((resolve, reject) => {
    const request = indexedDB.open('echoes.journey.v1', 1)
    request.onupgradeneeded = () => request.result.createObjectStore('missions')
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const tx = db.transaction('missions', 'readwrite')
      tx.objectStore('missions').put({ version: 999, missionId: 'apollo-11', phase: 'complete' }, 'apollo-11')
      tx.oncomplete = () => { db.close(); resolve() }
      tx.onerror = () => { db.close(); reject(tx.error) }
    }
  }))
  // The homepage now hydrates progress. Read the seeded checkpoint on a fresh load.
  await page.reload()
  await page.getByRole('button', { name: 'Start Exploration' }).click()
  await page.getByRole('button', { name: 'Inspect the Lunar Module' }).click()
  await waitForInspection(page)
  await expect(page.locator('.quest-header .journey-storage')).toContainText('unreadable')
  await page.getByRole('button', { name: 'Begin investigation', exact: true }).click()
  await expect(page.locator('.quest-header h2')).toHaveText('The Machine in Two Halves')
  await expect(page.locator('.quest-progress [data-state="completed"]')).toHaveCount(0)
  await expect(page.locator('.quest-header .journey-storage')).toContainText('Investigation saves on this browser')
  await openInspection(page)
  await expect(page.locator('.quest-header h2')).toHaveText('The Machine in Two Halves')
})
