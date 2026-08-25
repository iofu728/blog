import { chromium } from 'playwright'
const browser = await chromium.launch()
const seqs = []
for (const origin of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802']) {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
  await page.goto(origin + '/Coding/catalog.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const rows = await page.evaluate(() =>
    [...document.querySelectorAll('.content.custom table tr, .vp-doc table tr')].map(tr => {
      const r = tr.getBoundingClientRect()
      return { top: +(r.top + scrollY).toFixed(1), h: +r.height.toFixed(1), txt: tr.textContent.trim().slice(0, 16) }
    }))
  seqs.push(rows)
  await page.close()
}
await browser.close()
const [a, b] = seqs
console.log('rows:', a.length, b.length)
let shown = 0
for (let i = 0; i < Math.max(a.length, b.length) && shown < 15; i++) {
  if (!a[i] || !b[i] || Math.abs(a[i].h - b[i].h) > 0.5) { console.log(i, JSON.stringify(a[i]), JSON.stringify(b[i])); shown++ }
}
