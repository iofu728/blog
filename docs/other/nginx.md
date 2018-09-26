---
pageClass: custom-page-class
---
# Nginx 调优

环境:
> Ubuntu18.04.1 LTS - aliYun
> nginx/1.15.3
> openssl 1.1.1

目前已经资瓷Https,Http2.0,TLS1.3,HSTS,控制一定时间内请求数等功能

## HTTPS

HTTPS本质上是一个公钥和私钥的配对过程，其通过SSL/TLS协议实现，通常只对服务器端进行效验

HTTPS配置就是配置证书

配置HTTPS主要是从使用Service Work角度出发的，Service Work必须配置HTTPS才能work

Https的配置主要难点就是SSL证书的生成+多域名证书的生成

### OpenSSL
OpenSSL提供的是自签名证书， 自签名访问时会出现不安全字样
```vim
## 生成私钥
openssl genrsa -out server.key 2048
## 修改openssl.cnf文件
cp /etc/ssl/openssl.cnf ./

1. 取消[ req ] 模块下注释：req_extensions = v3_req
2. 确保[ req_distinguished_name ]下没有 0.xxx 的标签，有的话把0.xxx的0. 去掉
3. 在 [ v3_req ] 块下增加一行 subjectAltName = @SubjectAlternativeName
4. 在文件末尾增加所有域名信息：
[SubjectAlternativeName]
DNS.1 = *.wyydsb.xin
DNS.2 = *.wyydsb.cn
DNS.3 = *.wyydsb.com

## 配置证书文件
openssl req -new -key server.key -out server.csr -config ./openssl.cnf
## openssl req -new -newkey rsa:2048 -sha256 -nodes -out wyydsb.csr -keyout wyydsb.key -subj "/C=CN/ST=ZheJiang/L=HangZhou/O=wyydsb/OU=wyydsb/CN=wyydsb.xin"

    Country Name (2 letter code) [AU]:CN
    State or Province Name (full name) [Some-State]:ZheJiang
    Locality Name (eg, city) []:HangZhou
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:wyydsb
    Organizational Unit Name (eg, section) []:wyydsb
    Common Name (e.g. server FQDN or YOUR name) []:wyydsb.xin # your server site
    Email Address []:yue.li3@21vianet.com

    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:
    An optional company name []:wyydsb

## 生成自签名证书.crt
openssl req -new -x509 -days 3650 -keyout server.key -out server.crt -config openssl.cnf
## 拷贝.crt, .key地址于nginx.conf内
```


### Certbot
Certbot提供的是权威签名证书
```vim
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python-certbot-nginx

# 多域名证书生成
certbot certonly --standalone --email your@email.com -d yourdomain.com -d yourdomain2.com -d www.yourdomain.com -d xxx
# 记录命令执行后显示的key address

vim /usr/local/nginx/conf/nginx.conf

# 修改为
server{
    listen 443 ssl;

    ssl_certificate   /etc/letsencrypt/live/{yourdomain}.com/fullchain.pem;
    ssl_certificate_key  /etc/letsencrypt/live/{yourdomain}.com/privkey.pem;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
}

# reload nginx
```

