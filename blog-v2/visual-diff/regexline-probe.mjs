import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await ctx.route('**/*', r => /^http:\/\/127\.0\.0\.1/.test(r.request().url()) ? r.continue() : r.abort())
  const page = await ctx.newPage()
  await page.goto(origin + '/Operations/terminal.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let node
    while ((node = walker.nextNode())) {
      if (node.textContent.includes('file_regex')) {
        const range = document.createRange()
        range.selectNodeContents(node)
        const rects = [...range.getClientRects()].map(r => ({ x: +r.left.toFixed(1), y: +r.top.toFixed(1), w: +r.width.toFixed(1) }))
        const cs = getComputedStyle(node.parentElement)
        // 找行首位置
        return { rects, fs: cs.fontSize, ff: cs.fontFamily.slice(0, 25), parentCls: node.parentElement.className || node.parentElement.tagName }
      }
    }
    return null
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r, null, 1))
  await ctx.close()
}
await browser.close()
