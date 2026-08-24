import { chromium } from 'playwright'
import fs from 'node:fs'
const url = process.argv[2]
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
  await page.goto(origin + url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const el = page.locator('.content.custom div[class*="language-"], .vp-doc div[class*="language-"]').first()
  await el.screenshot({ path: `visual-diff/_blk_${i === 0 ? 'old' : 'new'}.png` })
  await page.close()
}
await browser.close()
