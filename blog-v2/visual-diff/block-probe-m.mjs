import { chromium } from 'playwright'
const url = process.argv[2]
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
  await page.goto(origin + url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)
  const blocks = await page.evaluate(() =>
    [...document.querySelectorAll('.content.custom div[class*="language-"], .vp-doc div[class*="language-"]')].map(e => {
      const r = e.getBoundingClientRect()
      return `top=${Math.round(r.top + scrollY)} h=${Math.round(r.height)}`
    }))
  const bodyH = await page.evaluate(() => document.body.scrollHeight)
  console.log(i === 0 ? 'OLD' : 'NEW', 'bodyH=' + bodyH)
  blocks.forEach(b => console.log(' ', b))
  await page.close()
}
await browser.close()
