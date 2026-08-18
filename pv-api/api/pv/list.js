import { redis, dayKey, setCors, ok, hasTimePermission } from '../_lib.js'

// GET /api/pv/list?timestamp=xxx
// 返回值结构与旧 Java 接口完全一致,前端零改动
export default async function handler(req, res) {
  setCors(req, res)
  if (req.method === 'OPTIONS') return res.status(204).end()

  if (!hasTimePermission(req.query.timestamp)) {
    // 与旧接口一致:非法时间戳返回固定兜底数据
    return ok(res, {
      titleViewsMap: {},
      totalPageViews: 8273,
      totalSpider: 1029831,
      yesterdayPageSpider: 1091,
      yesterdayPageViews: 21,
    })
  }

  const [total, yesterday, titles, spiderTotal, spiderYesterday] = await redis([
    ['GET', 'pv:total'],
    ['GET', `pv:day:${dayKey(1)}`],
    ['HGETALL', 'pv:titles'],
    ['GET', 'pv:spider:total'],
    ['GET', 'pv:spider:yesterday'],
  ])

  // HGETALL 返回扁平数组 [field1, value1, field2, value2, ...]
  const titleViewsMap = {}
  for (let i = 0; i + 1 < (titles || []).length; i += 2) {
    titleViewsMap[titles[i]] = Number(titles[i + 1])
  }

  return ok(res, {
    titleViewsMap,
    totalPageViews: Number(total) || 0,
    totalSpider: Number(spiderTotal) || 0,
    yesterdayPageViews: Number(yesterday) || 0,
    yesterdayPageSpider: Number(spiderYesterday) || 0,
  })
}
