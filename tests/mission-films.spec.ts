import { test, expect } from './static-assets'
import type { Page } from '@playwright/test'
import { completed } from './universe-fixtures'
import { apolloMission } from '../src/game/quests/apollo'

async function open(page: Page, name = 'Apollo 11') {
  await page.goto('/')
  await page.getByRole('button', { name: 'Choose a mission', exact: true }).click()
  await page.getByRole('button', { name: `Explore ${name}`, exact: true }).click()
  await expect(page.getByRole('region', { name: 'Optional mission film' })).toBeVisible()
}
// Isolate our integration from YouTube availability; this is NOT playback verification.
async function stubPlayer(page: Page, text = 'External player test document') {
  await page.route('https://www.youtube-nocookie.com/embed/**', r => r.fulfill({ contentType: 'text/html', body: `<p>${text}</p>` }))
}
test('Apollo has two films on one page, defers requests and unloads the old player on switching or leaving', async ({ page }) => {
  const requests: string[] = []
  page.on('request', r => { if (r.url().includes('youtube-nocookie.com/embed/')) requests.push(r.url()) })
  await stubPlayer(page)
  await open(page)
  const choices = page.getByRole('group', { name: 'Apollo film choices' })
  await expect(choices.getByRole('button')).toHaveCount(2)
  await expect(choices.getByRole('button', { name: 'Featured Film', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('iframe')).toHaveCount(0)
  expect(requests).toHaveLength(0)
  await page.getByRole('button', { name: 'Watch Film', exact: true }).press('Enter')
  const first = await page.locator('iframe').elementHandle()
  await expect(page.locator('iframe')).toHaveAttribute('src', /youtube-nocookie.com\/embed\/DWm3mywDMrM\?autoplay=0&controls=1/)
  await expect(page.locator('iframe')).toHaveAttribute('allowfullscreen', '')
  await expect(page.locator('iframe')).not.toHaveAttribute('allow', /autoplay/)
  const box = await page.locator('.film-player').boundingBox()
  expect(box).not.toBeNull()
  expect(box!.width / box!.height).toBeCloseTo(16 / 9, 1)
  await choices.getByRole('button', { name: 'Full Mission Journey', exact: true }).press('Enter')
  await expect(page.locator('iframe')).toHaveCount(0)
  expect(await first!.evaluate(e => e.isConnected)).toBe(false)
  await expect(page.getByRole('link', { name: 'Watch on YouTube', exact: true })).toHaveAttribute('href', 'https://www.youtube.com/watch?v=JcvMAL_lTHU')
  await page.getByRole('button', { name: 'Watch Film', exact: true }).click()
  await expect(page.locator('iframe')).toHaveCount(1)
  await expect(page.locator('iframe')).toHaveAttribute('src', /embed\/JcvMAL_lTHU\?autoplay=0/)
  await page.getByRole('button', { name: 'Watch Again', exact: true }).click()
  await expect(page.locator('iframe')).toHaveCount(1)
  await page.getByRole('button', { name: 'Continue to Mission', exact: true }).click()
  await expect(page.locator('iframe')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'The Part That Stayed', exact: true })).toBeFocused()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
for (const [mission, id, title] of [['Ingenuity', 'qMbHE_VXI-8', 'Seventy-Two Flights'], ['NEAR Shoemaker', 'CFUmUIU_tXY', 'The Landing Nobody Designed For']]) {
  test(`${mission} uses one correctly attributed film with retry and an unavailable-video fallback`, async ({ page }) => {
    await stubPlayer(page, 'Video unavailable in this test frame')
    await open(page, mission)
    await expect(page.getByRole('group', { name: 'Apollo film choices' })).toHaveCount(0)
    await expect(page.getByText(/No approved mission film/)).toHaveCount(0)
    await page.getByRole('button', { name: 'Watch Film', exact: true }).click()
    await expect(page.locator('iframe')).toHaveAttribute('src', new RegExp(`embed/${id}\\?autoplay=0`))
    await expect(page.getByRole('link', { name: 'Watch on YouTube', exact: true })).toHaveAttribute('href', `https://www.youtube.com/watch?v=${id}`)
    await page.getByRole('button', { name: 'Video unavailable?', exact: true }).click()
    await expect(page.locator('iframe')).toHaveCount(0)
    await expect(page.getByRole('status').filter({ hasText: 'YouTube playback may be blocked' })).toBeVisible()
    await page.getByRole('button', { name: 'Retry Film', exact: true }).click()
    await expect(page.locator('iframe')).toHaveCount(1)
    await page.getByRole('button', { name: 'Stop Film', exact: true }).click()
    await expect(page.locator('iframe')).toHaveCount(0)
    await page.getByRole('button', { name: 'Skip to Mission', exact: true }).click()
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeFocused()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}
test('blocked external player never blocks immediate mission entry', async ({ page }) => {
  await page.route('https://www.youtube-nocookie.com/embed/**', r => r.abort('blockedbyclient'))
  await open(page)
  await page.getByRole('button', { name: 'Watch Film', exact: true }).click()
  await expect(page.getByRole('link', { name: 'Watch on YouTube', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Skip to Mission', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'The Part That Stayed', exact: true })).toBeFocused()
  await expect(page.locator('iframe')).toHaveCount(0)
})
test('watching, switching and skipping preserve an existing validated mission save and return controls', async ({ page }) => {
  await stubPlayer(page)
  await page.goto('/')
  const saved = completed(apolloMission)
  await page.evaluate(saved => new Promise<void>((resolve, reject) => {
    const r = indexedDB.open('echoes.journey.v1', 1)
    r.onupgradeneeded = () => r.result.createObjectStore('missions')
    r.onerror = () => reject(r.error)
    r.onsuccess = () => { const db = r.result, tx = db.transaction('missions', 'readwrite'); tx.objectStore('missions').put(saved, 'apollo-11'); tx.oncomplete = () => { db.close(); resolve() } }
  }), saved)
  await open(page)
  await page.getByRole('button', { name: 'Watch Film', exact: true }).click()
  await page.getByRole('button', { name: 'Full Mission Journey', exact: true }).click()
  await page.getByRole('button', { name: 'Skip to Mission', exact: true }).click()
  await page.getByRole('button', { name: 'Watch Apollo mission film', exact: true }).click()
  await expect(page.getByRole('region', { name: 'Optional mission film' })).toBeVisible()
  await expect(page.locator('iframe')).toHaveCount(0)
  const restored = await page.evaluate(() => new Promise(resolve => {
    const r = indexedDB.open('echoes.journey.v1', 1)
    r.onsuccess = () => { const db = r.result, tx = db.transaction('missions'); const q = tx.objectStore('missions').get('apollo-11'); q.onsuccess = () => resolve(q.result); tx.oncomplete = () => db.close() }
  }))
  expect(restored).toEqual(saved)
})
