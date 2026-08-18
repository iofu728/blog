# pv-api

博客访问量统计接口的 Serverless 实现,用于替代原 Java(Spring Boot + MySQL)后端。
两个接口的请求/响应结构与旧接口完全一致,前端零改动:

- `GET /api/pv/list?timestamp=` — 累计/昨日访问量、爬虫数、各文章阅读量
- `GET /api/pv/update?timestamp=&titleName=` — 访问量 +1

## 存储(Upstash Redis,免费层)

| Key | 说明 |
|---|---|
| `pv:total` | 累计访问量(INCR) |
| `pv:day:YYYY-MM-DD` | 每日访问量(东八区,INCR),用于计算"昨日访问量" |
| `pv:titles` | Hash,文章 slug → 阅读量(HINCRBY) |
| `pv:spider:total` / `pv:spider:yesterday` | 爬虫数,由 Web 服务器每日统计 nginx 日志写入(见下节) |

## 部署步骤

1. 在 [Upstash](https://upstash.com) 创建一个 Redis 数据库,记下 `UPSTASH_REDIS_REST_URL` 和 `UPSTASH_REDIS_REST_TOKEN`。
2. 在本目录执行 `npx vercel`,按提示创建 Vercel 项目;然后在项目 Settings → Environment Variables 中配置上面两个环境变量,再 `npx vercel --prod`。
3. 绑定域名:把 `api.wyydsb.xin` 添加到 Vercel 项目的 Domains,并把 DNS 从自己的服务器改为 CNAME 到 `cname.vercel-dns.com`。
   (前端 `requests.js` 请求的就是 `https://api.<域名>`,绑定原域名后前端无需任何改动。)
4. 迁移历史数据(见下节)。
5. 验证:
   ```bash
   curl "https://api.wyydsb.xin/api/pv/list?timestamp=$(date +%s000)"
   curl "https://api.wyydsb.xin/api/pv/update?timestamp=$(date +%s000)&titleName=test"
   ```
6. 确认无误后,停掉服务器上的 Java 进程(8848 端口)和 MySQL(如无其他用途)。

## 爬虫计数(服务器侧)

Serverless 接口看不到 Web 服务器日志,爬虫数由服务器上的
`scripts/update-pv-spider.sh` 每日统计 nginx access.log 后直写 Upstash
(替代 tengine 时代的 `script/pv.sh` cron)。部署:脚本放
`/usr/local/bin/update-pv-spider`,凭证写 `/etc/pv-spider.env`(0600,
不进 git),同目录的 `pv-spider.service` / `pv-spider.timer` 放
`/etc/systemd/system/` 后 `systemctl enable --now pv-spider.timer`。
统计口径:东八区前一天、UA 爬虫特征(仅匹配 UA 字段)、排除回环地址。

## 历史数据

MySQL 历史数据已丢失,当前初始值取自仓库 `log/` 目录最后一条日志统计(2020-06-15):
`pv:total = 66540`、`pv:spider:total = 975259`;每篇文章阅读量无备份,从零重新累计。

如需调整初始值:

```bash
curl -X POST "$UPSTASH_REDIS_REST_URL/pipeline" \
  -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[["SET","pv:total","66540"]]'
```

如果以后找回了 MySQL 备份,仍可用 `scripts/export.sql` + `scripts/migrate.js` 迁移(见 git 历史)。
