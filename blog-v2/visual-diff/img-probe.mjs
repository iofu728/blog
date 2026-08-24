import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await ctx.route('**/*', r => /^http:\/\/127\.0\.0\.1/.test(r.request().url()) ? r.continue() : r.abort())
  const page = await ctx.newPage()
  await page.goto(origin + '/other/cs.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)
  const r = await page.evaluate(() => {
    const img = [...document.querySelectorAll('.content.custom img, .vp-doc img')][0]
    const cs = getComputedStyle(img)
    const p = img.parentElement
    const pcs = getComputedStyle(p)
    return {
      rect: img.getBoundingClientRect().toJSON(), complete: img.complete, nw: img.naturalWidth,
      d: cs.display, h: cs.height, w: cs.width, va: cs.verticalAlign, styleAttr: img.getAttribute('style'),
      pTag: p.tagName, pH: p.getBoundingClientRect().height, pLh: pcs.lineHeight, pDisplay: pcs.display,
      outer: img.outerHTML.slice(0, 150),
    }
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r, null, 1))
  await ctx.close()
}
await browser.close()
