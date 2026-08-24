import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await ctx.route('**/*', r => /^http:\/\/127\.0\.0\.1/.test(r.request().url()) ? r.continue() : r.abort())
  const page = await ctx.newPage()
  await page.goto(origin + '/Operations/terminal.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    const toc = document.querySelector('.table-of-contents')
    const tr = toc.getBoundingClientRect()
    const tcs = getComputedStyle(toc)
    const ul = toc.querySelector('ul')
    const ucs = getComputedStyle(ul)
    const next = toc.nextElementSibling
    const out = {
      tocTag: toc.tagName, tocBottom: +(tr.bottom + scrollY).toFixed(2), tocMb: tcs.marginBottom,
      ulMb: ucs.marginBottom, ulBottom: +(ul.getBoundingClientRect().bottom + scrollY).toFixed(2),
      nextTag: next.tagName, nextH: next.getBoundingClientRect().height,
      next2: [],
    }
    let n = toc
    for (let k = 0; k < 3; k++) { n = n.nextElementSibling; if (!n) break
      out.next2.push({ tag: n.tagName, top: +(n.getBoundingClientRect().top + scrollY).toFixed(2), h: +n.getBoundingClientRect().height.toFixed(2), mt: getComputedStyle(n).marginTop, mb: getComputedStyle(n).marginBottom }) }
    return out
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r, null, 1))
  await ctx.close()
}
await browser.close()
