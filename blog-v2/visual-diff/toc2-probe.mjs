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
    const out = []
    let n = toc.parentElement
    out.push(`PARENT <${n.tagName.toLowerCase()}> h=${n.getBoundingClientRect().height.toFixed(1)}`)
    let sib = toc.previousElementSibling
    for (let k = 0; k < 2 && sib; k++, sib = sib.previousElementSibling) out.push(`prev <${sib.tagName.toLowerCase()}> h=${sib.getBoundingClientRect().height.toFixed(1)} top=${(sib.getBoundingClientRect().top+scrollY).toFixed(1)}`)
    sib = toc.nextElementSibling
    for (let k = 0; k < 3 && sib; k++, sib = sib.nextElementSibling) out.push(`next <${sib.tagName.toLowerCase()}> h=${sib.getBoundingClientRect().height.toFixed(1)} top=${(sib.getBoundingClientRect().top+scrollY).toFixed(1)}`)
    out.push(`toc top=${(toc.getBoundingClientRect().top+scrollY).toFixed(1)} h=${toc.getBoundingClientRect().height.toFixed(1)}`)
    return out
  })
  console.log(i === 0 ? 'OLD' : 'NEW', r.join(' | '))
  await ctx.close()
}
await browser.close()
