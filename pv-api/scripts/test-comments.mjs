// 评论 API 冒烟测试:直连 Upstash,随机 test slug,测完自动清理
// 本地:  UPSTASH_REDIS_REST_URL=xxx UPSTASH_REDIS_REST_TOKEN=xxx node scripts/test-comments.mjs
// CI:    同名 GitHub Actions secrets 注入
import list from '../api/comments/list.js'
import submit from '../api/comments/submit.js'
import del from '../api/comments/delete.js'

const mockRes = () => {
  const r = { statusCode: 200, body: null, headers: {} }
  r.status = c => (r.statusCode = c, r)
  r.json = b => (r.body = b, r)
  r.setHeader = (k, v) => (r.headers[k] = v)
  r.end = () => r
  return r
}
// 随机 slug / IP,避免并发跑 CI 时限流键和列表互相干扰
const rand = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
const fakeIp = `10.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`
const mockReq = (query = {}, body = null, headers = {}) => ({
  method: body ? 'POST' : 'GET',
  query,
  body,
  headers: { origin: 'https://wyydsb.xin', 'x-forwarded-for': fakeIp, ...headers },
})

const slug = `test-comment-smoke-${rand}`
let fail = 0
const check = (name, cond) => { console.log(cond ? '✓' : '✗', name); if (!cond) fail++ }

// 1. 空列表
let r = mockRes()
await list(mockReq({ slug }), r)
check('empty list returns []', r.body.result.length === 0)

// 2. 提交两条
r = mockRes()
await submit(mockReq({}, { slug, name: '测试er', content: '第一条评论\n带换行' }), r)
check('submit added', r.body.result?.added === true)
const cid = r.body.result?.comment?.id
r = mockRes()
await submit(mockReq({}, { slug, content: '匿名第二条' }), r)
check('anonymous name defaults', r.body.result?.comment?.name === '匿名')

// 3. 蜜罐
r = mockRes()
await submit(mockReq({}, { slug, content: 'spam', website: 'http://spam' }), r)
check('honeypot fakes success', r.body.result?.added === true && !r.body.result?.comment)

// 4. 校验
r = mockRes()
await submit(mockReq({}, { slug: 'bad slug!', content: 'x' }), r)
check('bad slug rejected', r.body.result?.added === false)
r = mockRes()
await submit(mockReq({}, { slug, content: '' }), r)
check('empty content rejected', r.body.result?.added === false)

// 5. 列表顺序与内容
r = mockRes()
await list(mockReq({ slug }), r)
check('list has 2 (honeypot not stored)', r.body.result.length === 2)
check('order + content', r.body.result[0]?.content === '第一条评论\n带换行' && r.body.result[1]?.content === '匿名第二条')

// 6. 限流(已有 2 条成功,再发 4 条:第 6 条应被拒)
for (let i = 0; i < 4; i++) { r = mockRes(); await submit(mockReq({}, { slug, content: 'flood' + i }), r) }
check('rate limit kicks in', r.body.result?.added === false && r.body.result?.reason === 'rate_limited')

// 7. 删除:无 token 404,有 token 删 cid
r = mockRes()
await del(mockReq({}, { slug, id: cid }), r)
check('delete without token 404', r.statusCode === 404)
if (process.env.COMMENTS_ADMIN_TOKEN) {
  r = mockRes()
  await del(mockReq({}, { slug, id: cid }, { 'x-admin-token': process.env.COMMENTS_ADMIN_TOKEN }), r)
  check('delete with token works', r.body?.result?.deleted === true)
}

// 8. 清理测试数据
const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env
await fetch(`${UPSTASH_REDIS_REST_URL}/pipeline`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify([['DEL', `comments:${slug}`]]),
})
console.log(fail ? `\n${fail} FAILED` : '\nall passed (test data cleaned)')
process.exit(fail ? 1 : 0)
