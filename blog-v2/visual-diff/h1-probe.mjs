import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
  await page.goto(origin + '/Coding/1040.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)
  const r = await page.evaluate(() => {
    const h1 = document.querySelector('.content.custom h1, .vp-doc h1')
    const cs = getComputedStyle(h1)
    const codeLines = [...document.querySelectorAll('div[class*="language-"] code')][0]
    const lineCount = codeLines ? codeLines.querySelectorAll('.line').length : 0
    const codeText = codeLines ? codeLines.textContent.split('\n').length : 0
    return {
      h1: { pt: cs.paddingTop, pb: cs.paddingBottom, bb: cs.borderBottomWidth, mt: cs.marginTop, mb: cs.marginBottom, h: h1.getBoundingClientRect().height, inner: h1.innerHTML.slice(0, 120) },
      lineCount, codeText,
    }
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r, null, 1))
  await page.close()
}
await browser.close()