另外参考[凹凸实验室的博客](https://aotu.io/notes/2016/08/16/nginx-https/index.html)对HTTPS还进行了优化

另外Mozilla专门做了一个[ssl配置生成器](https://mozilla.github.io/server-side-tls/ssl-config-generator/)

```vim
# 生成dhparam.pem文件
cd /etc/ssl/certs
openssl dhparam -out dhparam.pem 2048


vim /usr/local/nginx/conf/nginx.conf

# 修改为
server{
    listen       443 ssl http2;
    ...

    #优先采取服务器算法
    ssl_prefer_server_ciphers on;
    #使用DH文件
    ssl_dhparam /etc/ssl/certs/dhparam.pem;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    #定义算法
    ssl_ciphers "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS !RC4";
    #减少点击劫持
    add_header X-Frame-Options DENY;
    #禁止服务器自动解析资源类型
    add_header X-Content-Type-Options nosniff;
    #防XSS攻击
    add_header X-Xss-Protection 1;
}


```

## HSTS、『HSTS 预加载列表』

### HSTS
HSTS = HTTP Strict Transport Security,即强制使用HTTPS进行连接

试图解决HTTP请求被劫持的情况，虽然其真实效果有待商榷

* 当客户端通过HTTP发出请求时，rewrite至443
* 当客户端通过HTTPS发出请求时，服务器会发送一个带有`Strict-Transport-Security`的`Response Header`头，浏览器在获取该响应头后，在`max-age`的时间内，如果遇到`HTTP`连接，就会通过 307跳转強制使用 HTTPS 进行连接，并忽略其它的跳转设置

```vim
vim /usr/local/nginx/conf/nginx.conf

# 修改为
## 80端口拦截重定向
    server {
        listen       80;
        server_name  wyydsb.xin www.wyydsb.xin;
        rewrite ^(.*)$ https://${server_name}$1 permanent;
   }

## https header头增加Strict-Transport-Security
server{
    listen       443 ssl http2;
    ...

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains;preload" always;
 }

```
### 『HSTS 预加载列表』
由于 HSTS 需要用戶经过一次安全的 HTTPS 连接后才会在`max-age`的时间內生效，因此 HSTS 策略并不能完美防止 HTTP 会话劫持，在下面这些情況下还是存在被劫持的可能：

* 从未访问过的网站
* 近期重裝过操作系統
* 期重裝过浏览器
* 用新的浏览器
* 用了新的设备（如手机）
* 除了浏览器缓存
* 期沒有打开过网站且`max-age`过期

对这种情況，Google 维护了一份『HSTS 预加载列表』，列表里包含了使用了`HSTS`的站点主域名和子域名，[可以通过该链接申请加入](https://hstspreload.org)

## HTTP2

HTTP2是万维网目前最新的网络传输协议，相对于HTTP/1.1优化了传输效率

HTTP2的配置比较简单，主要是Nginx升至1.9.3以上，OpenSSL升至1.0.2以上

HTTP2虽然不强制使用HTTPS，但普遍都建立在TLS之上，所以还是需要HTTPS的配置的
```vim
vim /usr/local/nginx/conf/nginx.conf

# 修改为
server{
    listen       443 ssl http2;
}
```
## TLS1.3
TLS1.3在2018年8月的RFC 8446会议中正式定稿，其相较于TLS1.2有很大改动

* 将密钥协议和身份验证算法与密码套件分开
* 删除对弱和较少使用的命名椭圆曲线的支持
* 删除对MD5和SHA-224 加密哈希函数的支持
* 即使使用先前的配置，也需要数字签名
* 整合HKDF和半短暂的DH提案
* 用PSK和门票取代恢复
* 支持1-RTT握手和对0-RTT的初始支持
* 通过在（EC）DH密钥协议期间使用短暂密钥来强制完美的前向保密
* 删除对许多不安全或过时功能的支持，包括压缩，重新协商，非AEAD密码，非PFS密钥交换（其中包括静态RSA和静态DH密钥交换），自定义DHE组，EC点格式协商，更改密码规范协议，Hello消息UNIX时间，以及输入到AEAD密码的长度字段AD
* 禁止SSL或RC4协商以实现向后兼容性
* 集成使用会话哈希
* 弃用记录层版本号并冻结该数字以提高向后兼容性
* 将一些与安全相关的算法详细信息从附录移至规范，并将ClientKeyShare降级为附录
* 使用Poly1305消息验证代码添加ChaCha20流密码
* 添加Ed25519和Ed448数字签名算法
* 添加x25519和x448密钥交换协议

1. 安装Nginx时 ./configure --with-openssl-opt=enable-tls1_3
2. openSSL 升至1.1.1
3. ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
4. ssl_ciphers TLS13-AES-256-GCM-SHA384:TLS13-CHACHA20-POLY1305-SHA256:TLS13-AES-128-GCM-SHA256:TLS13-AES-128-CCM-8-SHA256;
5. 浏览器打开TLS1.3支持chrome://flags/

利用高版本curl,验证TLS1.3配置成功
```vim
$ curl -vvv https://wyydsb.xin
* Rebuilt URL to: https://wyydsb.xin/
*   Trying 47.75.137.198...
* TCP_NODELAY set
* Connected to wyydsb.xin (47.75.137.198) port 443 (#0)
* ALPN, offering http/2
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/certs/ca-certificates.crt
  CApath: none
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (OUT), TLS change cipher, Client hello (1):
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS handshake, [no content] (0):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, [no content] (0):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, [no content] (0):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, [no content] (0):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS handshake, [no content] (0):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
```

## 反爬虫

爬虫对网站浏览量的统计有较大的影响

为保护网站安全，对爬虫及访问次数进行了限制

```vim
http{
          proxy_cache_path /usr/local/nginx/proxy_cache levels=1:2 keys_zone=content:20m inactive=1d max_size=100m;
    server{
         if ($http_user_agent ~* (Scrapy|Curl|HttpClient)) {
             return 403;
         }

         if ($http_user_agent ~ "WinHttp|WebZIP|FetchURL|node-superagent|java/|FeedDemon|Jullo|JikeSpider|Indy Library|Alexa Toolbar|AskTbFXTV|AhrefsBot|CrawlDaddy|Java|Feedly|Apache-HttpAsyncClient|UniversalFeedParser|ApacheBench|Microsoft URL Control|Swiftbot|ZmEu|oBot|jaunty|Python-urllib|lightDeckReports Bot|YYSpider|DigExt|HttpClient|MJ12bot|heritrix|EasouSpider|Ezooms|BOT/0.1|YandexBot|FlightDeckReports|Linguee Bot|^$" ) {
             return 403;
         }

         if ($request_method !~ ^(GET|HEAD|POST)$) {
             return 403;
         }
    }
}
```

## 缓存

虽然已经有了Server Work，但Nginx最牛的静态资源优化方案-缓存还是要配一下的

```vim
server{
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
}
```
PS： 因为使用了Server Work，利用文件的Hash值做版本管理，缓存管理的html文件对这一系统造成了较大的麻烦，故取消配置

## Load Balance

... Because of qiong, There is only one Server machine.

## 具体配置
```vim
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

         #limit_conn one 50;
         #limit_rate 500k;
         #limit_req zone=allips burst=5 nodelay;

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

         ssl_certificate   /etc/ssl/wyydsb.crt;
         ssl_certificate_key  /etc/ssl/wyydsb.key;
         ssl_session_timeout 5m;
         ssl_prefer_server_ciphers on;
         ssl_dhparam /etc/ssl/certs/dhparam.pem;
         ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
         ssl_ciphers "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS !RC4";
         ssl_buffer_size 1400;
         ssl_session_cache builtin:1000 shared:SSL:10m;
         ssl_ecdh_curve secp384r1;

         location / {
             root   /usr/local/var/www/;
             index  index.html index.htm;
         }
     }

}
```

## 参考
. [让你的网站秒配 HTTPS 证书](https://segmentfault.com/a/1190000011224813)
. [Nginx 配置 HTTPS 服务器](https://aotu.io/notes/2016/08/16/nginx-https/index.html)
. [让Nginx快速支持TLS1.3协议](https://www.jianshu.com/p/aa3f7c4d3a10)
