import { redis, setCors, ok, isValidSlug } from '../_lib.js'

const MAX_CONTENT = 1000
const MAX_NAME = 30
const MAX_COMMENTS_PER_POST = 500
const RATE_LIMIT = 5 // 每 IP 每分钟最多 5 条

// POST /api/comments/submit  {slug, name?, content, website?(honeypot)}
// result: { added: true, comment } | { added: false, reason }
export default async function handler(req, res) {
  setCors(req, res)
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return ok(res, { added: false, reason: 'method' })

  const { slug, name, content, website } = req.body || {}

  // 蜜罐:正常用户看不到 website 字段,填了的当是机器人,假装成功不落库
  if (website) return ok(res, { added: true })

  if (!isValidSlug(slug)) return ok(res, { added: false, reason: 'slug' })
  const text = typeof content === 'string' ? content.trim() : ''
  if (!text || text.length > MAX_CONTENT) return ok(res, { added: false, reason: 'content' })

  // IP 限流:INCR + 首次设过期
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'
  const [count] = await redis([
    ['INCR', `rl:comment:${ip}`],
    ['EXPIRE', `rl:comment:${ip}`, 60, 'NX'],
  ])
  if (count > RATE_LIMIT) return ok(res, { added: false, reason: 'rate_limited' })

  const comment = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: (typeof name === 'string' && name.trim() ? name.trim() : '匿名').slice(0, MAX_NAME),
    content: text,
    ts: Date.now(),
  }
  await redis([
    ['RPUSH', `comments:${slug}`, JSON.stringify(comment)],
    ['LTRIM', `comments:${slug}`, -MAX_COMMENTS_PER_POST, -1],
  ])
  return ok(res, { added: true, comment })
}
