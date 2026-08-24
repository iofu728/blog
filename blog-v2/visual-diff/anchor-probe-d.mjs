import { chromium } from 'playwright'
const url = process.argv[2]
const browser = await chromium.launch()
const seqs = []
for (const origin of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802']) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
  await page.goto(origin + url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)
  const els = await page.evaluate(() => {
    const root = document.querySelector('.content.custom') || document.querySelector('.vp-doc') || document.querySelector('#app')
    return [...root.querySelectorAll('h1,h2,h3,p,table,tr,ul,ol,div[class*="language-"]')].map(e => {
      const r = e.getBoundingClientRect()
      return { t: e.tagName.toLowerCase(), top: +(r.top + scrollY).toFixed(1), h: +r.height.toFixed(1), txt: (e.textContent || '').trim().slice(0, 12) }
    })
  })
  seqs.push(els)
  await page.close()
}
await browser.close()
const [a, b] = seqs
for (let i = 0; i < Math.max(a.length, b.length); i++) {
  const x = a[i], y = b[i]
  if (!x || !y) { console.log(i, 'MISSING', x?.t, y?.t); continue }
  if (Math.abs(x.top - y.top) > 1 || Math.abs(x.h - y.h) > 1 || x.t !== y.t)
    console.log(i, x.t.padEnd(6), `top ${x.top}/${y.top}`, `h ${x.h}/${y.h}`, x.txt.slice(0,10))
}
