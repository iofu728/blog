// 全量视觉对比:旧站 dist(8801) vs 新站 dist(8802)
// 用法: node visual-diff/compare.mjs [页面过滤子串]
import { chromium } from 'playwright'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const OLD_ORIGIN = process.env.OLD_ORIGIN || 'http://127.0.0.1:8801'
const NEW_ORIGIN = process.env.NEW_ORIGIN || 'http://127.0.0.1:8802'
const OUT_DIR = path.join(dirname)
const OLD_DIST = path.resolve(dirname, '../../docs/.vuepress/dist')

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
]

// 两边完全一致的屏蔽策略:只允许本机源,第三方(评论/统计/MathJax/外链图片 CDN)全部断掉,
// 避免网络波动与 CDN 限流造成的假差异
const BLOCK_RE = /^(?!http:\/\/127\.0\.0\.1)/

// 从旧 dist 收集 86 个页面,index 页转成目录形式
function collectPages() {
  const out = []
  const walk = dir => {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name)
      if (fs.statSync(p).isDirectory()) walk(p)
      else if (name.endsWith('.html')) {
        const rel = path.relative(OLD_DIST, p).split(path.sep).join('/')
        out.push('/' + rel.replace(/(^|\/)index\.html$/, '$1'))
      }
    }
  }
  walk(OLD_DIST)
  return out.sort()
}

function sanitize(url) {
  return url.replace(/^\//, '').replace(/\/$/, '').replace(/[\/\s]+/g, '_') || 'home'
}

async function shot(browser, origin, url, vp) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  })
  await context.route('**/*', route => {
    const u = route.request().url()
    BLOCK_RE.lastIndex = 0
    if (BLOCK_RE.test(u)) return route.abort()
    return route.continue()
  })
  const page = await context.newPage()
  try {
    await page.goto(origin + url, { waitUntil: 'networkidle', timeout: 45000 })
  } catch (e) {
    // networkidle 偶发超时(长连接),退回已加载状态继续
    console.warn(`  [warn] goto ${origin}${url}: ${e.message.split('\n')[0]}`)
  }
  await page.waitForTimeout(1500)
  // 新站正文图片是 loading="lazy",快速滚动不会触发加载(Chrome 会跳过);
  // 直接把未加载的 lazy 图片切 eager(两边一致处理,旧站本来就没有 lazy)
  await page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager' })
  })
  await page.waitForLoadState('networkidle').catch(() => {})
  // 硬等所有图片加载完成(nlark CDN 慢时 networkidle 不可靠)
  await page.waitForFunction(() => [...document.images].every(i => i.complete), null, { timeout: 30000 }).catch(() => {})
  await page.waitForTimeout(600)
  // bibtex 里嵌了 location.origin,两个服务器端口不同,归一化消除假阳性
  await page.evaluate(() => {
    document.querySelectorAll('.bibtex').forEach(e => {
      e.textContent = e.textContent.replace(/https?:\/\/[^/\s}]+/g, 'ORIGIN')
    })
  })
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
  const buf = await page.screenshot({ fullPage: true })
  await context.close()
  return buf
}

const filter = process.argv[2]
// --retry-over1: 只重跑上一轮 report.json 里 >1% 的页面,通过的删除对应 diff 目录
const retryOver1 = filter === '--retry-over1'
let pages = collectPages().filter(p => !filter || retryOver1 || p.includes(filter))
let prevResults = []
if (retryOver1) {
  prevResults = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'report.json'), 'utf-8'))
  const set = new Set(prevResults.filter(r => r.ratio > 0.01).map(r => r.url))
  pages = pages.filter(p => set.has(p))
}
console.log(`pages: ${pages.length}`)

const browser = await chromium.launch()
const results = []

for (const vp of VIEWPORTS) {
  for (const url of pages) {
    const [oldBuf, newBuf] = await Promise.all([
      shot(browser, OLD_ORIGIN, url, vp),
      shot(browser, NEW_ORIGIN, url, vp),
    ])
    const a = PNG.sync.read(oldBuf)
    const b = PNG.sync.read(newBuf)
    const w = Math.max(a.width, b.width)
    const h = Math.max(a.height, b.height)
    // 尺寸不同:canvas 对齐到最大,缺失部分视为全量差异
    const norm = img => {
      if (img.width === w && img.height === h) return img
      const c = new PNG({ width: w, height: h })
      PNG.bitblt(img, c, 0, 0, img.width, img.height, 0, 0)
      return c
    }
    const na = norm(a)
    const nb = norm(b)
    const diff = new PNG({ width: w, height: h })
    const mismatched = pixelmatch(na.data, nb.data, diff.data, w, h, { threshold: 0.1 })
    const ratio = mismatched / (w * h)
    results.push({ url, viewport: vp.name, ratio, w, h, sameSize: a.width === b.width && a.height === b.height, oldH: a.height, newH: b.height })
    const dir = path.join(OUT_DIR, `${sanitize(url)}.${vp.name}`)
    if (ratio > 0.01) {
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, 'old.png'), oldBuf)
      fs.writeFileSync(path.join(dir, 'new.png'), newBuf)
      fs.writeFileSync(path.join(dir, 'diff.png'), PNG.sync.write(diff))
    } else if (retryOver1) {
      // 本轮已通过,清掉旧 diff 目录
      fs.rmSync(dir, { recursive: true, force: true })
    }
    console.log(`${(ratio * 100).toFixed(2).padStart(6)}%  ${vp.name.padEnd(7)}  ${url}${a.height !== b.height ? `  (height ${a.height} vs ${b.height})` : ''}`)
  }
}

await browser.close()
// retry 模式:与上一轮结果合并(重测的页面用新值,未重测的保留旧值)
const merged = retryOver1
  ? [...prevResults.filter(p => !results.some(r => r.url === p.url && r.viewport === p.viewport)), ...results]
  : results
merged.sort((x, y) => y.ratio - x.ratio)
fs.writeFileSync(path.join(OUT_DIR, 'report.json'), JSON.stringify(merged, null, 2))
console.log('\n==== sorted by diff ratio ====')
const buckets = { '>10%': 0, '5-10%': 0, '1-5%': 0, '0.1-1%': 0, '<=0.1%': 0 }
for (const r of merged) {
  const p = r.ratio * 100
  buckets[p > 10 ? '>10%' : p > 5 ? '5-10%' : p > 1 ? '1-5%' : p > 0.1 ? '0.1-1%' : '<=0.1%']++
}
console.log(buckets)
console.log('\npages > 1%:')
merged.filter(r => r.ratio > 0.01).forEach(r => console.log(`  ${(r.ratio * 100).toFixed(2)}%  ${r.viewport}  ${r.url}`))
