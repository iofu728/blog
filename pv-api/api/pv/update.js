import { redis, dayKey, setCors, ok, hasTimePermission } from '../_lib.js'

// GET /api/pv/update?timestamp=xxx&titleName=yyy
// 对应旧 Java 接口:总访问量 +1、当日访问量 +1、文章阅读量 +1(首页除外)
export default async function handler(req, res) {
  setCors(req, res)
  if (req.method === 'OPTIONS') return res.status(204).end()

  const { timestamp, titleName } = req.query
  if (!hasTimePermission(timestamp)) {
    // 与旧接口一致:非法时间戳假装成功,不落库
    return ok(res, true)
  }

  const commands = [
    ['INCR', 'pv:total'],
    ['INCR', `pv:day:${dayKey()}`],
  ]
  if (titleName && titleName !== 'null' && titleName !== 'homePage') {
    commands.push(['HINCRBY', 'pv:titles', titleName, 1])
  }
  await redis(commands)
  return ok(res, true)
}
