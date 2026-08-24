import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await ctx.route('**/*', r => /^http:\/\/127\.0\.0\.1/.test(r.request().url()) ? r.continue() : r.abort())
  const page = await ctx.newPage()
  await page.goto(origin + '/Operations/brew.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    return [...document.querySelectorAll('.title')].map(t => {
      const cs = getComputedStyle(t)
      const r = t.getBoundingClientRect()
      return { txt: t.textContent.trim().slice(0, 24), h: +r.height.toFixed(1), w: +r.width.toFixed(1), fs: cs.fontSize, lh: cs.lineHeight, pl: cs.paddingLeft, pr: cs.paddingRight, ws: cs.whiteSpace, fw: cs.fontWeight }
    })
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r, null, 1))
  await ctx.close()
}
await browser.close()
