import { expect, test } from './static-assets'

test('navigation, preferences, sources, layout, and real renderer', async ({ page }, testInfo) => {
  // This tour includes a lazy 3D module, screenshots and a full page reload.
  // Give the whole flow the inspection suite's budget; assertions stay strict.
  test.setTimeout(90000)
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('ECHOES OF')
  await page.getByRole('button', { name: 'Start Exploration' }).click()
  await expect(page.getByRole('heading', { name: 'The Part That Stayed' })).toBeFocused()
  // App's heading precedes the lazy renderer module; do not start the canvas
  // assertions while the briefing still shows its module-loading fallback.
  await expect(page.locator('.renderer-test')).toBeVisible({ timeout: 30000 })
  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.getByText('Starting 3D renderer…')).toHaveCount(0)
  await expect(page.locator('canvas')).toHaveAttribute('data-engine', /^three\.js/)
  await expect.poll(() =>
  page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => {
    const gl = canvas.getContext('webgl2')
    return gl !== null && !gl.isContextLost()
  }),
).toBe(true)
  // Compare geometry and background pixels, rather than accepting an empty canvas.
  await expect.poll(() => page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => {
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    if (!gl) return false
    const center = new Uint8Array(4)
    const corner = new Uint8Array(4)
    gl.readPixels(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, center)
    gl.readPixels(1, 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, corner)
    return center.slice(0, 3).some((channel, index) => Math.abs(channel - corner[index]) > 10)
  })).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('briefing.png'), fullPage: true })
  await page.getByRole('button', { name: 'Back to welcome' }).click()
  await page.getByRole('button', { name: 'Settings', exact: true }).click()
  const motion = page.getByRole('checkbox', { name: 'Reduced motion' })
  await motion.check()
  await page.getByRole('checkbox', { name: 'Sound preference' }).check()
  await page.reload()
  await page.getByRole('button', { name: 'Settings', exact: true }).click()
  await expect(motion).toBeChecked()
  await expect(page.getByRole('checkbox', { name: 'Sound preference' })).toBeChecked()
  await page.getByRole('button', { name: 'Back to welcome' }).click()
  await page.getByRole('button', { name: 'Scientific Sources & Credits' }).click()
  await expect(page.getByRole('link', { name: /Apollo 11 mission overview/ })).toHaveAttribute('href', 'https://www.nasa.gov/missions/apollo/apollo-11-mission-overview/')
  expect(await page.locator('a[target="_blank"]').count()).toBe(5)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.getByRole('button', { name: 'Back to welcome' }).click()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('welcome.png'), fullPage: true })
  expect(errors).toEqual([])
})

test('keyboard and unavailable storage remain usable', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage unavailable') }
    Storage.prototype.setItem = () => { throw new Error('Storage unavailable') }
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Settings', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeFocused()
  const sound = page.getByRole('checkbox', { name: 'Sound preference' })
  await sound.focus()
  await page.keyboard.press('Space')
  await expect(sound).toBeChecked()
  await expect(page.getByRole('status')).toContainText('could not be saved')
})
