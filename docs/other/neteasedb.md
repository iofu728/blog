---
pageClass: custom-page-class
---

# Netease Music Spider for DB

首先 ㊗️大家 <u>1024</u> 快乐

之前写了[<u>第一版 网易云爬虫</u>](/other/netease.md)

逻辑比较简单

总结一下，就是:
1. 抓取各分类下<u>歌单id</u>
2. 根据歌单id, 获得这个歌单id下的<u>歌曲详情</u>
3. 把拿到的数据存到落到本地文件，最后利用<u>shell脚本</u>进行数据统计
4. 为了提高效率采用<u>多线程</u>
  * 这版线程数开的有点多，建议在<u>docker</u>环境中启，否则你的电脑就不属于你了

[<u>先 放代码 传送门</u>](https://github.com/iofu728/spider)

整体架构图

![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2018/png/104214/1540344152388-7382ef87-a7e9-492c-a7ca-deca6e8bb148.png "")

## Trouble

第一版 爬虫 看起来没什么毛病

但 还是会有一些问题
1. <u>你可能会有疑问 这么大的一个公司 怎么没有反爬策略</u>
  * 怎么可以让我这么肆无忌惮的爬
  * 这可是线上服务 一个个请求都是压力
2. <u>落磁盘落在文件里</u>，虽然处理数据也很方便，但数据的关系不够明显
  * 这个看起来很简单 就是落数据库

### Netease Anti-Spider

第一个问题 其实 你在分析数据的时候就会发现一些端疑

为啥一个那么火的歌单只有一首歌？~~蛤~~

实际上这是网易云音乐的一个防爬机制

在短时间请求比较大的时候会触发

在我尝试过程中 基本上在请求 8k-1w次的时候会发现

按每次请求200ms计算，开18个线程 一秒请求100次

QPS就达到6k

如果我多开几个爬虫 那么就会网易云的监控就会很可怕

要知道PDD一般服务的QPS也就几十万

所以 为了防我们这种新手

网易云造了一些<u>200</u>的Response，基本数据也是一致的

只是数据量 会少一点

<u>比如说一个歌单只返回一首歌的信息</u>（划重点 这是我们接下来 验证IP是否可用的一个有效判据）

问题找到了，那么改如何解决:

一种办法 就是 <u>换物理IP</u>

用人话说 就是 你在大兴 爬爬 然后 跑到本部去爬

嗯 LZ 在最开始也干过这种事情

导致很多物理IP 现在可能也不能用 hhh

当然根本的解决策略就是建立<u>代理IP池</u>

## Proxy 代理池

* 首先 什么是代理？

> 代理就是 有一个服务器代替你做 你想做的事情

代理IP做的事情 就是 把你原本自己发出去的请求 借助代理服务器的✋发出去

保密做的好的 就叫高匿

一般用的ShadowSockets 就是一种Socket5代理

我们这里要用的则是Http，Https代理

尤其更需要Http的代理

### Xici

[xici代理](http://www.xicidaili.com) 是我爬的第一个Free Proxy 网站

当时爬了20页只找到 7个能用的

然后随机选取一个作为代理

想的挺好的 这次应该不会被封了吧

结果 快到3w歌单的时候 pia 机 没了

所以 痛定思痛 觉得建立一个Proxy 代理池 而且要是高可用的

以上就是V1.5版

虽然没有多少代理IP 但借助着精湛的 转移技术
还是爬取了总计10.2w歌单12780274首，去重后1099542

怕大家数不清楚 以上 = <u>1.2kw/ 110w</u>

但拿到数据只是第一步 基于这些数据可以做很多事情

我们看 得到的数据大概`4M*73 = 296M`

如果数据量达到GB级别 shell就不太适用 就可以用[<u>MapReduce进行处理，此处参考写的另外一篇blog</u>](/other/mapreduce.md)

### Goubanjia

在爬代理网站 建立代理池的过程中，发现一些很好玩的事情

比如说这个代理网站 [Goubanjia](http://www.goubanjia.com)

做最基本的html解析，可以得到下面的内容

```python
In [9]: html = a.get_html('http://www.goubanjia.com', {}, 'www.goubanjia.com')

In [10]: trs = html.find_all('tr', class_=['warning', 'success'])

In [11]: tds = trs[0].find_all('td')

In [12]: tds[0].find_all(['div', 'span', 'p'])
Out[12]:
[<p style="display: none;">4</p>,
 <span>4</span>,
 <div style="display:inline-block;">7.</div>,
 <span style="display: inline-block;"></span>,
 <div style="display:inline-block;">9</div>,
 <p style="display: none;">3</p>,
 <span>3</span>,
 <div style="display: inline-block;"></div>,
 <p style="display: none;">.2</p>,
 <span>.2</span>,
 <span style="display:inline-block;">5</span>,
 <p style="display: none;">1.</p>,
 <span>1.</span>,
 <span style="display:inline-block;">9</span>,
 <p style="display:none;"></p>,
 <span></span>,
 <div style="display: inline-block;">4</div>,
 <span class="port GEA">8174</span>]
```

好像没什么异常 就是把Ip分开来了 拼接一下不就行了

<u>`447.933.251.1.94:8174`</u>

好像 这不太像一个IP地址

实际上懂一点 Html知识的可能会发现<u>`style="display:none;"`</u>

这个一个隐藏的style实际上是不显示的意思

发现这点之后 好像就很简单了

```python
tds[0].find_all(['div', 'span', not 'p'], class_=not 'port')
```

但 这只是这个网站两年前做的版本 好戏还在后头

我把得到的ip进行测试 然后一惊

~~woc~~ 费那么大劲 一个都不能用 一个都不能用 干嘛还这么用力来防

总觉得有、不太对

然后突然发现 拿到的<u>Port</u> 和网站上<u>看到的</u> 好像不太一样

![图片.png | center | 867x796](https://cdn.nlark.com/yuque/0/2018/png/104214/1540318513535-fb157d83-6e10-4b5b-abc8-1c32f1237d31.png "")

这个时候想到 上课讲的wolf字体欺骗

检查字体发现再正常不过了

再回头来看这个代码<u>`<span class="port GEA">8174</span>`</u>

一开始怀疑对象 也是CSS 这个class会不会有什么特殊的地方

想了半天 也排查了所以css js

发现如果把<u>`http://www.goubanjia.com/theme/goubanjia/javascript/pde.js?v=1.0`</u>禁掉 就会显示Html的内容

有同学说看js代码 实际上 看不出来什么东西

再看引了JQuery的包 猜想应该是JQuery动态修改Html

但知道 这个并没有用 并不能帮助我们解密

~~这就是一个encode decode的过程~~

![图片.png | center | 827x697](https://cdn.nlark.com/yuque/0/2018/png/104214/1540353720988-2aec2e51-0bee-4fc3-b820-ca53646fa000.png "")

好像 port后面的字母和端口号有一一映射关系

那么 我们 进入到最原始的方式：通过枚举 找规律

![图片.png | center | 400x294](https://cdn.nlark.com/yuque/0/2018/png/104214/1540318958704-79614cb3-40fe-43ca-a7e9-b2b557352ae0.png "")

然后我们就会 变得很机智 发现这个密码就是把<u>字母转化成数字 然后/8</u>

~~嗯 这应该是 第一个解密goubanjie骚操作的blog~~

然后 我们发现这个网站更新很频繁 但一次只能拿到20条

于是 写个<u>定时任务</u> 就是一个很合理的需求

### gatherproxy

其实国内代理 都太势利了 能用的本来就不多 还收费

国外的代理 就很慷慨

比如说[gatherproxy](http://www.gatherproxy.com) 这也是我们的主力代理Ip

和别的不一样 这个网站吧所有ip都开放给你下载 不提倡写爬虫

那么问题就变为 <u>如何在较短时间内把1w+ 对应的http/https 代理是否可用检验出来 然后写到DB中</u>

想要快 只能 开多线程

但写库不能在多线程中

我们知道Innodb因为资瓷<u>事务</u> 有严格的<u>写锁机制</u>

短时间 竞争写操作 会造成 写失败操作

于是第一套方案 就是等所有 判断结束之后 再写

测试发现 写效率 挺高的 1s内完成1k条Insert语句

但实际上频繁的写操作不太友好

所以改成聚类 通过一次sql操作 完成1k条数据的插入

这样就解决了慢SQL的问题

### TestDb()

当然 代理具有极强的时效性

如何在短时间内判断数据库中大量的代理数据是否可用（目前为止已经有2.2w代理ip数据） 也是一个问题

解决方案 同样是 多线程

但同时为了保证代理Ip的质量 采用3次验证机制

通过is_failured字段 进行判断 每失效一次+1 直到is_failured到5则不在检测

如果可用一次is_failured置为0

### 不可靠

实际上就算之前的三层检验 拿到的可用的代理

在实际运用当中 还是会出现请求失败的现象

所以 对于真实爬取场景 为保证每一个数据的都能被爬取到

对每个任务增加Retry机制 并记录爬取进度 To DB

然后 其实Proxy特别依赖<u>network</u>

比如说 有一次连上了 隔壁寝室的WiFi~~别问我怎么连上的 密码真的简单~~

然后经过testdb之后可用的 Ip数就掉零

然后 实验证明 Https的代理 比较不稳定 十分需要retry机制

对于本次爬虫而言 实际上Https的接口没有加 反爬机制 不用代理也行

## DB

DB 采用MySQL

一个是 因为<u>熟悉</u>

另外一个可用<u>方便</u>显示数据的关系

但实际上大数据下MySQL的性能优化 有很多功课可以做

### 慢SQL

前面说的 读写<u>IP池</u> 是一种慢SQL

实际上 写 <u>playlist_queue</u>表也是

我们一次拿到1k+个歌单Id 需要在短时间 进行判断写入/更新进DB

我们可以<u>用Replace Into 代替Update进行更新</u>

所有操作做聚类 一条SQL 代替数k条SQL

但在<u>playlist_detail</u>这张表中

首先 单条数据Size大

其次 需要一次插入七八万条数据 这已经是聚类过的 单<u>classify</u>进行统计处理

这 Insert 也不管用

测试中 6w数据
> 分成5k一组 一条也写不进去
> 3k一组 能写三条
> 1k一组 能写10条
> 500一组 中间休息0.2s 能写20组

仔细看一下 发现<u>block大小</u> 和 <u>能写入的量</u> 直接 并没有直接关系

该写不进去的 照样写不进去

最后 采用先写到本地文件中

再通过Load data 导入MySQL

~~那 我们 为啥 还要写库 二进制文件不是挺好的吗 shell脚本多少好用~~

![图片.png | center | 827x697](https://cdn.nlark.com/yuque/0/2018/png/104214/1540318306468-ed0c13b3-20a6-4e11-820c-1d5c7fea9ea1.png "")

## Finish

于是第二版 主要解决了以上技术难题

剩下还有一些零零散散的小问题 主要是<u>多线程 一些写、更新比较繁琐的地方</u>

总的来说 实现

1. <u>高可用</u>代理IP库建立
2. 资瓷<u>记录爬虫进度</u>的自动化网易云音乐歌单数据爬虫
3. 完成6百w(5801119)数据爬取，写库操作

![图片.png | center | 827x697](https://cdn.nlark.com/yuque/0/2018/png/104214/1540318183400-2a079af3-c503-42f7-a1d8-e61d57f9fe21.png "")

![图片.png | center | 827x614](https://cdn.nlark.com/yuque/0/2018/png/104214/1540352785193-4c570ebd-8f27-42dd-a622-bc152bd79860.png "")

## Next

1. 通过<u>Kafka</u>消费消息队列 来解决 写库量大的问题
2. 数据分析 [<u>挖频繁模式</u>](/other/frequent.md)
3. 只爬了playlist的数据 其实网易云还有很多可以做的 比如说<u>用户画像 评论</u>之类很有意思的方向

## Result

附上出现频次排名前55的歌曲

~~至于为什么是前55 e~~

-- 数据采样于2018.10.23 --

前1k名单见[<u>GitHub</u>](https://github.com/iofu728/spider)

```vim
time song_name
----|-----
6784 Something Just Like This
5814 Shape of You
5720 Time
5585 Alone
5151 Intro
4916 Hello
4833 You
4787 Closer
4312 Nevada
4217 Stay
4142 Faded
4089 说散就散
4070 Animals
3894 往后余生
3650 Home
3645 Without You
3535 Counting Stars
3515 That Girl
3410 HandClap
3300 Higher
3265 Despacito (Remix)
3229 Unity
3198 Havana
3181 起风了（Cover 高橋優）
3148 Forever
3141 Victory
3108 Please Don't Go
3101 Sugar
3080 Beautiful Now
3077 See You Again
3022 Fade
2969 Summer
2940 Seve
2938 The truth that you leave
2861 Life
2853 可能否
2825 We Don't Talk Anymore
2799 Superstar
2795 #Lov3 #Ngẫu Hứng
2793 Try
2759 アイロニ
2730 Hope
2714 Hero
2705 追光者
2679 遇见
2678 いつも何度でも
2654 Let Me Love You
2646 There For You
2643 Trip
2634 BOOM
2626 Fire
2606 Wolves
2600 Friendships (Original Mix)
2597 Freaks (Radio Edit)
2577 全部都是你
```
