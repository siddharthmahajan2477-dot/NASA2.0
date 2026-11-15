import { expect, type Page } from '@playwright/test'

export async function openNavigation(page: Page, name: string) {
  const link = page.getByRole('navigation', { name: 'Connected exploration' }).getByRole('link', { name, exact: true })
  if (!await link.isVisible()) await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
  await expect(link).toBeVisible()
  await link.click()
}
