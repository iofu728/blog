import { chromium } from 'playwright'
const url = process.argv[2] || '/Coding/1040.html'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
  await page.goto(origin + url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)
  const blocks = await page.evaluate(() =>
    [...document.querySelectorAll('.content.custom div[class*="language-"], .vp-doc div[class*="language-"]')].map(e => {
      const r = e.getBoundingClientRect()
      return { top: Math.round(r.top + scrollY), h: Math.round(r.height) }
    }))
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(blocks))
  // also pre padding / line div styles
  const st = await page.evaluate(() => {
    const pre = document.querySelector('.content.custom div[class*="language-"] pre, .vp-doc div[class*="language-"] pre')
    if (!pre) return null
    const cs = getComputedStyle(pre)
    const line = pre.querySelector('.line') || pre.querySelector('code')
    const lcs = line ? getComputedStyle(line) : null
    return { prePt: cs.paddingTop, prePb: cs.paddingBottom, preLh: cs.lineHeight, preFs: cs.fontSize,
      lineH: line ? line.getBoundingClientRect().height : null, lineLh: lcs?.lineHeight }
  })
  console.log('  pre:', JSON.stringify(st))
  await page.close()
}
await browser.close()
