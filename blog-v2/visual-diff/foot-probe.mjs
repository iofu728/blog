import { chromium } from 'playwright'
const url = process.argv[2]
const browser = await chromium.launch()
for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await ctx.route('**/*', r => /^http:\/\/127\.0\.0\.1/.test(r.request().url()) ? r.continue() : r.abort())
  const page = await ctx.newPage()
  await page.goto(origin + url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    const root = document.querySelector('.content.custom') || document.querySelector('.vp-doc')
    const last = [...root.querySelectorAll('*')].filter(e => e.children.length === 0).pop()
    let lastBlock = root.lastElementChild
    const footer = document.querySelector('.blog-footer') || document.querySelector('footer')
    const prevNext = document.querySelector('.page-nav, .prev-next, [class*="page-edit"], .v-list')
    return {
      rootBottom: +(root.getBoundingClientRect().bottom + scrollY).toFixed(1),
      lastBlockTag: lastBlock?.tagName, lastBlockBottom: +(lastBlock.getBoundingClientRect().bottom + scrollY).toFixed(1), lastBlockMb: getComputedStyle(lastBlock).marginBottom,
      footerTop: footer ? +(footer.getBoundingClientRect().top + scrollY).toFixed(1) : null,
      bodyH: document.body.scrollHeight,
    }
  })
  console.log(i === 0 ? 'OLD' : 'NEW', JSON.stringify(r))
  await ctx.close()
}
await browser.close()
