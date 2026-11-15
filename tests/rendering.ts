import { expect, type Locator, type Page } from '@playwright/test'

export async function waitForInspection(page: Page) {
  // The route heading/back button belongs to App and appears before its lazy
  // inspection module. Wait for that module, not an assumed 5-second load.
  await expect(page.locator('.inspection')).toBeVisible({ timeout: 30000 })
  await expect(page.locator('.quest-header')).toBeVisible()
}

export async function expectSpacecraftFrame(canvas: Locator) {
  let diagnostic: unknown
  // Inspect the real, visible viewport. Small screens place it below the quest
  // header; polling pixels while it is offscreen races Chromium frame delivery.
  await canvas.locator('..').scrollIntoViewIfNeeded()
  await expect(canvas).toBeVisible()
  // A DOM canvas exists before R3F creates its renderer. Calling getContext
  // first would CREATE it with browser defaults (preserveDrawingBuffer=false),
  // permanently overriding the viewer's requested context attributes. Three
  // stamps this attribute in its synchronous context-creation constructor;
  // our next browser task therefore runs after Three owns the context.
  await expect(canvas).toHaveAttribute('data-engine', /^three\.js/, { timeout: 20000 })
  try {
    await expect.poll(async () => {
    // Canvas starts at the browser's default dimensions before R3F's resize
    // observer runs. Recheck scrolling after layout, not just before resizing.
    await canvas.scrollIntoViewIfNeeded()
    diagnostic = await canvas.evaluate((element: HTMLCanvasElement) => {
      const gl = element.getContext('webgl2')
      if (!gl || gl.isContextLost()) return { liveContext: false, hasSize: false, spacecraftPixels: false, gold: 0 }
      const width = gl.drawingBufferWidth, height = gl.drawingBufferHeight
      const pixels = new Uint8Array(width * height * 4)
      const framebuffer = gl.getParameter(gl.READ_FRAMEBUFFER_BINDING)
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
      let gold = 0
      for (let i = 0; i < pixels.length; i += 4) if (pixels[i] > 100 && pixels[i + 1] > 80 && pixels[i + 2] < pixels[i] * 0.65) gold++
      return { liveContext: true, hasSize: width > 0 && height > 0, spacecraftPixels: gold > 80, gold, width, height, framebuffer: Boolean(framebuffer), error: gl.getError(), preserved: gl.getContextAttributes()?.preserveDrawingBuffer }
    })
    return diagnostic
  }, { timeout: 20000 }).toMatchObject({ liveContext: true, hasSize: true, spacecraftPixels: true, preserved: true, error: 0 })
  } catch (error) { throw new Error(`Spacecraft readback: ${JSON.stringify(diagnostic)}`, { cause: error }) }
}
