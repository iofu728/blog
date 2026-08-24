import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
  await page.goto(origin + '/NLP/MInference.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    const uls = [...document.querySelectorAll('.content.custom ul, .vp-doc ul')]
    const ul = uls.find(u => Math.abs(u.getBoundingClientRect().top + scrollY - 1222.5) < 200 && u.textContent.includes('MInference')) || uls[0]
    const ucs = getComputedStyle(ul)
    return {
      ulW: ul.getBoundingClientRect().width, pl: ucs.paddingLeft, lsp: ucs.listStylePosition,
      lis: [...ul.children].map(li => {
        const cs = getComputedStyle(li)
        const r = li.getBoundingClientRect()
        return { h: +r.height.toFixed(1), w: +r.width.toFixed(1), txt: li.textContent.slice(0, 30), fs: cs.fontSize, lh: cs.lineHeight }
      }),
    }
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r, null, 1))
  await page.close()
}
await browser.close()
