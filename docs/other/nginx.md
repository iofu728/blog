---
pageClass: custom-page-class
---
# Nginx 调优

目前已经资瓷Https,Http2.0,TLS1.3,HSTS,控制一定时间内请求数等功能

```bash
worker_processes  3;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;
    limit_req_zone $binary_remote_addr zone=allips:10m rate=30r/m;
    proxy_cache_path /usr/local/nginx/proxy_cache levels=1:2 keys_zone=content:20m inactive=1d max_size=100m;

    sendfile        on;
    keepalive_timeout  70;

    server {
        listen       80;
        server_name  wyydsb.com www.wyydsb.com;
        rewrite ^(.*)$ https://${server_name}$1 permanent;
   }
    server {
        listen       80;
        server_name  wyydsb.cn www.wyydsb.cn;
        rewrite ^(.*)$ https://${server_name}$1 permanent;
   }
    server {
        listen       80;
        server_name  wyydsb.xin www.wyydsb.xin;
        rewrite ^(.*)$ https://${server_name}$1 permanent;
   }

    # HTTPS server
    #
    server {
         listen       443 ssl http2;
         listen [::]:443 ssl http2 ipv6only=on;
         server_name  localhost wyydsb.xin wyydsb.com www.wyydsb.xin wyydsb.cn www.wyydsb.com www.wyydsb.cn;

         limit_conn one 50;
         limit_rate 500k;
         limit_req zone=allips burst=5 nodelay;

         if ($http_user_agent ~* (Scrapy|Curl|HttpClient)) {
             return 403;
         }

         if ($http_user_agent ~ "WinHttp|WebZIP|FetchURL|node-superagent|java/|FeedDemon|Jullo|JikeSpider|Indy Library|Alexa Toolbar|AskTbFXTV|AhrefsBot|CrawlDaddy|Java|Feedly|Apache-HttpAsyncClient|UniversalFeedParser|ApacheBench|Microsoft URL Control|Swiftbot|ZmEu|oBot|jaunty|Python-urllib|lightDeckReports Bot|YYSpider|DigExt|HttpClient|MJ12bot|heritrix|EasouSpider|Ezooms|BOT/0.1|YandexBot|FlightDeckReports|Linguee Bot|^$" ) {
             return 403;
         }

         if ($request_method !~ ^(GET|HEAD|POST)$) {
             return 403;
         }

         add_header Strict-Transport-Security "max-age=31536000; includeSubDomains;preload" always;
         add_header X-Frame-Options DENY;
         add_header X-Content-Type-Options nosniff;
         add_header X-Xss-Protection 1;

         ssl_certificate   /etc/letsencrypt/live/wyydsb.xin/fullchain.pem;
         ssl_certificate_key  /etc/letsencrypt/live/wyydsb.xin/privkey.pem;
         ssl_session_timeout 5m;
         ssl_prefer_server_ciphers on;
         ssl_dhparam /etc/ssl/certs/dhparam.pem;
         ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
         ssl_ciphers TLS13-AES-256-GCM-SHA384:TLS13-CHACHA20-POLY1305-SHA256:TLS13-AES-128-GCM-SHA256:TLS13-AES-128-CCM-8-SHA256;
         ssl_buffer_size 1400;
         ssl_session_cache builtin:1000 shared:SSL:10m;
         ssl_ecdh_curve secp384r1;

         proxy_cache content;
         proxy_cache_valid  200 304 301 302 99s;
         proxy_cache_valid any 1s;
         proxy_redirect off;
         proxy_set_header Host $host;
         proxy_set_header X-Real-IP $remote_addr;
         proxy_set_header REMOTE-HOST $remote_addr;
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         proxy_set_header Connection "";
         proxy_http_version 2;
         proxy_next_upstream off;
         proxy_ignore_client_abort on;
         proxy_ignore_headers Set-Cookie Cache-Control;
         client_max_body_size 30m;
         client_body_buffer_size 256k;
         proxy_connect_timeout 75;
         proxy_send_timeout 300;
         proxy_read_timeout 300;
         proxy_buffer_size 1m;
         proxy_buffers 8 512k;
         proxy_busy_buffers_size 2m;
         proxy_temp_file_write_size 2m;
         proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
         proxy_max_temp_file_size 128m;

         location / {
             root   /usr/local/var/www/;
             index  index.html index.htm;
         }
     }

}
```
## Https

## HSTS及Google
## Http2
## TLS1.3
## 反爬虫
## 缓存
