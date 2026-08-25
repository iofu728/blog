import { redis, setCors, ok, isValidSlug } from '../_lib.js'

// GET /api/comments/list?slug=xxx
// 返回某篇文章的全部评论(按时间正序)
export default async function handler(req, res) {
  setCors(req, res)
  if (req.method === 'OPTIONS') return res.status(204).end()

  const { slug } = req.query
  if (!isValidSlug(slug)) return ok(res, [])

  const [list] = await redis([['LRANGE', `comments:${slug}`, 0, -1]])
  return ok(res, list.map(s => JSON.parse(s)))
}
