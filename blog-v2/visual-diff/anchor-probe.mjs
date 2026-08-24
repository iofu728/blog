import { chromium } from 'playwright'
const url = process.argv[2] || '/Coding/1040.html'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
  await page.goto(origin + url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)
  const els = await page.evaluate(() => {
    const root = document.querySelector('.content.custom') || document.querySelector('.vp-doc')
    return [...root.querySelectorAll('h1,h2,h3,p,blockquote,ol,ul,div[class*="language-"],table,img')].map(e => {
      const r = e.getBoundingClientRect()
      return `${e.tagName.toLowerCase()} top=${Math.round(r.top + scrollY)} h=${Math.round(r.height)} "${(e.textContent || '').trim().slice(0, 16)}"`
    })
  })
  console.log(i === 0 ? '==== OLD' : '==== NEW')
  els.forEach(x => console.log(' ', x))
  await page.close()
}
await browser.close()
