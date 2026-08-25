// 共享工具:Upstash Redis REST 访问、CORS、响应格式、时间窗口校验
// 以 `_` 开头的文件不会被 Vercel 当作 serverless function 路由

const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env

// 批量执行 Redis 命令(pipeline),commands 形如 [['GET', 'k'], ['INCR', 'k2']]
export async function redis(commands) {
  const res = await fetch(`${UPSTASH_REDIS_REST_URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  })
  const list = await res.json()
  return list.map(item => {
    if (item.error) throw new Error(item.error)
    return item.result
  })
}

// 按东八区生成日期串 YYYY-MM-DD,offsetDays=1 表示昨天
export function dayKey(offsetDays = 0) {
  const d = new Date(Date.now() - offsetDays * 86400000)
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Shanghai' })
}

// 前端 fetch 带 credentials: 'include',必须回显 Origin 而不能用 *
export function setCors(req, res) {
  const origin = req.headers.origin
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-admin-token')
  }
}

// 文章 slug 即 matchSlug(path) 的结果,如 LLMLingua_en、1040
export function isValidSlug(slug) {
  return typeof slug === 'string' && /^[A-Za-z0-9_.-]{1,100}$/.test(slug)
}

// 与旧 Java BaseResponse 结构保持一致
export function ok(res, result) {
  res.status(200).json({
    success: true,
    errorCode: 100000,
    result,
    timestamp: new Date().toISOString(),
  })
}

// 对应旧接口 PermissionFilterService.haveTimePermission:时间戳偏离当前 5 分钟以上视为非法
export function hasTimePermission(timestamp) {
  const ts = Number(timestamp)
  return Number.isFinite(ts) && Math.abs(Date.now() - ts) < 5 * 60 * 1000
}
