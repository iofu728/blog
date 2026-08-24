import { chromium } from 'playwright'
const url = process.argv[2] || '/other/cs.html'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
  await page.goto(origin + url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)
  const r = await page.evaluate(() => {
    const root = document.querySelector('.content.custom') || document.querySelector('.vp-doc')
    const ps = [...root.querySelectorAll('p')].slice(0, 6).map(p => {
      const r = p.getBoundingClientRect()
      const cs = getComputedStyle(p)
      return { y: +(r.top + scrollY).toFixed(2), h: +r.height.toFixed(2), fs: cs.fontSize, lh: cs.lineHeight, fw: cs.fontWeight, fsm: cs.webkitFontSmoothing || '', tr: cs.textRendering }
    })
    const rr = root.getBoundingClientRect()
    return { rootTop: +(rr.top + scrollY).toFixed(2), rootLeft: +rr.left.toFixed(2), ps }
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r, null, 1))
  await page.close()
}
await browser.close()
