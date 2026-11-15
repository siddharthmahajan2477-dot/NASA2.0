import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] },
  },
  projects: [
    ...[
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile-portrait', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: 'mobile-landscape', use: { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true } },
    { name: 'tablet', use: { viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: 'small-mobile', use: { viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true } },
    ].map((project) => ({ ...project, testIgnore: '**/*engine.spec.ts' })),
    { name: 'quest-engine', testMatch: '**/*engine.spec.ts' },
  ],
  webServer: process.env.ECHOES_STATIC_TESTS === '1' ? undefined : { command: 'npm run dev -- --port 4173 --strictPort', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
})
