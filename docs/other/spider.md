---
pageClass: custom-page-class
---

# 从日志中识别 Spider 脚本

前面讲了[如何利用脚本统计PV、UV](/other/pv.md)，[如何利用MapReduce对日志处理进行分布式操作](/other/mapreduce.md)

再继续探讨Hadoop全家桶之前，先把bash脚本做进一步优化

维护一个网站 真的很累

尤其是 一天都没几个访问量的时候

心塞塞 💔

每次登机子看日志 很麻烦

于是有了 写个脚本的冲动

但 后来 才发现 我看到的数据 大部分都是爬虫爬的

那个是气不打一处来 哎

PS: 其实 一一直在纠结用PV还是UV, 最后考虑到我们这个一次访问就会load所有页面的网站还是老老实实用UV吧

于是 对Nginx进行爬虫限制

## 特征分析

首先 Nginx中调优过对大部分脚本都能拦截 返回403

但
1. Nginx调优之前的爬虫都是能正确返回200，而且并没有拦截到所有爬虫
2. 域名支持http及https协议，对于http的请求全部重定向到https，返回301代码
  * 但对爬虫爬http的时候，返回的也是301 ..。此后不合理，需要更改
  * 所以很明显403不能作为标志，但403肯定就是爬虫了
3. 那么301可以吗，答案很明显也是不能，很多正常请求重定向都会产生301
4. 让我们来看一下状态码不是200日志都长啥样

```vim
# load end of log
awk '{if($9!=200)print $0}' /usr/local/nginx/logs/access.log|tail -n 2000 >> log/test.log

vim log/test.log

...
47.52.239.131 - - [03/Oct/2018:19:01:52 +0800] "POST /uuu.php HTTP/1.1" 301 185 "-" "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36"
47.52.239.131 - - [03/Oct/2018:19:01:52 +0800] "GET /web/phpMyAdmin/index.php HTTP/1.1" 301 185 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0"
...
104.192.74.15 - - [03/Oct/2018:20:47:20 +0800] "GET /robots.txt HTTP/1.1" 301 185 "http://www.wyydsb.xin/robots.txt" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
...
77.88.5.4 - - [04/Oct/2018:05:29:34 +0800] "GET /react/componentdidupdate.html HTTP/1.1" 301 185 "-" "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)"
39.107.14.208 - - [04/Oct/2018:07:05:35 +0800] "GET / HTTP/1.0" 301 185 "-" "-"
157.55.39.115 - - [04/Oct/2018:07:16:01 +0800] "GET / HTTP/1.1" 301 185 "-" "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"
66.249.69.36 - - [04/Oct/2018:10:25:39 +0800] "GET /assets/js/35.48ffe973.js HTTP/1.1" 404 169 "https://wyydsb.xin/javaScript/structure.html" "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Safari/537.36"
...
```

总结一下爬虫的日志可能有如下特征:
1. 带有php 额 不管php是不是天下第一语言，反正在目前这个版本的blog中，从来都没用过php
  * 八成是之前WordPress留下的爬虫，再加上之前WordPress爆出有漏洞，可能有人借此广爬，所以最近有很多php的爬虫
  * 顺带的POST请求也是不可能的
2. 带有robot, rot, spider的，robot.txt是一种对爬虫的规范性文件，另外在一些爬虫的Agent上会带有所属的爬虫名称，搜索引擎之类的，例如googlebot, bingbot, BaiduSpider etc.
3. 语言类，python, go, java, curl
4. 无Agent信息的，会带有"-" "-"特征

总的来说，我们可以用<>来判断200是否是爬虫
```bash
awk '{if($9==200&&$0!~/bot/&&$0!~/spider/&&$0!~/php/&&$0!~/taishan/&&$0!~/POST/&&$0!~/Verification/&&$0!~/"-" "-"/&&$0!~/Python/&&$0!~/go/&&$0!~/Go/&&$0!~/python/&&$0!~/curl/){print $1}}' $loglocal|sort | uniq -c | wc -l >> log/pv
```

