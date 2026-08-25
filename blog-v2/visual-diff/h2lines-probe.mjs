import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await ctx.route('**/*', r => /^http:\/\/127\.0\.0\.1/.test(r.request().url()) ? r.continue() : r.abort())
  const page = await ctx.newPage()
  await page.goto(origin + '/NLP/rnn.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    const hs = [...document.querySelectorAll('.content.custom h2, .vp-doc h2')]
    const h = hs.find(e => Math.abs(e.getBoundingClientRect().top + scrollY - 5872.3) < 30) || hs[0]
    // 逐词测量:把文本节点按词切开量每行内容
    const textNode = [...h.childNodes].find(n => n.nodeType === 3 && n.textContent.trim())
    const words = textNode.textContent.split(' ')
    const lines = {}
    const range = document.createRange()
    let pos = 0
    for (const w of words) {
      const idx = textNode.textContent.indexOf(w, pos)
      range.setStart(textNode, idx); range.setEnd(textNode, idx + w.length)
      const r = range.getBoundingClientRect()
      const y = Math.round(r.top)
      ;(lines[y] = lines[y] || []).push(w)
      pos = idx + w.length
    }
    return Object.values(lines).map(l => l.join(' '))
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r))
  await ctx.close()
}
await browser.close()
