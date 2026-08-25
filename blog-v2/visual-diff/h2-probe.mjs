import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await ctx.route('**/*', r => /^http:\/\/127\.0\.0\.1/.test(r.request().url()) ? r.continue() : r.abort())
  const page = await ctx.newPage()
  await page.goto(origin + '/NLP/rnn.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    const hs = [...document.querySelectorAll('.content.custom h2, .vp-doc h2')]
    const h = hs.find(e => Math.abs(e.getBoundingClientRect().top + scrollY - 5872.3) < 30) || hs[0]
    const a = h.querySelector('.header-anchor')
    const cs = getComputedStyle(a)
    const range = document.createRange()
    range.selectNodeContents(h)
    return {
      text: h.textContent.slice(0, 40), h: h.getBoundingClientRect().height,
      aRect: a.getBoundingClientRect().toJSON(), aFloat: cs.cssFloat, aMl: cs.marginLeft, aPr: cs.paddingRight,
      lineFrags: [...range.getClientRects()].length,
      hLeft: h.getBoundingClientRect().left, hWidth: h.getBoundingClientRect().width,
    }
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r, null, 1))
  await ctx.close()
}
await browser.close()
