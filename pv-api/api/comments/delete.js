import { redis, setCors, ok, isValidSlug } from '../_lib.js'

// POST /api/comments/delete  {slug, id}  需要 x-admin-token 头
// 管理用:按 id 删除某篇文章的一条评论。token 在 Vercel 环境变量 COMMENTS_ADMIN_TOKEN 里配
export default async function handler(req, res) {
  setCors(req, res)
  if (req.method === 'OPTIONS') return res.status(204).end()

  const token = process.env.COMMENTS_ADMIN_TOKEN
  if (!token || req.headers['x-admin-token'] !== token) {
    return res.status(404).json({ success: false })
  }

  const { slug, id } = req.body || {}
  if (!isValidSlug(slug) || typeof id !== 'string') return ok(res, { deleted: false })

  const [list] = await redis([['LRANGE', `comments:${slug}`, 0, -1]])
  const kept = list.filter(s => JSON.parse(s).id !== id)
  if (kept.length === list.length) return ok(res, { deleted: false })

  await redis([
    ['DEL', `comments:${slug}`],
    ...(kept.length ? [['RPUSH', `comments:${slug}`, ...kept]] : []),
  ])
  return ok(res, { deleted: true })
}
