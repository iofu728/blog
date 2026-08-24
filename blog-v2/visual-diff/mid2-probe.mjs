import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await ctx.route('**/*', r => /^http:\/\/127\.0\.0\.1/.test(r.request().url()) ? r.continue() : r.abort())
  const page = await ctx.newPage()
  await page.goto(origin + '/Operations/brew.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    const out = []
    const acts = document.querySelector('.card__actions')
    let n = acts
    for (let k = 0; k < 6 && n; k++, n = n.nextElementSibling) {
      const r = n.getBoundingClientRect()
      const cs = getComputedStyle(n)
      out.push(`<${n.tagName.toLowerCase()}.${(typeof n.className === 'string' ? n.className.split(' ').slice(0, 2).join('.') : '')}> top=${(r.top + scrollY).toFixed(1)} h=${r.height.toFixed(1)} mt=${cs.marginTop} mb=${cs.marginBottom} minH=${cs.minHeight}`)
    }
    return out
  })
  console.log(i === 0 ? 'OLD' : 'NEW')
  r.forEach(x => console.log(' ', x))
  await ctx.close()
}
await browser.close()
