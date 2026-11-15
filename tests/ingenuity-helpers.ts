import { expect, type Page } from '@playwright/test'
import { waitForInspection } from './rendering'

export async function openIngenuity(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Choose a mission', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Choose a Mission', exact: true })).toBeFocused()
  await page.getByRole('button', { name: 'Explore Ingenuity', exact: true }).click(); await page.getByRole('button', { name: 'Skip to Mission', exact: true }).click();
  await page.getByRole('button', { name: 'Inspect Ingenuity', exact: true }).click()
  await waitForInspection(page)
  await expect(page.locator('.inspection')).toHaveAttribute('data-mission', 'ingenuity')
}

export async function expectIngenuityFrame(page: Page) {
  const viewer = page.locator('.spacecraft-viewport'), canvas = viewer.locator('canvas')
  await expect(viewer).toHaveAttribute('data-model-state', 'loaded', { timeout: 30000 })
  await expect(viewer).toHaveAttribute('data-model-meshes', '35')
  await expect(viewer).toHaveAttribute('data-model-materials', '10')
  await expect(viewer).toHaveAttribute('data-model-textures', '8')
  await expect(viewer).toHaveAttribute('data-model-triangles', '9124')
  await expect(canvas).toHaveAttribute('data-engine', /^three\.js/, { timeout: 20000 })
  await expect.poll(async () => {
    await canvas.scrollIntoViewIfNeeded()
    return canvas.evaluate((element: HTMLCanvasElement) => {
      const gl = element.getContext('webgl2')
      if (!gl || gl.isContextLost()) return false
      const width = gl.drawingBufferWidth, height = gl.drawingBufferHeight
      const pixels = new Uint8Array(width * height * 4)
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
      // The supplied aircraft has silver/grey highlights and carbon textures.
      // Brown terrain/sky and blue-tinted leader lines fail this neutral mask.
      let silver = 0
      for (let y = Math.floor(height * 0.12); y < height * 0.9; y++) for (let x = Math.floor(width * 0.1); x < width * 0.9; x++) {
        const i = (y * width + x) * 4, r = pixels[i], g = pixels[i + 1], b = pixels[i + 2]
        if (Math.min(r, g, b) > 80 && Math.max(r, g, b) - Math.min(r, g, b) < 18) silver++
      }
      return silver > 50 && gl.getError() === 0 && gl.getContextAttributes()?.preserveDrawingBuffer === true
    })
  }, { timeout: 20000 }).toBe(true)
}

export async function inspectIngenuity(page: Page, name: string) {
  const button = page.getByRole('group', { name: 'Choose a spacecraft component' }).getByRole('button', { name, exact: true })
  await button.focus(); await page.keyboard.press('Enter')
  await expect(button).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.component-detail h3')).toHaveText(name)
}

export async function collectIngenuity(page: Page, title: string) {
  const card = page.locator('.evidence-card').filter({ has: page.locator('summary', { hasText: title }) })
  await card.locator('summary').click()
  await expect(card.locator('.evidence-sources a').first()).toHaveAttribute('href', /^https:\/\/(www\.nasa\.gov|science\.nasa\.gov|www\.jpl\.nasa\.gov)\//)
  await card.getByRole('button', { name: 'Collect evidence: ' + title, exact: true }).click()
  await expect(card).toHaveAttribute('data-collected', 'true')
}

export async function orderEvents(page: Page, ids: string[]) {
  const board = page.locator('.sequence-board')
  for (let target = 0; target < ids.length; target++) {
    let position = (await board.locator('li').evaluateAll((items) => items.map((item) => item.getAttribute('data-event-id')))).indexOf(ids[target])
    expect(position).toBeGreaterThanOrEqual(0)
    while (position > target) { await board.locator('[data-event-id="' + ids[target] + '"]').getByRole('button', { name: /earlier$/ }).press('Enter'); position-- }
  }
}

// Independent scientific expectations, not answers imported from game config.
export const investigation = [
  { title: 'The Five-Flight Gamble', inspect: ['Electronics housing'], records: ['An experiment with five flights', 'From a rover’s belly to open sky'], order: ['arrive', 'deploy', 'night', 'flight'], matches: {} as Record<string, string>, choices: ['Prove powered, controlled flight in the Martian atmosphere', 'Attempt up to five demonstration flights'] },
  { title: 'Flight in Thin Air', inspect: ['Counter-rotating rotors'], records: ['Less air, less lift', 'Two rotors, opposite directions'], order: [], matches: { 'Very little air available for generating lift': 'light', 'Rotor torque would tend to turn the body': 'opposed', 'Lift and attitude must change during flight': 'pitch' }, choices: ['Less air, less lift', 'Two rotors, opposite directions'] },
  { title: 'Surviving the Martian Night', inspect: ['Solar panel', 'Electronics housing'], records: ['Daylight has another job', 'Landing was not the end of the day'], order: ['collect', 'store', 'protect', 'review'], matches: {}, choices: ['Preserve energy for essential heating and electronics', 'Check temperature and charge before the next flight', 'Keep the deployed solar panel exposed to sunlight'] },
  { title: 'No Pilot at the Controls', inspect: ['Electronics housing'], records: ['Instructions travel. Reflexes stay onboard.', 'The ground becomes a reference'], order: ['plan', 'observe', 'estimate', 'adjust'], matches: {}, choices: ['Observation A — separated pebbles on flat ground'] },
  { title: 'Beyond Five Flights', inspect: ['Landing legs'], records: ['A new job after five', 'The plan and the record'], order: ['first', 'fifth', 'fiftieth', 'last'], matches: { 'The first controlled hop on Mars': 'demonstration', 'Aerial views of possible routes and areas of interest': 'scout', 'Experience across many takeoffs, flights and landings': 'engineering' }, choices: [] },
  { title: 'The Seventy-Second Flight', inspect: ['Counter-rotating rotors'], records: ['A short hop to check the aircraft', 'What the pictures established', 'A most-likely explanation'], order: ['plan', 'hop', 'reconnect', 'images', 'analysis'], matches: { 'Post-flight images showed damaged rotor blades': 'observed', 'Horizontal motion and a sloped impact caused damaging attitude changes': 'likely', 'An Earth pilot steered into the ground with a joystick': 'unsupported' }, choices: ['Limited visual references could undermine motion estimates needed for landing', 'Damage is established; the precise accident sequence remains a most-likely reconstruction'] },
]

export async function answerInvestigation(page: Page, index: number) {
  const step = investigation[index]
  if (step.order.length) await orderEvents(page, step.order)
  for (const [label, value] of Object.entries(step.matches)) await page.getByLabel(label, { exact: true }).selectOption(value)
  for (const label of step.choices) await page.getByRole('checkbox', { name: label, exact: true }).check()
}
