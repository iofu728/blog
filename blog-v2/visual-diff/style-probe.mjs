import { chromium } from 'playwright'
const url = process.argv[2] || '/Coding/1014.html'
const origins = ['http://127.0.0.1:8801', 'http://127.0.0.1:8802']
const SELS = [
  ['p', '.content.custom p, .vp-doc p'],
  ['li', '.content.custom li, .vp-doc li'],
  ['h1', '.content.custom h1, .vp-doc h1'],
  ['h2', '.content.custom h2, .vp-doc h2'],
  ['blockquote p', '.content.custom blockquote p, .vp-doc blockquote p'],
  ['img', '.content.custom img, .vp-doc img'],
  ['code(inline)', '.content.custom p code, .vp-doc p code'],
  ['pre code', '.content.custom pre code, .vp-doc pre code'],
]
const browser = await chromium.launch()
for (const [i, origin] of origins.entries()) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
  await page.goto(origin + url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1000)
  console.log(`==== ${i === 0 ? 'OLD 8801' : 'NEW 8802'} ${url} ====`)
  for (const [label, sel] of SELS) {
    const r = await page.evaluate((sel) => {
      const e = document.querySelector(sel)
      if (!e) return null
      const cs = getComputedStyle(e)
      return { fs: cs.fontSize, lh: cs.lineHeight, mt: cs.marginTop, mb: cs.marginBottom, ff: cs.fontFamily.slice(0, 40), w: cs.fontWeight }
    }, sel)
    console.log(label.padEnd(14), r ? JSON.stringify(r) : '(none)')
  }
  await page.close()
}
await browser.close()
