import { test, expect } from '@playwright/test'

const SECTIONS = ['work', 'about', 'background', 'now', 'notes', 'contact']

test('renders every section with content when Supabase is unreachable', async ({ page }) => {
  // The exact condition that produced the empty labelled voids (finding F2).
  await page.route('**/*.supabase.co/**', route => route.abort())
  await page.goto('/')
  await page.waitForTimeout(3000)

  for (const id of SECTIONS) {
    const section = page.locator(`#${id}`)
    await expect(section).toBeVisible()
    const text = await section.innerText()
    expect(text.trim().length, `#${id} rendered empty`).toBeGreaterThan(120)
  }

  // Spot-check that the right copy landed in the right section, not just that
  // the sections are non-empty.
  expect(await page.locator('#work').innerText()).toContain('Forecasting')
  expect(await page.locator('#work').innerText()).toContain('79-case UAT plan')
  expect(await page.locator('#about').innerText()).toContain('apprenticeship')
  expect(await page.locator('#background').innerText()).toContain('Variable Management')
  expect(await page.locator('#now').innerText()).toContain('Blender')
})

test('reveals all content even if IntersectionObserver never fires', async ({ page }) => {
  await page.addInitScript(() => {
    window.IntersectionObserver = class {
      constructor() {}
      observe() {}
      disconnect() {}
      unobserve() {}
    }
  })
  await page.goto('/')
  await page.waitForTimeout(3200)
  const hidden = await page.locator('[data-reveal="out"]').count()
  expect(hidden, 'content still hidden after the fallback timer').toBe(0)
})

test('serves a real PDF at the CV link', async ({ request }) => {
  const res = await request.get('/filip-galach-cv.pdf')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('pdf')
})

test('has no horizontal overflow at any breakpoint', async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.waitForTimeout(600)
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1)
  }
})

test('keeps total image weight under 500 kB', async ({ page }) => {
  let bytes = 0
  page.on('response', async res => {
    if (!/image/.test(res.headers()['content-type'] || '')) return
    const body = await res.body().catch(() => null)
    if (body) bytes += body.length
  })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  expect(bytes / 1024).toBeLessThan(500)
})

test('exposes an accessible mobile menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const toggle = page.locator('button[aria-controls="mobile-menu"]')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Escape')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toBeFocused()
})

test('has exactly one h1', async ({ page }) => {
  await page.goto('/')
  expect(await page.locator('h1').count()).toBe(1)
})
