import { chromium } from 'playwright'
const url = process.argv[2]
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  await ctx.route('**/*', r => /^http:\/\/127\.0\.0\.1/.test(r.request().url()) ? r.continue() : r.abort())
  const page = await ctx.newPage()
  await page.goto(origin + url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)
  const r = await page.evaluate(() => {
    const img = document.querySelector('.content.custom img, .vp-doc img')
    if (!img) return null
    const cs = getComputedStyle(img)
    return { rect: img.getBoundingClientRect().toJSON(), alt: img.alt, wattr: img.getAttribute('width'), style: img.getAttribute('style'),
      d: cs.display, h: cs.height, va: cs.verticalAlign, outer: img.outerHTML.slice(0, 200) }
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r, null, 1))
  await ctx.close()
}
await browser.close()
