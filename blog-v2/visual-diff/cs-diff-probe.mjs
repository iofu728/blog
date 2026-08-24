import { chromium } from 'playwright'
const browser = await chromium.launch()
const all = []
for (const origin of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802']) {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
  await page.goto(origin + '/Linux/synch.html', { waitUntil: 'domcontentloaded' })
  const r = await page.evaluate(() => {
    const grab = (el) => {
      const cs = getComputedStyle(el)
      const o = {}
      for (const k of cs) o[k] = cs.getPropertyValue(k)
      return o
    }
    const pre = document.querySelector('.content.custom div[class*="language-"] pre, .vp-doc div[class*="language-"] pre')
    const code = pre.querySelector('code')
    const span = code.querySelector('span') || code
    return { pre: grab(pre), code: grab(code), span: grab(span) }
  })
  all.push(r)
  await page.close()
}
await browser.close()
for (const tag of ['pre', 'code', 'span']) {
  const [a, b] = [all[0][tag], all[1][tag]]
  const diffs = Object.keys(a).filter(k => a[k] !== b[k] && !k.startsWith('-webkit-app') && !k.startsWith('perspective'))
  console.log(`== ${tag}: ${diffs.length} diffs`)
  diffs.forEach(k => console.log(`  ${k}: OLD=${a[k]} NEW=${b[k]}`))
}
