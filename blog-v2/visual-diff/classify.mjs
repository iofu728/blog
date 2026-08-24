// 对 report.json 里 >1% 的条目做归因:
// 取两边页面代码块(div[class*=language-])的矩形区域,统计 diff.png 红色像素
// 落在代码块内(prism-tomorrow→one-dark-pro 配色差异,预期) vs 代码块外(需人工看)
import { chromium } from 'playwright'
import { PNG } from 'pngjs'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = dirname
const ORIGINS = ['http://127.0.0.1:8801', 'http://127.0.0.1:8802']
const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 },
}
const BLOCK_RE = /utteranc|googletagmanager|google-analytics|cdnjs\.cloudflare\.com|\/api\/pv\//

async function codeRects(browser, origin, url, vp) {
  const context = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, reducedMotion: 'reduce' })
  await context.route('**/*', route => BLOCK_RE.test(route.request().url()) ? route.abort() : route.continue())
  const page = await context.newPage()
  try {
    await page.goto(origin + url, { waitUntil: 'networkidle', timeout: 45000 })
  } catch (e) { /* 容忍 */ }
  await page.evaluate(() => { document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager' }) })
  await page.waitForFunction(() => [...document.images].every(i => i.complete), null, { timeout: 30000 }).catch(() => {})
  await page.waitForTimeout(800)
  const rects = await page.evaluate(() =>
    [...document.querySelectorAll('.content.custom div[class*="language-"], .vp-doc div[class*="language-"]')].map(e => {
      const r = e.getBoundingClientRect()
      return { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) }
    }))
  const bodyH = await page.evaluate(() => document.body.scrollHeight)
  await context.close()
  return { rects, bodyH }
}

const report = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'report.json'), 'utf-8'))
const targets = report.filter(r => r.ratio > 0.01)
console.log(`classifying ${targets.length} entries`)
const browser = await chromium.launch()
const out = []

for (const t of targets) {
  const dir = path.join(OUT_DIR, `${t.url.replace(/^\//, '').replace(/\/$/, '').replace(/[\/\s]+/g, '_') || 'home'}.${t.viewport}`)
  if (!fs.existsSync(path.join(dir, 'diff.png'))) { console.log('skip(no diff)', t.url, t.viewport); continue }
  const vp = VIEWPORTS[t.viewport]
  const [a, b] = await Promise.all([
    codeRects(browser, ORIGINS[0], t.url, vp),
    codeRects(browser, ORIGINS[1], t.url, vp),
  ])
  const diff = PNG.sync.read(fs.readFileSync(path.join(dir, 'diff.png')))
  const inRect = (x, y, r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h
  const rects = [...a.rects, ...b.rects]
  let red = 0, redInCode = 0
  for (let y = 0; y < diff.height; y++) {
    for (let x = 0; x < diff.width; x++) {
      const i = (y * diff.width + x) << 2
      if (diff.data[i] > 200 && diff.data[i + 1] < 100 && diff.data[i + 2] < 100) {
        red++
        if (rects.some(r => inRect(x, y, r))) redInCode++
      }
    }
  }
  const totalPx = diff.width * diff.height
  const outsideRatio = (red - redInCode) / totalPx
  out.push({ ...t, red, redInCode, inCodePct: red ? +(redInCode * 100 / red).toFixed(1) : 0, outsideRatio: +(outsideRatio * 100).toFixed(2) })
  console.log(`${(t.ratio * 100).toFixed(2).padStart(6)}%  ${t.viewport.padEnd(7)}  ${t.url.padEnd(40)}  inCode=${red ? (redInCode * 100 / red).toFixed(0) : '-'}%  outside=${(outsideRatio * 100).toFixed(2)}%`)
}

await browser.close()
out.sort((x, y) => y.outsideRatio - x.outsideRatio)
fs.writeFileSync(path.join(OUT_DIR, 'classify.json'), JSON.stringify(out, null, 2))
console.log('\n==== 按代码块外差异排序(前 25)====')
out.slice(0, 25).forEach(r => console.log(`  outside=${r.outsideRatio}%  total=${(r.ratio * 100).toFixed(2)}%  ${r.viewport}  ${r.url}`))
