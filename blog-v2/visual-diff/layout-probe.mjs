import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const url of ['/tags/', '/Coding/1040.html']) {
  for (const [i, origin] of ['http://127.0.0.1:8801', 'http://127.0.0.1:8802'].entries()) {
    const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
    await page.goto(origin + url, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1200)
    const r = await page.evaluate(() => {
      const d = document.querySelector('.navigation-drawer')
      const t = document.querySelector('.toolbar, .blog-toolbar')
      const dr = d.getBoundingClientRect(), tr = t.getBoundingClientRect()
      return { drawerTop: dr.top, drawerH: dr.height, tbLeft: tr.left, tbTop: tr.top, tbCls: t.className.slice(0, 80), dCls: d.className.slice(0, 100) }
    })
    console.log(url, i === 0 ? 'OLD' : 'NEW', JSON.stringify(r))
    await page.close()
  }
}
await browser.close()
