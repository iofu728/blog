import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
  await page.goto(origin + '/Linux/synch.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    const code = document.querySelector('.content.custom div[class*="language-"] pre code, .vp-doc div[class*="language-"] pre code')
    const mk = (txt) => {
      const s = document.createElement('span')
      s.textContent = txt
      code.appendChild(s)
      const w = s.getBoundingClientRect().width
      s.remove()
      return +w.toFixed(3)
    }
    const cs = getComputedStyle(code)
    return { ff: cs.fontFamily, fs: cs.fontSize, tenSpaces: mk('          '), tenM: mk('mmmmmmmmmm'), cjk: mk('未被占用'), featureSettings: cs.fontFeatureSettings, kerning: cs.fontKerning, tr: cs.textRendering }
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r))
  await page.close()
}
await browser.close()
