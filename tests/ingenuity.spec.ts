import { test, expect } from './static-assets'
import { answerInvestigation, collectIngenuity, expectIngenuityFrame, inspectIngenuity, investigation, openIngenuity } from './ingenuity-helpers'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('echoes.preferences.v1', JSON.stringify({ reducedMotion: true, sound: false })))
})

test('complete six-quest Ingenuity investigation with real rendering, evidence, wrong answers, finale and restart', async ({ page }, info) => {
  test.setTimeout(240000)
  const errors: string[] = [], requests: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('request', (request) => { if (decodeURI(request.url()).endsWith('/Ingenuity Mars Helicopter.glb')) requests.push(request.url()) })
  await openIngenuity(page)
  await expectIngenuityFrame(page)
  await page.getByRole('button', { name: 'Begin investigation', exact: true }).press('Enter')
  await expect(page.locator('.quest-progress [data-state="locked"]')).toHaveCount(5)
  await page.getByRole('button', { name: 'Check reconstruction', exact: true }).click()
  await expect(page.locator('.quest-feedback')).toContainText('Inspect Electronics housing first')
  await expect(page.getByRole('button', { name: 'Continue investigation' })).toHaveCount(0)
  const originalCard = page.locator('.evidence-card').filter({ has: page.locator('summary', { hasText: 'An experiment with five flights' }) })
  await originalCard.locator('summary').click()
  await expect(originalCard.getByRole('button')).toBeDisabled()
  await originalCard.locator('summary').click()
  for (let index = 0; index < investigation.length; index++) {
    const step = investigation[index]
    await expect(page.locator('.quest-header h2')).toHaveText(step.title)
    for (const name of step.inspect) {
      if (index === 0) {
        await page.getByRole('button', { name: 'Reset camera' }).click()
        const marker = page.getByRole('button', { name: 'Inspect ' + name, exact: true })
        if (info.project.use.hasTouch) await marker.tap(); else await marker.click()
        await expect(page.locator('.component-detail h3')).toHaveText(name)
      } else await inspectIngenuity(page, name)
    }
    for (const title of step.records) await collectIngenuity(page, title)
    const count = await page.locator('.evidence-card[data-collected="true"]').count()
    await page.getByRole('button', { name: 'Check reconstruction', exact: true }).click()
    await expect(page.locator('.quest-feedback')).toHaveClass(/incorrect/)
    await page.getByRole('button', { name: 'Show a hint' }).press('Enter')
    await expect(page.getByRole('note')).toBeVisible()
    await page.getByRole('button', { name: 'Reset current challenge' }).click()
    await expect(page.locator('.evidence-card[data-collected="true"]')).toHaveCount(count)
    if (index === 3) {
      await expect(page.getByRole('img', { name: /Illustrative flat ground/ })).toBeVisible()
      await page.getByRole('checkbox', { name: 'Observation B — nearly featureless ground', exact: true }).check()
      await page.getByRole('button', { name: 'Check reconstruction' }).click()
      await expect(page.locator('.quest-feedback')).toContainText('Distinct pebbles')
      await page.getByRole('checkbox', { name: 'Observation B — nearly featureless ground', exact: true }).uncheck()
    }
    await answerInvestigation(page, index)
    await page.getByRole('button', { name: 'Check reconstruction', exact: true }).press('Enter')
    if (index < 5) {
      await expect(page.locator('.quest-feedback')).toHaveClass(/success/)
      await expect(page.locator('.quest-progress [data-state="completed"]')).toHaveCount(index + 1)
      await page.getByRole('button', { name: 'Continue investigation' }).click()
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await expect(page.locator('.mission-conclusion h2')).toHaveText('Seventy-two flights. A new way to explore.')
  await expect(page.locator('.mission-conclusion')).toContainText('kept the uncertainty visible')
  await expect(page.locator('.quest-progress [data-state="completed"]')).toHaveCount(6)
  await expect(page.locator('.quest-header .journey-storage')).toContainText('Investigation saves on this browser')
  expect(requests).toHaveLength(1)
  await page.locator('.mission-conclusion').screenshot({ path: info.outputPath('ingenuity-conclusion.png') })
  await openIngenuity(page)
  await expect(page.locator('.mission-conclusion h2')).toContainText('Seventy-two flights')
  await page.getByRole('button', { name: 'Restart investigation' }).click()
  await expect(page.getByRole('button', { name: 'Keep investigating' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Restart investigation' })).toBeFocused()
  await page.getByRole('button', { name: 'Restart investigation' }).click()
  await page.getByRole('button', { name: 'Confirm restart' }).click()
  await expect(page.locator('.quest-header h2')).toHaveText('The Five-Flight Gamble')
  await expect(page.locator('.objective-tracker [data-done="true"]')).toHaveCount(0)
  await expect(page.locator('.evidence-card[data-collected="true"]')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('verified components, camera reset, mouse or touch controls and complete reference remain accessible', async ({ page }, info) => {
  test.setTimeout(90000)
  await openIngenuity(page)
  await expectIngenuityFrame(page)
  const viewer = page.locator('.spacecraft-viewport'), canvas = viewer.locator('canvas')
  const overview = await viewer.getAttribute('data-camera-position')
  await canvas.scrollIntoViewIfNeeded()
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Missing canvas bounds')
  const x = box.x + box.width * 0.72, y = Math.max(60, Math.min(box.y + box.height * 0.55, page.viewportSize()!.height - 90))
  if (info.project.use.hasTouch) {
    const cdp = await page.context().newCDPSession(page)
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - 45, y: y + 10 }] })
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect(viewer).not.toHaveAttribute('data-camera-position', overview!)
    const rotated = await viewer.getAttribute('data-camera-position'), cx = box.x + box.width / 2
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cx - 20, y }, { x: cx + 20, y }] })
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cx - 55, y }, { x: cx + 55, y }] })
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect(viewer).not.toHaveAttribute('data-camera-position', rotated!)
    await cdp.detach()
  } else {
    await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x - 100, y + 30, { steps: 8 }); await page.mouse.up()
    await expect(viewer).not.toHaveAttribute('data-camera-position', overview!)
    const rotated = await viewer.getAttribute('data-camera-position')
    await page.mouse.wheel(0, -180)
    await expect(viewer).not.toHaveAttribute('data-camera-position', rotated!)
  }
  await page.getByRole('button', { name: 'Reset camera' }).click()
  await expect(viewer).toHaveAttribute('data-camera-position', overview!)
  for (const name of ['Counter-rotating rotors', 'Solar panel', 'Electronics housing', 'Landing legs']) {
    await inspectIngenuity(page, name)
    await expect(viewer).not.toHaveAttribute('data-camera-position', overview!)
    await expect(page.locator('.component-detail a')).toHaveAttribute('href', /^https:\/\/(science\.nasa\.gov|www\.jpl\.nasa\.gov)\//)
    await canvas.scrollIntoViewIfNeeded()
    const marker = page.getByRole('button', { name: 'Inspect ' + name, exact: true })
    await expect(marker).toBeVisible()
    if (info.project.use.hasTouch) await marker.tap(); else await marker.click()
  }
  const reference = page.locator('.mission-reference')
  await reference.locator(':scope > summary').click()
  await reference.getByText('Mission timeline', { exact: true }).click()
  await expect(reference.locator('.reference-timeline > li')).toHaveCount(10)
  await expect(reference).toContainText('December 11, 2024')
  await reference.getByText('Detailed engineering and evidence records', { exact: true }).click()
  await expect(reference.locator('.reference-records > details')).toHaveCount(13)
  await expect(reference.getByRole('button')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Begin investigation' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: info.outputPath('ingenuity-inspection.png'), fullPage: true })
  await page.getByRole('button', { name: 'Back to briefing' }).click()
  await expect(page.getByRole('heading', { name: 'Seventy-Two Flights', exact: true })).toBeFocused()
  await page.getByRole('button', { name: 'Back to missions' }).click()
  await expect(page.getByRole('button', { name: 'Explore Apollo 11' })).toBeVisible()
  await page.getByRole('button', { name: 'Explore NEAR Shoemaker', exact: true }).click(); await page.getByRole('button', { name: 'Skip to Mission', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Inspect NEAR Shoemaker', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Back to missions', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Explore Ingenuity', exact: true })).toBeVisible()
})

test('Ingenuity refresh and checkpoint recovery are independent from existing Apollo progress', async ({ page }) => {
  test.setTimeout(120000)
  await page.goto('/')
  await page.getByRole('button', { name: 'Start Exploration' }).click()
  await page.getByRole('button', { name: 'Inspect the Lunar Module' }).click()
  await page.getByRole('button', { name: 'Begin investigation' }).click()
  await inspectIngenuity(page, 'Ascent stage')
  await expect(page.locator('.quest-header .journey-storage')).toContainText('Investigation saves')
  await openIngenuity(page)
  await page.getByRole('button', { name: 'Begin investigation' }).click()
  await inspectIngenuity(page, 'Electronics housing')
  await collectIngenuity(page, 'An experiment with five flights')
  await page.getByRole('checkbox', { name: 'Attempt up to five demonstration flights', exact: true }).check()
  await expect(page.locator('.quest-header .journey-storage')).toContainText('Investigation saves')
  await openIngenuity(page)
  await expect(page.locator('.quest-header h2')).toHaveText('The Five-Flight Gamble')
  await expect(page.getByRole('checkbox', { name: 'Attempt up to five demonstration flights', exact: true })).toBeChecked()
  await expect(page.locator('.evidence-card[data-collected="true"]')).toHaveCount(1)
  await expect(page.locator('.quest-progress [data-state="locked"]')).toHaveCount(5)
  await page.goto('/')
  await page.getByRole('button', { name: 'Start Exploration' }).click()
  await page.getByRole('button', { name: 'Inspect the Lunar Module' }).click()
  await expect(page.locator('.quest-header h2')).toHaveText('The Machine in Two Halves')
  await expect(page.locator('.objective-tracker [data-done="true"]')).toHaveCount(1)
  await expect(page.locator('.evidence-card[data-collected="true"]')).toHaveCount(0)
})

test('unavailable journey storage still permits the entire six-quest mission', async ({ page }) => {
  test.setTimeout(180000)
  await page.addInitScript(() => { IDBFactory.prototype.open = (() => { throw new DOMException('Storage blocked for test', 'SecurityError') }) as typeof IDBFactory.prototype.open })
  await openIngenuity(page)
  await expect(page.locator('.journey-storage').first()).toContainText('only for this session')
  await page.getByRole('button', { name: 'Begin investigation' }).click()
  for (let index = 0; index < investigation.length; index++) {
    for (const name of investigation[index].inspect) await inspectIngenuity(page, name)
    for (const title of investigation[index].records) await collectIngenuity(page, title)
    await answerInvestigation(page, index)
    await page.getByRole('button', { name: 'Check reconstruction' }).click()
    if (index < 5) await page.getByRole('button', { name: 'Continue investigation' }).click()
  }
  await expect(page.locator('.mission-conclusion h2')).toContainText('Seventy-two flights')
  await expect(page.locator('.quest-header .journey-storage')).toContainText('could not be saved')
})

test('failed Ingenuity model request shows error and retry restores real textured geometry', async ({ page }) => {
  test.setTimeout(90000)
  let fail = true
  await page.route('**/Ingenuity%20Mars%20Helicopter.glb', async (route) => { if (fail) await route.fulfill({ status: 503, body: 'Expected test failure' }); else await route.fallback() })
  const failed = page.waitForResponse((response) => decodeURI(response.url()).endsWith('/Ingenuity Mars Helicopter.glb') && response.status() === 503)
  await openIngenuity(page)
  await failed
  await expect(page.getByRole('alert')).toContainText('could not be loaded')
  await inspectIngenuity(page, 'Solar panel')
  await expect(page.locator('.component-detail')).toContainText('heaters')
  fail = false
  await page.getByRole('button', { name: 'Retry model' }).click()
  await expectIngenuityFrame(page)
  await page.getByRole('button', { name: 'Back to briefing' }).click()
})

test('unavailable WebGL keeps Ingenuity science and accessible quest actions usable', async ({ page }) => {
  test.setTimeout(90000)
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (String(args[0]).startsWith('webgl')) return null
      return original.apply(this, args)
    } as typeof original
  })
  await openIngenuity(page)
  await expect(page.locator('.spacecraft-viewport').getByRole('alert').filter({ visible: true })).toContainText('unavailable', { timeout: 30000 })
  await page.getByRole('button', { name: 'Begin investigation' }).click()
  await inspectIngenuity(page, 'Electronics housing')
  for (const title of investigation[0].records) await collectIngenuity(page, title)
  await answerInvestigation(page, 0)
  await page.getByRole('button', { name: 'Check reconstruction' }).click()
  await page.getByRole('button', { name: 'Continue investigation' }).click()
  await expect(page.locator('.quest-header h2')).toHaveText('Flight in Thin Air')
})

test('Ingenuity context loss is handled after a real frame without hiding notes or navigation', async ({ page }) => {
  test.setTimeout(90000)
  await openIngenuity(page)
  await expectIngenuityFrame(page)
  await page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => {
    const extension = canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context')
    if (!extension) throw new Error('Missing context-loss extension')
    extension.loseContext()
  })
  await expect(page.getByRole('alert')).toContainText('Graphics context lost')
  await inspectIngenuity(page, 'Counter-rotating rotors')
  await expect(page.locator('.component-detail')).toContainText('opposite directions')
  await page.getByRole('button', { name: 'Back to briefing' }).click()
})
