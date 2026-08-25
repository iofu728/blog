import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
  await page.goto(origin + '/Linux/synch.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    const pre = document.querySelector('.content.custom div[class*="language-"] pre, .vp-doc div[class*="language-"] pre')
    const code = pre.querySelector('code')
    const preR = pre.getBoundingClientRect()
    const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT)
    let node
    const out = { preLeft: preR.left, preRight: preR.right, lines: [] }
    while ((node = walker.nextNode())) {
      if (node.textContent.includes('未被占')) {
        const range = document.createRange()
        range.selectNodeContents(node)
        out.frags = [...range.getClientRects()].map(r => ({ x: +r.left.toFixed(1), y: +r.top.toFixed(1), w: +r.width.toFixed(1) }))
        out.text = node.textContent.slice(0, 60)
        // 单字符宽度测试:量 'mutex' 子串
        const idx = node.textContent.indexOf('mutex')
        const r2 = document.createRange()
        r2.setStart(node, idx); r2.setEnd(node, idx + 5)
        out.mutexW = +r2.getBoundingClientRect().width.toFixed(2)
        const r3 = document.createRange()
        r3.setStart(node, 0); r3.setEnd(node, Math.min(10, node.textContent.length))
        out.first10 = +r3.getBoundingClientRect().width.toFixed(2)
        break
      }
    }
    return out
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r, null, 1))
  await page.close()
}
await browser.close()
