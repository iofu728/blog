import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
  await page.goto(origin + '/Coding/1040.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `visual-diff/_top_${i === 0 ? 'old' : 'new'}.png`, clip: { x: 0, y: 0, width: 500, height: 220 } })
  await page.close()
}
await browser.close()
