import { chromium } from 'playwright'
const url = process.argv[2]
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
  await page.goto(origin + url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)
  const r = await page.evaluate(() => {
    const pre = document.querySelector('.content.custom div[class*="language-"] pre, .vp-doc div[class*="language-"] pre')
    const cs = getComputedStyle(pre)
    const code = pre.querySelector('code')
    const ccs = getComputedStyle(code)
    // 统计渲染行数:用 range 量每行高度之和不可靠,直接看 span.line 的折行
    const lines = [...code.querySelectorAll('.line')].map(l => l.getBoundingClientRect().height)
    return {
      preW: +pre.getBoundingClientRect().width.toFixed(1),
      pl: cs.paddingLeft, pr: cs.paddingRight, ws: cs.whiteSpace, lh: cs.lineHeight,
      codeFs: ccs.fontSize, codeFf: ccs.fontFamily.slice(0, 30), ls: ccs.letterSpacing,
      nLineSpans: lines.length, lineHs: JSON.stringify(lines.slice(0, 8)),
      codeH: +code.getBoundingClientRect().height.toFixed(1),
    }
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r, null, 1))
  await page.close()
}
await browser.close()
