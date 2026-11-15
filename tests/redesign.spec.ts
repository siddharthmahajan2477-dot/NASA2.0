import { test, expect } from './static-assets'
import { openNavigation } from './navigation'
import { missions } from '../src/data/universe'
import { completed } from './universe-fixtures'

test('home uses real empty progress, accessible rings and responsive mission navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Explore the impossible')
  await expect(page.getByRole('progressbar', { name: 'quests complete', exact: true })).toHaveAttribute('aria-valuenow', '0')
  await expect(page.getByRole('progressbar', { name: 'quests complete', exact: true })).toHaveAttribute('aria-valuemax', '17')
  for (const name of ['Apollo 11', 'Ingenuity', 'NEAR Shoemaker']) {
    await expect(page.getByRole('progressbar', { name, exact: true })).toHaveAttribute('aria-valuenow', '0')
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await openNavigation(page, 'Explorer Progress')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Explorer Progress')
  await expect(page.getByRole('progressbar', { name: 'XP earned', exact: true })).toHaveAttribute('aria-valuemax', '2600')
  await page.goBack()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Explore the impossible')
})

test('home and explorer rings agree with validated IndexedDB receipts', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Reading saved progress…')).toHaveCount(0)
  await page.evaluate(async receipt => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('echoes.journey.v1', 1)
      request.onupgradeneeded = () => request.result.createObjectStore('missions')
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const db = request.result, transaction = db.transaction('missions', 'readwrite')
        transaction.objectStore('missions').put(receipt, 'apollo-11')
        transaction.oncomplete = () => { db.close(); resolve() }
        transaction.onerror = () => reject(transaction.error)
      }
    })
  }, completed(missions[0]))
  await page.reload()
  await expect(page.getByRole('progressbar', { name: 'quests complete', exact: true })).toHaveAttribute('aria-valuenow', '5')
  await expect(page.getByRole('progressbar', { name: 'Apollo 11', exact: true })).toHaveAttribute('aria-valuenow', '5')
  await page.getByRole('link', { name: 'View My Progress', exact: true }).click()
  await expect(page.locator('.explorer-totals')).toContainText('700 XP')
  await expect(page.getByRole('progressbar', { name: 'XP earned', exact: true })).toHaveAttribute('aria-valuenow', '700')
  await expect(page.getByRole('progressbar', { name: 'achievements', exact: true })).toHaveAttribute('aria-valuenow', '1')
})

test('WebGL fallback preserves authentic model preview and all written hotspots', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (String(args[0]).includes('webgl')) return null
      return original.apply(this, args)
    } as typeof original
  })
  await page.goto('/')
  await expect(page.locator('.astronaut-poster')).toBeVisible()
  for (const name of ['Helmet', 'Spacesuit', 'Gloves', 'Boots']) {
    await page.getByRole('group', { name: 'Spacesuit components' }).getByRole('button', { name, exact: true }).click()
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
  }
  await expect(page.getByRole('button', { name: 'Zoom into astronaut' })).toBeDisabled()
  await expect(page.locator('.listen-mode')).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
