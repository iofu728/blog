import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
  await page.goto(origin + '/Spider/jsdecoder.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)
  const r = await page.evaluate(() => {
    const bq = document.querySelector('.content.custom blockquote, .vp-doc blockquote')
    const dump = (el, d) => el ? `${' '.repeat(d)}<${el.tagName.toLowerCase()}> h=${el.getBoundingClientRect().height.toFixed(1)} "${(el.childNodes[0]?.textContent||'').trim().slice(0,20)}"` : ''
    let out = []
    const walk = (el, d) => { out.push(dump(el, d)); [...el.children].forEach(c => walk(c, d + 2)) }
    walk(bq, 0)
    return out.join('\n')
  })
  console.log(i === 0 ? '==== OLD' : '==== NEW')
  console.log(r)
  await page.close()
}
await browser.close()
