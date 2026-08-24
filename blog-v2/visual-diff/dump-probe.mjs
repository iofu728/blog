import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
  await page.goto(origin + '/Linux/synch.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    const code = document.querySelector('.content.custom div[class*="language-"] pre code, .vp-doc div[class*="language-"] pre code')
    // 找到含 "owner ID" 的行(第2逻辑行)和注释行,列出 code 的前 N 个子节点
    const out = []
    const nodes = [...code.childNodes]
    let y = null
    for (const n of nodes) {
      const txt = n.textContent
      if (txt.includes('atomic_long_t') || (y !== null && out.length < 25)) {
        const range = document.createRange()
        range.selectNodeContents(n)
        const rects = [...range.getClientRects()].map(r => `${r.left.toFixed(1)},${r.top.toFixed(1)},w${r.width.toFixed(1)}`)
        out.push(`${n.nodeType === 3 ? 'TEXT' : n.nodeName + '.' + (n.className?.baseVal ?? n.className ?? '')} ${JSON.stringify(txt.slice(0, 40))} @ ${rects.join(' | ')}`)
        if (y === null) y = 1
      }
      if (out.length >= 25) break
    }
    return out
  })
  console.log(i === 0 ? '==== OLD' : '==== NEW')
  r.forEach(x => console.log(' ', x))
  await page.close()
}
await browser.close()
