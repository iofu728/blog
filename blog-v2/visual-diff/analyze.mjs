// 分析 diff.png 中红色差异像素的行分布,并把 old/new/diff 按差异带裁剪出来
// 用法: node visual-diff/analyze.mjs <dir> [dir...]
import { PNG } from 'pngjs'
import fs from 'node:fs'
import path from 'node:path'

function crop(img, y0, y1) {
  const h = Math.min(y1, img.height) - y0
  if (h <= 0) return null
  const c = new PNG({ width: img.width, height: h })
  PNG.bitblt(img, c, 0, y0, img.width, h, 0, 0)
  return c
}

for (const dir of process.argv.slice(2)) {
  const diff = PNG.sync.read(fs.readFileSync(path.join(dir, 'diff.png')))
  // 找红色像素所在的行
  const rows = new Uint32Array(diff.height)
  for (let y = 0; y < diff.height; y++) {
    for (let x = 0; x < diff.width; x++) {
      const i = (y * diff.width + x) << 2
      if (diff.data[i] > 200 && diff.data[i + 1] < 100 && diff.data[i + 2] < 100) rows[y]++
    }
  }
  // 聚合成差异带(间隔 <40px 合并)
  const bands = []
  let start = -1
  for (let y = 0; y < diff.height; y++) {
    if (rows[y] > 0) {
      if (start < 0) start = y
      else if (y - start > 40000) break
    } else if (start >= 0 && y - lastY(rows, y - 1) > 40) {
      bands.push([start, lastY(rows, y - 1)])
      start = -1
    }
  }
  function lastY(rows, y) { while (y >= 0 && rows[y] === 0) y--; return y }
  if (start >= 0) bands.push([start, lastY(rows, diff.height - 1)])
  const totalRed = rows.reduce((a, b) => a + b, 0)
  console.log(`${path.basename(dir)}  redPx=${totalRed}  bands=${JSON.stringify(bands.slice(0, 12))}${bands.length > 12 ? '...' : ''}`)
  // 导出前 3 个差异带的对比图(上下各留 60px)
  const old = PNG.sync.read(fs.readFileSync(path.join(dir, 'old.png')))
  const nw = PNG.sync.read(fs.readFileSync(path.join(dir, 'new.png')))
  bands.slice(0, 3).forEach(([y0, y1], i) => {
    const a = Math.max(0, y0 - 60), b = y1 + 60
    for (const [name, img] of [['old', old], ['new', nw], ['diff', diff]]) {
      const c = crop(img, a, b)
      if (c) fs.writeFileSync(path.join(dir, `band${i}_${name}.png`), PNG.sync.write(c))
    }
  })
}
