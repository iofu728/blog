import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await ctx.route('**/*', r => /^http:\/\/127\.0\.0\.1/.test(r.request().url()) ? r.continue() : r.abort())
  const page = await ctx.newPage()
  await page.goto(origin + '/Operations/terminal.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    const h = [...document.querySelectorAll('.content.custom h2, .content.custom h3, .vp-doc h2, .vp-doc h3')].find(e => e.textContent.includes('Clipboard'))
    return [...h.childNodes].map(n => {
      const range = document.createRange()
      range.selectNode(n)
      const r = range.getClientRects()[0]
      return `${n.nodeType === 3 ? 'TEXT' : n.nodeName} ${JSON.stringify(n.textContent.slice(0, 15))} x=${r?.left.toFixed(1)}`
    })
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r))
  await ctx.close()
}
await browser.close()
