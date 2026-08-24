import { chromium } from 'playwright'
const url = process.argv[2]
const idx = +(process.argv[3] || 17)
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await ctx.route('**/*', r => /^http:\/\/127\.0\.0\.1/.test(r.request().url()) ? r.continue() : r.abort())
  const page = await ctx.newPage()
  await page.goto(origin + url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)
  const el = page.locator('.content.custom div[class*="language-"], .vp-doc div[class*="language-"]')
  const n = await el.count()
  // 找 top 最接近 2157 的块
  let best = null, bestD = 1e9
  for (let k = 0; k < n; k++) {
    const t = await el.nth(k).evaluate(e => e.getBoundingClientRect().top + scrollY)
    if (Math.abs(t - idx) < bestD) { bestD = Math.abs(t - idx); best = k }
  }
  await el.nth(best).screenshot({ path: `visual-diff/_blk2_${i === 0 ? 'old' : 'new'}.png` })
  await ctx.close()
}
await browser.close()
