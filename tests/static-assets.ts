import { test as base, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

// Optional transport for restricted hosts that deny loopback sockets. The real
// production HTML, JS, GLB, textures and Draco bytes still execute in Chromium.
// Normal local runs continue to use the Vite web server without interception.
export const test = base.extend<{ productionAssets: void }>({
  productionAssets: [async ({ context }, use) => {
    if (process.env.ECHOES_STATIC_TESTS === '1') {
      await context.route('http://127.0.0.1:4173/**', async (route) => {
        const pathname = decodeURIComponent(new URL(route.request().url()).pathname)
        const root = path.resolve('dist')
        const filename = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`)
        if (!filename.startsWith(root + path.sep)) { await route.fulfill({ status: 403 }); return }
        try {
          const body = await readFile(filename)
          const contentType = ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary' } as Record<string, string>)[path.extname(filename)] ?? 'application/octet-stream'
          await route.fulfill({ body, contentType })
        } catch { await route.fulfill({ status: 404, body: 'Asset not found' }) }
      })
    }
    await use()
  }, { auto: true }],
})
export { expect }
