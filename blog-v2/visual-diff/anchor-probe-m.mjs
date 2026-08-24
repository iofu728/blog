import { chromium } from 'playwright'
const url = process.argv[2]
const browser = await chromium.launch()
const seqs = []
for (const origin of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802']) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }); await ctx.route("**/*", r => /^http:\/\/127\.0\.0\.1/.test(r.request().url()) ? r.continue() : r.abort()); const page = await ctx.newPage()
  await page.goto(origin + url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)
  const els = await page.evaluate(() => {
    const root = document.querySelector('.content.custom') || document.querySelector('.vp-doc')
    return [...root.querySelectorAll('h1,h2,h3,h4,p,blockquote,ol,ul,div[class*="language-"],table,img,figure')].map(e => {
      const r = e.getBoundingClientRect()
      return { t: e.tagName.toLowerCase(), top: +(r.top + scrollY).toFixed(1), h: +r.height.toFixed(1), txt: (e.textContent || '').trim().slice(0, 14) }
    })
  })
  seqs.push(els)
  await page.close()
}
await browser.close()
const [a, b] = seqs
for (let i = 0; i < Math.max(a.length, b.length); i++) {
  const x = a[i], y = b[i]
  if (!x || !y) { console.log(i, 'MISSING', JSON.stringify(x), JSON.stringify(y)); continue }
  const dTop = (x.top - y.top).toFixed(1), dH = (x.h - y.h).toFixed(1)
  const mark = (Math.abs(x.top - y.top) > 1 || Math.abs(x.h - y.h) > 1 || x.t !== y.t) ? ' <<<' : ''
  if (mark || (i > 0 && i < 200)) console.log(i, x.t.padEnd(10), `top ${x.top}/${y.top} d=${dTop}`, `h ${x.h}/${y.h} d=${dH}`, x.txt.slice(0,10), mark)
}
