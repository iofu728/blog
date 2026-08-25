import { redis, setCors, ok } from '../_lib.js'

// GET /api/comments/notify —— Vercel Cron 每日 21:00(北京时间)触发
// 把收件箱里积压的新评论汇总成一条 Server酱 微信推送;没有新评论则不发
// 鉴权:Vercel Cron 自动带 Authorization: Bearer $CRON_SECRET;手动触发用 x-admin-token
export default async function handler(req, res) {
  setCors(req, res)
  if (req.method === 'OPTIONS') return res.status(204).end()

  const cronOk = process.env.CRON_SECRET &&
    req.headers.authorization === `Bearer ${process.env.CRON_SECRET}`
  const adminOk = process.env.COMMENTS_ADMIN_TOKEN &&
    req.headers['x-admin-token'] === process.env.COMMENTS_ADMIN_TOKEN
  if (!cronOk && !adminOk) return res.status(404).json({ success: false })

  const [list] = await redis([['LRANGE', 'comments:inbox', 0, -1]])
  if (!list.length) return ok(res, { sent: false, count: 0 })

  const sendkey = process.env.SERVERCHAN_SENDKEY
  if (!sendkey) return ok(res, { sent: false, reason: 'no_sendkey', count: list.length })

  const items = list.map(s => JSON.parse(s))
  const fmt = ts => new Date(ts).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false })
  const desp = items.map(c =>
    `### 【${c.slug}】# ${c.name} · ${fmt(c.ts)}\n\n${c.content}\n\n---`
  ).join('\n')
  const title = `博客新评论 x${items.length}`

  const r = await fetch(`https://sctapi.ftqq.com/${sendkey}.send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ title, desp }),
  })
  const data = await r.json()
  const sent = data.code === 0
  if (sent) await redis([['DEL', 'comments:inbox']])
  return ok(res, { sent, count: items.length, serverchan: data.code })
}
