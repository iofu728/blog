#!/bin/bash
# 每日爬虫请求统计 —— pv-api 爬虫计数的数据源。
#
# 背景:pv-api 是浏览器触发的 Vercel serverless,看不到服务器日志,因此
# pv:spider:* 需要由 Web 服务器侧喂数(本脚本替代 tengine 时代的
# script/pv.sh 日志解析 cron)。
#
# 服务器部署方式(规范位置,此文件为仓库副本):
#   脚本:      /usr/local/bin/update-pv-spider
#   凭证:      /etc/pv-spider.env (0600, 内容为两个 Upstash 环境变量, 不进 git)
#   systemd:   pv-spider.service + pv-spider.timer (同目录下, 每天 00:47 跑)
#   手动执行:  systemctl start pv-spider.service
#
# 统计口径(沿用旧 pv.sh 语义):
#   - 前一天, 东八区(与 api/_lib.js 的 dayKey 一致)
#   - UA 含爬虫特征词, 只匹配行尾 UA 字段, /other/chatbot.html 这类 URL 不误判
#   - 排除回环地址(本地压测/健康检查不是爬虫)
#   - 跨全部 vhost 统计; 旧日志(无 $host 字段)本来也无法按站拆分
set -euo pipefail
source /etc/pv-spider.env

YDAY=$(TZ=Asia/Shanghai date -d 'yesterday' +%d/%b/%Y)   # e.g. 18/Aug/2026

LOGS=(/var/log/nginx/access.log)
[ -f /var/log/nginx/access.log.1 ] && LOGS+=(/var/log/nginx/access.log.1)

N=$(grep -hF "[$YDAY" "${LOGS[@]}" \
    | awk '$1 !~ /^(127\.|::1)/' \
    | grep -icE '"[^"]*(bot|spider|crawl|slurp|curl|wget|python|go-http|scrapy|headless)[^"]*"( [^ ]+)?$' \
    || true)

payload=$(printf '[["INCRBY","pv:spider:total",%d],["SET","pv:spider:yesterday","%d"]]' "$N" "$N")
resp=$(curl -fsS -X POST "$UPSTASH_REDIS_REST_URL/pipeline" \
    -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
    -H 'Content-Type: application/json' \
    -d "$payload")

echo "pv-spider: $YDAY crawlers=$N -> $resp"
