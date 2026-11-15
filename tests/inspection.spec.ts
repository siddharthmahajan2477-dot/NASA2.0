import { type Page } from '@playwright/test'
import { expect, test } from './static-assets'
import { expectSpacecraftFrame, waitForInspection } from './rendering'

async function enter(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Start Exploration' }).click()
  await page.getByRole('button', { name: 'Inspect the Lunar Module' }).click()
  await expect(page.getByRole('button', { name: 'Back to briefing' })).toBeVisible()
  await waitForInspection(page)
}

test('NASA spacecraft, component science, camera controls and responsive navigation', async ({ page }, testInfo) => {
  test.setTimeout(90000)
  const errors: string[] = []
  const requests: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('request', (request) => requests.push(request.url()))
  await page.addInitScript(() => localStorage.setItem('echoes.preferences.v1', JSON.stringify({ reducedMotion: true, sound: false })))
  await enter(page)
  const viewer = page.locator('.spacecraft-viewport')
  await expect(viewer).toHaveAttribute('data-model-state', 'loaded', { timeout: 30000 })
  // glTF primitives become 157 rendered Mesh objects; the original has 134 meshes.
  await expect(viewer).toHaveAttribute('data-model-meshes', '157')
  const canvas = viewer.locator('canvas')
  await expectSpacecraftFrame(canvas)
  expect(requests.some((url) => decodeURI(url).endsWith('/Apollo Lunar Module.glb'))).toBe(true)
  expect(requests.some((url) => url.endsWith('/assets/draco/draco_decoder.wasm'))).toBe(true)
  expect(requests.filter((url) => /^https?:/.test(url)).every((url) => url.startsWith('http://127.0.0.1:4173/'))).toBe(true)
  await expect(viewer).toHaveAttribute('data-camera-position', /./)
  const overview = await viewer.getAttribute('data-camera-position')
  await canvas.scrollIntoViewIfNeeded()
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas bounds are unavailable')
  const x = box.x + box.width * 0.72
  const y = Math.max(60, Math.min(box.y + box.height * 0.55, page.viewportSize()!.height - 90))
  if (testInfo.project.use.hasTouch) {
    const session = await page.context().newCDPSession(page)
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - 45, y: y + 10 }] })
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect(viewer).not.toHaveAttribute('data-camera-position', overview!)
    const rotated = await viewer.getAttribute('data-camera-position')
    const cx = box.x + box.width / 2
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cx - 20, y }, { x: cx + 20, y }] })
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cx - 55, y }, { x: cx + 55, y }] })
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect(viewer).not.toHaveAttribute('data-camera-position', rotated!)
    await session.detach()
  } else {
    await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x - 100, y + 30, { steps: 8 }); await page.mouse.up()
    await expect(viewer).not.toHaveAttribute('data-camera-position', overview!)
    const rotated = await viewer.getAttribute('data-camera-position')
    await page.mouse.wheel(0, -180)
    await expect(viewer).not.toHaveAttribute('data-camera-position', rotated!)
  }
  await page.getByRole('button', { name: 'Reset camera' }).click()
  await expect(viewer).toHaveAttribute('data-camera-position', overview!)
  await expect(page.getByRole('button', { name: 'Inspect Descent engine', exact: true })).not.toBeVisible()
  const components = page.getByRole('group', { name: 'Choose a spacecraft component' })
  const expected = [
    ['Ascent stage', 'crew cabin', 'ascent-stage'], ['Descent stage', 'landing engine', 'descent-stage'],
    ['Landing legs', 'landing energy', 'landing-legs'], ['Descent engine', 'throttleable', 'descent-engine'], ['Ladder', 'forward landing leg', 'ladder'],
  ]
  for (const [name, text, id] of expected) {
    const button = components.getByRole('button', { name, exact: true })
    await button.focus(); await page.keyboard.press('Enter')
    await expect(button).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('.component-detail')).toContainText(text)
    await expect(page.locator('.component-detail a')).toHaveAttribute('href', /^https:\/\/(www\.nasa\.gov|ntrs\.nasa\.gov)\//)
    await expect(viewer).toHaveAttribute('data-camera-mode', id)
    await expect(viewer).not.toHaveAttribute('data-camera-position', overview!)
    if (id === 'descent-engine') await expect(page.getByRole('button', { name: 'Inspect Descent engine', exact: true })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await page.getByRole('button', { name: 'Reset camera' }).click()
  await expect(viewer).toHaveAttribute('data-camera-position', overview!)
  await canvas.scrollIntoViewIfNeeded()
  const ladder = page.getByRole('button', { name: 'Inspect Ladder', exact: true })
  await expect(ladder).toBeVisible()
  if (testInfo.project.use.hasTouch) await ladder.tap(); else await ladder.click()
  await expect(page.locator('.component-detail')).toContainText('forward landing leg')
  await page.locator('.component-detail summary').click()
  await expect(page.locator('.component-detail')).not.toHaveAttribute('open', '')
  await page.locator('.component-detail summary').click()
  await expect(page.locator('.component-detail')).toHaveAttribute('open', '')
  await page.getByRole('button', { name: 'Reset camera' }).click()
  await page.screenshot({ path: testInfo.outputPath('inspection.png'), fullPage: true })
  await page.getByRole('button', { name: 'Back to briefing' }).click()
  await expect(page.getByRole('heading', { name: 'The Part That Stayed' })).toBeFocused()
  await page.getByRole('button', { name: 'Back to welcome' }).click()
  expect(errors).toEqual([])
})

