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
    const root = document.querySelector('.content.custom') || document.querySelector('.vp-doc')
    let n = root.parentElement
    // 向上找 card 容器,列出 content 之后的兄弟节点
    let container = root
    while (container && container.children.length < 2) container = container.parentElement
    const sibs = [...container.children]
    sibs.forEach(s => {
      const r = s.getBoundingClientRect()
      out.push(`<${s.tagName.toLowerCase()}.${(s.className && typeof s.className === 'string' ? s.className.split(' ')[0] : '')}> top=${(r.top + scrollY).toFixed(1)} h=${r.height.toFixed(1)}`)
    })
    return out
  })
  console.log(i === 0 ? 'OLD' : 'NEW')
  r.forEach(x => console.log(' ', x))
  await ctx.close()
}
await browser.close()
