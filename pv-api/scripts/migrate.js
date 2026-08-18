// 把 MySQL 导出的 TSV 数据写入 Upstash Redis
// 用法:
//   export UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
//   export UPSTASH_REDIS_REST_TOKEN=xxx
//   node scripts/migrate.js page_views.tsv title_views.tsv
//
// page_views.tsv: 每行 `today_views  existed_views  existed_spider  date`,最新一行在前(ORDER BY id DESC LIMIT 2)
// title_views.tsv: 每行 `title_name  local_views  zhihu_views  csdn_views`

import { readFileSync } from 'node:fs'

const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env
if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  console.error('请先设置 UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN')
  process.exit(1)
}

const [pageViewsFile, titleViewsFile] = process.argv.slice(2)
if (!pageViewsFile || !titleViewsFile) {
  console.error('用法: node scripts/migrate.js page_views.tsv title_views.tsv')
  process.exit(1)
}

const parseTsv = file =>
  readFileSync(file, 'utf8')
    .split('\n')
    .filter(line => line.trim())
    .map(line => line.split('\t'))

const pageRows = parseTsv(pageViewsFile)
const titleRows = parseTsv(titleViewsFile)

const [today, existed, spider] = pageRows[0].map(Number)
const commands = [['SET', 'pv:total', String(today + existed)]]

if (pageRows[1]) {
  // 次新一行是昨天的数据:补上昨日访问量,否则切换后昨日访问量显示 0
  const [, , yesterdaySpider, yesterdayDate] = pageRows[1]
  commands.push(['SET', `pv:day:${yesterdayDate}`, pageRows[1][0]])
  commands.push(['SET', 'pv:spider:yesterday', String(spider - Number(yesterdaySpider))])
}
// 爬虫数没有实时来源(Java 时代也是日志离线导入),迁移后保持为静态值
commands.push(['SET', 'pv:spider:total', String(spider)])

// 展示口径与旧 Java 接口保持一致:local + zhihu + csdn * 2
const titlePairs = []
for (const [name, local, zhihu, csdn] of titleRows) {
  titlePairs.push(name, String(Number(local) + Number(zhihu) + Number(csdn) * 2))
}
if (titlePairs.length) {
  commands.push(['HSET', 'pv:titles', ...titlePairs])
}

const res = await fetch(`${UPSTASH_REDIS_REST_URL}/pipeline`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(commands),
})
const result = await res.json()

for (const item of result) {
  if (item.error) {
    console.error('写入失败:', item.error)
    process.exit(1)
  }
}
console.log(`迁移完成: 累计访问量=${today + existed}, 文章数=${titleRows.length}`)