test('failed model load preserves notes and navigation, and retry loads the real asset', async ({ page }) => {
  // Includes an intentional failed load, retry, Draco decode and a real frame.
  // The per-phase model and pixel deadlines remain unchanged.
  test.setTimeout(90000)
  let fail = true
  await page.route('**/Apollo%20Lunar%20Module.glb', async (route) => {
    if (fail) await route.fulfill({ status: 503, body: 'Unavailable for recovery test' }); else await route.fallback()
  })
  const failedResponse = page.waitForResponse((response) => decodeURI(response.url()).endsWith('/Apollo Lunar Module.glb') && response.status() === 503)
  await enter(page)
  expect((await failedResponse).status()).toBe(503)
  await expect(page.getByRole('alert')).toContainText('could not be loaded')
  await page.getByRole('group', { name: 'Choose a spacecraft component' }).getByRole('button', { name: 'Descent stage', exact: true }).click()
  await expect(page.locator('.component-detail')).toContainText('stayed on the Moon')
  fail = false
  await page.getByRole('button', { name: 'Retry model' }).click()
  await expect(page.locator('.spacecraft-viewport')).toHaveAttribute('data-model-state', 'loaded', { timeout: 30000 })
  await expect(page.locator('.spacecraft-viewport canvas')).toBeVisible()
  await expectSpacecraftFrame(page.locator('.spacecraft-viewport canvas'))
  await page.getByRole('button', { name: 'Back to briefing' }).click()
})

test('unavailable WebGL leaves engineering notes and back navigation usable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (String(args[0]).startsWith('webgl') || String(args[0]) === 'experimental-webgl') return null
      return original.apply(this, args)
    } as typeof original
  })
  await enter(page)
  // Canvas fallback text may exist inside a functioning canvas; assert the
  // visible error boundary here, rather than counting hidden fallback text.
  await expect(page.locator('.spacecraft-viewport').getByRole('alert').filter({ visible: true })).toContainText('unavailable', { timeout: 30000 })
  await page.getByRole('group', { name: 'Choose a spacecraft component' }).getByRole('button', { name: 'Ascent stage', exact: true }).click()
  await expect(page.locator('.component-detail')).toContainText('Columbia')
  await page.getByRole('button', { name: 'Back to briefing' }).click()
})

test('lost WebGL context shows a clear message without blocking the science', async ({ page }) => {
  await enter(page)
  const viewer = page.locator('.spacecraft-viewport')
  await expect(viewer).toHaveAttribute('data-model-state', 'loaded', { timeout: 30000 })
  // Lose a live context only after the actual spacecraft has rendered.
  await expectSpacecraftFrame(viewer.locator('canvas'))
  await viewer.locator('canvas').evaluate((element: HTMLCanvasElement) => {
    const extension = element.getContext('webgl2')?.getExtension('WEBGL_lose_context')
    if (!extension) throw new Error('Context-loss extension is unavailable')
    extension.loseContext()
  })
  await expect(page.getByRole('alert')).toContainText('Graphics context lost')
  await page.getByRole('group', { name: 'Choose a spacecraft component' }).getByRole('button', { name: 'Landing legs', exact: true }).click()
  await expect(page.locator('.component-detail')).toContainText('stable')
  await page.getByRole('button', { name: 'Back to briefing' }).click()
})
