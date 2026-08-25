// 性能对比:线上旧站 vs 本地新站
// 用法: node visual-diff/perf.mjs
import { chromium } from 'playwright'

const OLD = process.env.OLD_ORIGIN || 'https://wyydsb.xin'
const NEW = process.env.NEW_ORIGIN || 'http://localhost:4173'
const NEW_COOKIE = process.env.NEW_COOKIE || ''
const PAGES = ['/', '/Coding/LeetCode.html', '/NLP/LLMLingua_en.html', '/Operations/terminal.html', '/tags/']
const RUNS = 3

async function measure(browser, origin, url, cookie) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  if (cookie) {
    const u = new URL(origin)
    await context.addCookies([{ name: cookie.split('=')[0], value: cookie.split('=')[1], domain: u.hostname, path: '/' }])
  }
  const page = await context.newPage()
  let bytes = 0, reqs = 0
  page.on('response', async res => {
    reqs++
    try {
      const body = await res.body().catch(() => null)
      if (body) bytes += body.length
    } catch {}
  })
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.goto(origin + url, { waitUntil: 'load', timeout: 60000 })
      break
    } catch (e) {
      if (attempt === 2) throw e
      await page.waitForTimeout(2000)
    }
  }
  await page.waitForTimeout(2000)
  const t = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] || {}
    const paints = performance.getEntriesByType('paint')
    const fcp = (paints.find(p => p.name === 'first-contentful-paint') || {}).startTime || 0
    const res = performance.getEntriesByType('resource')
    const xfer = res.reduce((s, r) => s + (r.transferSize || 0), 0) + (nav.transferSize || 0)
    return {
      dcl: Math.round(nav.domContentLoadedEventEnd || 0),
      load: Math.round(nav.loadEventEnd || 0),
      fcp: Math.round(fcp),
      xferKB: Math.round(xfer / 1024),
      resCount: res.length,
    }
  })
  await context.close()
  return { ...t, bytesKB: Math.round(bytes / 1024), reqs }
}

const browser = await chromium.launch()
const median = arr => arr.sort((a, b) => a - b)[Math.floor(arr.length / 2)]

console.log('page'.padEnd(32), 'site', 'FCP'.padStart(6), 'DCL'.padStart(6), 'load'.padStart(6), 'xferKB'.padStart(8), 'reqs'.padStart(5))
for (const url of PAGES) {
  const rows = {}
  for (const [name, origin] of [['old', OLD], ['new', NEW]]) {
    const runs = []
    for (let i = 0; i < RUNS; i++) runs.push(await measure(browser, origin, url, name === 'new' ? NEW_COOKIE : ''))
    rows[name] = {
      fcp: median(runs.map(r => r.fcp)),
      dcl: median(runs.map(r => r.dcl)),
      load: median(runs.map(r => r.load)),
      xferKB: median(runs.map(r => r.xferKB)),
      reqs: median(runs.map(r => r.reqs)),
    }
  }
  for (const name of ['old', 'new']) {
    const r = rows[name]
    console.log(url.padEnd(32), name, String(r.fcp).padStart(6), String(r.dcl).padStart(6), String(r.load).padStart(6), String(r.xferKB).padStart(8), String(r.reqs).padStart(5))
  }
}
await browser.close()
