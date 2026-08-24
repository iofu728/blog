import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
  await page.goto(origin + '/Coding/1040.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    const h1 = document.querySelector('.content.custom h1, .vp-doc h1')
    const a = h1.querySelector('.header-anchor')
    const cs = getComputedStyle(a)
    return { opacity: cs.opacity, float: cs.cssFloat, display: cs.display, rect: a.getBoundingClientRect().toJSON(), vis: cs.visibility }
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r))
  await page.close()
}
await browser.close()
