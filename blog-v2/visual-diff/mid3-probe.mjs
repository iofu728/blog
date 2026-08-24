import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await ctx.route('**/*', r => /^http:\/\/127\.0\.0\.1/.test(r.request().url()) ? r.continue() : r.abort())
  const page = await ctx.newPage()
  await page.goto(origin + '/Operations/brew.html', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    const out = []
    const all = document.querySelectorAll('body *')
    for (const e of all) {
      const r = e.getBoundingClientRect()
      const t = r.top + scrollY
      if (t > 5755 && t < 6000 && r.height > 0 && e.children.length === 0) {
        out.push(`<${e.tagName.toLowerCase()}.${(typeof e.className === 'string' ? e.className.split(' ')[0] : '')}> top=${t.toFixed(1)} h=${r.height.toFixed(1)}`)
      }
    }
    // 找 comment 容器
    const c = document.querySelector('.comment, .gt-container, #gitalk-container, [id*="gitalk"]')
    if (c) {
      const r = c.getBoundingClientRect()
      const cs = getComputedStyle(c)
      out.push(`COMMENT <${c.tagName.toLowerCase()}.${typeof c.className === 'string' ? c.className.split(' ')[0] : ''}#${c.id}> top=${(r.top + scrollY).toFixed(1)} h=${r.height.toFixed(1)} minH=${cs.minHeight} mt=${cs.marginTop}`)
    }
    return out
  })
  console.log(i === 0 ? 'OLD' : 'NEW')
  r.forEach(x => console.log(' ', x))
  await ctx.close()
}
await browser.close()
