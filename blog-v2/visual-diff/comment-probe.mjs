import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
  await page.goto(origin + '/Linux/synch.html', { waitUntil: 'domcontentloaded' })
  const r = await page.evaluate(() => {
    const c = document.querySelector('.token.comment') || [...document.querySelectorAll('.vp-doc code span span, .content.custom code span span')].find(s => s.textContent.includes('若'))
    if (!c) return null
    const cs = getComputedStyle(c)
    const before = getComputedStyle(c, '::before')
    return {
      cls: c.className, ml: cs.marginLeft, pl: cs.paddingLeft, fs: cs.fontStyle,
      beforeContent: before.content, beforeLs: before.letterSpacing,
      display: cs.display, textIndent: cs.textIndent,
    }
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r))
  await page.close()
}
await browser.close()
