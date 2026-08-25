import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
  await page.goto(origin + '/Linux/synch.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    const pre = document.querySelector('.content.custom div[class*="language-"] pre, .vp-doc div[class*="language-"] pre')
    const code = pre.querySelector('code')
    // 找文本节点里含 "未被占" 的行,测整行宽度
    const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT)
    let node
    const out = {}
    while ((node = walker.nextNode())) {
      if (node.textContent.includes('未被占')) {
        // 该行所有内容:回到行起点
        let lineStart = node
        const range = document.createRange()
        range.selectNodeContents(node)
        out.commentW = range.getBoundingClientRect().width
        out.commentText = node.textContent
        const cs = getComputedStyle(node.parentElement)
        out.fs = cs.fontSize; out.ff = cs.fontFamily; out.ls = cs.letterSpacing; out.ws = cs.wordSpacing
        break
      }
    }
    return out
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r))
  await page.close()
}
await browser.close()
