import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
  await page.goto(origin + '/Coding/1040.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    const h3 = document.querySelector('.content.custom h3, .vp-doc h3')
    const a = h3.querySelector('.header-anchor')
    const cs = getComputedStyle(a)
    const before = getComputedStyle(a, '::before')
    return {
      h3html: h3.innerHTML.slice(0, 150),
      aPos: cs.position, aContent: before.content, aFs: cs.fontSize,
      aRect: a.getBoundingClientRect().toJSON(),
      h3cs: (() => { const c = getComputedStyle(h3); return { pt: c.paddingTop, mt: c.marginTop, mb: c.marginBottom, h: h3.getBoundingClientRect().height } })(),
    }
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r, null, 1))
  await page.close()
}
await browser.close()