## AWK的联合查询

上述办法确实可以判断正常状态是否是爬虫，但对于一个非正常状态判断是否是爬虫却不太适用

因为上述规则不能涵盖所有爬虫状况

举个例子，没办法判断一个301的返回是不是正常的还是爬虫

仔细想来，只能建一个user Table

一个200之前的301一定会产生一个200

所以拿200做一张userlist

再联合查询

awk的联合查询相当于先把一个文件的数据放到一个map中，然后遍历第二个文件，利用这个map进行判断

```bash
# create user map
awk '{if($9==200&&$0!~/bot/&&$0!~/spider/&&$0!~/php/&&$0!~/taishan/&&$0!~/POST/&&$0!~/Verification/&&$0!~/"-" "-"/&&$0!~/Python/&&$0!~/go/&&$0!~/Go/&&$0!~/python/&&$0!~/curl/){print $1}}' $loglocal|sort | uniq -c | sort -nr >> log/userpre
awk '{if($1>5)print $0}' log/userpre >> log/user

# union select
awk 'NR==FNR {a[$2]=$0} NR!=FNR {if(FNR>1&&!($1 in a)&&($9!=200||$0~/bot/||$0~/spider/||$0~/php/||$0~/taishan/||$0~/POST/||$0~/Verification/||$0~/"-" "-"/||$0~/Python/||$0~/go/||$0~/Go/||$0~/python/||$0~/curl/))print $1}' log/user $loglocal|sort | uniq -c | wc -l >> log/time
```

## 遗留

因为之前未做爬虫过滤导致user Table中混入了一些奇怪的爬虫

比如说

```vim
115.61.84.234 - - [24/Aug/2018:20:06:04 +0800] "GET http://www.bjd.com.cn/ HTTP/1.1" 200 5301 "http://www.bjd.com.cn/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)"
115.61.84.234 - - [24/Aug/2018:20:06:32 +0800] "GET http://www.jumei.com/ HTTP/1.1" 200 5301 "http://www.jumei.com/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)"
115.61.84.234 - - [24/Aug/2018:20:33:57 +0800] "GET http://mail.sina.com.cn/ HTTP/1.1" 200 5301 "http://mail.sina.com.cn/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)"
115.61.84.234 - - [24/Aug/2018:22:46:25 +0800] "GET http://www.dangdang.com/ HTTP/1.1" 200 5301 "http://www.dangdang.com/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)"
115.61.84.234 - - [24/Aug/2018:22:46:27 +0800] "GET http://www.eastmoney.com/ HTTP/1.1" 200 5301 "http://www.eastmoney.com/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)"
115.61.84.234 - - [24/Aug/2018:23:18:48 +0800] "GET http://dl.pconline.com.cn/ HTTP/1.1" 200 5301 "http://dl.pconline.com.cn/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)"
115.61.84.234 - - [24/Aug/2018:23:56:13 +0800] "GET http://ie.sogou.com/ HTTP/1.1" 200 5301 "http://ie.sogou.com/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)"
115.61.84.234 - - [24/Aug/2018:23:56:18 +0800] "GET http://www.duomi.com/ HTTP/1.1" 200 5301 "http://www.duomi.com/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)"
115.61.84.234 - - [24/Aug/2018:23:56:23 +0800] "GET http://club.sohu.com/ HTTP/1.1" 200 5301 "http://club.sohu.com/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)"
115.61.84.234 - - [25/Aug/2018:00:22:06 +0800] "GET http://eos.changyou.com/ HTTP/1.1" 200 5301 "http://eos.changyou.com/" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)"
```

仔细观察会发现它的转入地址和请求地址都是各大网站，且一直在变，没有规律

这种想了想 只能利用建立黑名单来规避 也许不久以后会有好思路
