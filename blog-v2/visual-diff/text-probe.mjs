import { chromium } from 'playwright'
const url = process.argv[2]
const browser = await chromium.launch()
const texts = []
for (const origin of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802']) {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
  await page.goto(origin + url, { waitUntil: 'domcontentloaded' })
  const t = await page.evaluate(() => {
    const code = document.querySelector('.content.custom div[class*="language-"] pre code, .vp-doc div[class*="language-"] pre code')
    return code.textContent
  })
  texts.push(t)
  await page.close()
}
await browser.close()
const [a, b] = texts
console.log('old len', a.length, 'new len', b.length)
const al = a.split('\n'), bl = b.split('\n')
for (let i = 0; i < Math.max(al.length, bl.length); i++) {
  if (al[i] !== bl[i]) console.log(`line ${i}: OLD=${JSON.stringify(al[i])} NEW=${JSON.stringify(bl[i])}`)
}
