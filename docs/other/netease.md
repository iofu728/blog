---
title: Netease Music Spider
date: 2018-10-14 16:14:43
tags: [Spider]
description: 网易云音乐 爬虫
---

爬虫是很久之前 就想研究的一个问题

但因为懒 嗯 懒

最近经常有一些写爬虫的新手 找我的网站练手

看着日志 表示很难受 所以决定自己来研究一下如何来写爬虫~~(我不会说这是作业的)~~

本文对近2w个热门歌单的3024511首歌曲数据进行爬取及分析

# 为什么选择爬网易云音乐

因为 真的很简单

特别适合新手

完全没不设防

接口全对开放

当然在进一步研究之后 发现对隐私控制还是做了写工作的

# 爬什么

首先 我们明确下目标

到底想爬些什么数据

* 爬大家听得最多的歌单中的歌曲列表？
  - 这也许能给听歌做参考
* 爬那种类型的歌单听的人最多？
  - 找大众兴趣点
* maybe 还有其他脑洞 什么的

总之在做事情前，告诉自己 我们做的事情是有意义的

# 怎么获取数据

想一想 我们听歌的时候是怎么样的一个流程

1. 朋友分享给你一首歌
2. 你知道歌曲名字，想搜索歌曲
3. 你在某个歌单上面听到某首歌

每一个场景对应着一系列的API

对于写爬虫而言，理清业务场景至关重要

我们先来分析歌单-歌曲 场景

分享一个歌单 相当于分享一个歌单id - playListId

网易云在这里做的比较好 不是直接提供一个API接口

而是把信息封装到html [http://music.163.com/discover/playlist/?order=hot&cat=华语&limit=35&offset=1](http://music.163.com/discover/playlist/?order=hot&cat=华语&limit=35&offset=1)中 增加写爬虫的门槛

找到`div`中的`data-res-id`参数 就是所要求的playListId

找到playListId之后，调用 [http://music.163.com/api/playlist/detail?id=1](http://music.163.com/api/playlist/detail?id=1) 就可以获得所需要的歌曲信息

因为返回的是JSON 实际上要做的也就是JSON解析的工作

PS: 注意网易云有两个html
* 第一个是放在cdn里真正的静态html 存放layout
* 另外一个是通过微服务 动态生成的 html
- 这个是因为为了封装一层 不直接把api暴露给用户做的

举个例子
你去爬[https://music.163.com/#/discover/playlist](https://music.163.com/#/discover/playlist)和你真正看到的不一样
是因为[https://music.163.com/#/discover/playlist](https://music.163.com/#/discover/playlist)指向的是最外层通用Layout的HTML不包含你所需要的数据
实际上数据在[https://music.163.com/discover/playlist](https://music.163.com/discover/playlist)这个html内

再举个例子
你去爬[https://music.163.com/#/playlist?id=2392202198](https://music.163.com/#/playlist?id=2392202198) 也一样拿不到想要的歌曲数据
去爬[https://music.163.com/playlist?id=2392202198](https://music.163.com/playlist?id=2392202198)就可以拿到数据
其实 这个HTML是对[http://music.163.com/api/playlist/detail?id=2392202198](http://music.163.com/api/playlist/detail?id=2392202198)  这个API的封装

`写爬虫最重要的是梳理业务逻辑`

# 多线程

python真的很慢

导致最开始测试的时候2s才发一个请求，lz一想那爬完2w个怕是猴年马月喽

无奈写个多线程

```python
    for id in self.urlslist:
        work = threading.Thread(target=self.get_detail, args=(id,))
        threadings.append(work)
    for work in threadings:
        work.start()
    for work in threadings:
        work.join()
```

# Code
```python
# -*- coding: utf-8 -*-
# @Author: gunjianpan
# @Date:   2018-10-12 20:00:17
# @Last Modified by:   gunjianpan
# @Last Modified time: 2018-10-14 21:53:46
# coding:utf-8

import requests
from bs4 import BeautifulSoup
import sqlite3
import threading
import json
import urllib.parse
import time


class Get_list():
    def __init__(self):
        self.urlslist = ["全部", "华语", "欧美", "日语", "韩语", "粤语", "小语种", "流行", "摇滚", "民谣", "电子", "舞曲", "说唱", "轻音乐", "爵士", "乡村", "R&B/Soul", "古典", "民族", "英伦", "金属", "朋克", "蓝调", "雷鬼", "世界音乐", "拉丁", "另类/独立", "New Age", "古风", "后摇", "Bossa Nova", "清晨", "夜晚", "学习",
                         "工作", "午休", "下午茶", "地铁", "驾车", "运动", "旅行", "散步", "酒吧", "怀旧", "清新", "浪漫", "性感", "伤感", "治愈", "放松", "孤独", "感动", "兴奋", "快乐", "安静", "思念", "影视原声", "ACG", "儿童", "校园", "游戏", "70后", "80后", "90后", "网络歌曲", "KTV", "经典", "翻唱", "吉他", "钢琴", "器乐", "榜单", "00后"]
        self.headers = {
            'Host': "music.163.com",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Connection": "keep-alive",
            'Referer': "http://music.163.com/",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.0 Safari/537.36"}
        self.time = 0

    def run_list(self):
        start = time.time()
        threadings = []
        for id in self.urlslist:
            work = threading.Thread(target=self.get_lists, args=(id,))
            threadings.append(work)
        for work in threadings:
            work.start()
        for work in threadings:
            work.join()
        end = time.time()
        print(end - start)

    def get_lists(self, id):
        if "/" in id or "&" in id:
            f = open(id.split("/" or "&")[0] + '.txt', 'a')
        else:
            f = open(id + '.txt', 'a')

        count = 0
        while True:
            url = "http://music.163.com/discover/playlist/?order=hot&cat=" + \
                urllib.parse.quote_plus(id) + "&limit=35&offset=" + str(count)
            html = requests.get(url, headers=self.headers, verify=False).text
            try:
                table = BeautifulSoup(html, 'html.parser').find(
                    'ul', id='m-pl-container').find_all('li')
            except:
                break
            ids = []
            for item in table:
                ids.append(item.find('div', attrs={'class': 'bottom'}).find(
                    'a').get('data-res-id'))
            count += 35
            f.write(str(ids) + '\n')

    def get_id(self, list_id, file_d):
        url = 'http://music.163.com/api/playlist/detail?id=' + str(list_id)
        data = requests.get(url, headers=self.headers, verify=False).json()
        if data['code'] != 200:
            return []
        result = data['result']
        musiclist = ""
        tracks = result['tracks']
        for track in tracks:
            musiclist += (track['name'] + '\n')
        file_d.write(musiclist)
        self.time = self.time + 1

    def get_detail(self, id):
        threadings = []
        if "/" in id or "&" in id:
            f = open(id.split("/" or "&")[0] + ".txt", 'r')
        else:
            f = open(id + ".txt", 'r')
        if "/" in id or "&" in id:
            file_d = open(id.split("/" or "&")[0] + "data.txt", 'a')
        else:
            file_d = open(id + "data.txt", 'a')
        for line in f.readlines():
            for id in eval(line.replace('\n', '')):
                work = threading.Thread(
                    target=self.get_id, args=(id, file_d))
                threadings.append(work)
        for work in threadings:
            work.start()
        for work in threadings:
            work.join()
        print(self.time)

    def run_detail(self):
        self.time = 0
        start = time.time()
        threadings = []
        for id in self.urlslist:
            work = threading.Thread(target=self.get_detail, args=(id,))
            threadings.append(work)
        for work in threadings:
            work.start()
        for work in threadings:
            work.join()
        end = time.time()
        print(end - start)
        print(self.time)
```

# 执行操作
推荐在Docker中运行，千万别在物理机尝试
```bash
$ docker pull ipython/notebook
$ docker run -it -d --name gunjianpan-ipython10.13-1 -p 40968:80 ipython/notebook
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                             NAMES
72fea94b0149        ipython/notebook    "/notebook.sh"      3 seconds ago       Up 2 seconds        8888/tcp, 0.0.0.0:40968->80/tcp   gunjianpan-ipython10.14
$ docker exec -it 72f /bin/bash
```

```python
> import netease_music
> a=netease_music.Get_list()

# obtain palyListId list
> a.run_list()

# obtain play music detail list
> a.run_detail()

# data handle
$ awk '{print $0}' *data.txt |sort|uniq -c|sort -nr >> total.txt
```
# FAQ

1. 第二个接口json的tracks只获得第一条数据

header头的问题，应该是做了防爬虫处理，但是不知道为啥识别出爬虫还专门做了一种返回

2. 运行过程中被kill掉了

第一次出现kill时因为data.txt太大了，以至于不能f.open()

所以只能分文件

3. 运行中出现Thread-error

```vim
Traceback (most recent call last):
  File "/usr/lib/python3.4/threading.py", line 920, in _bootstrap_inner
    self.run()
  File "/usr/lib/python3.4/threading.py", line 868, in run
    self._target(*self._args, **self._kwargs)
  File "/notebooks/music.py", line 69, in get_id
    data = requests.get(url, headers=self.headers, verify=False).json()
  File "/usr/local/lib/python3.4/dist-packages/requests/models.py", line 800, in json
    self.content.decode(encoding), **kwargs
  File "/usr/lib/python3.4/json/__init__.py", line 318, in loads
    return _default_decoder.decode(s)
  File "/usr/lib/python3.4/json/decoder.py", line 343, in decode
    obj, end = self.raw_decode(s, idx=_w(s, 0).end())
  File "/usr/lib/python3.4/json/decoder.py", line 361, in raw_decode
    raise ValueError(errmsg("Expecting value", s, err.value)) from None
ValueError: Expecting value: line 1 column 1 (char 0)
```

看起来像这个playListId对应的detail 为空，可能是这个歌单被删了什么的

4. 物理机下运行卡顿

**千万别在物理机下运行**

lz在docker中运行的时候线程数达到18，风扇呜呜呜
在物理机上起的时候呢，线程数直接破万，卡的根本没办法工作，即使运行完了，线程数也没完全释放，导致还是很卡

所以 像这种多线程操作还是在服务器上进行吧

netease_music 真的是最基础的爬虫 未来路还长呢

## 分析数据

总共收集到3024511首歌

去重之后556432首

可以看出被收入歌曲次数较高的 还是挺多是我们耳熟能详的歌曲

好 最后附上前50+的歌曲详单

```vim
1224 Time
1186 Something Just Like This
1152 Alone
1129 Intro
1072 Shape of You
1062 You
1061 Hello
1026 Closer
 965 Stay
 913 Home
 802 Faded
 777 Counting Stars
 765 Animals
 757 Without You
 757 Nevada
 752 说散就散
 702 Forever
 690 Higher
 685 Summer
 683 往后余生
 673 Victory
 667 Rain
 662 Sugar
 647 Fade
 645 Life
 636 いつも何度でも
 625 Fire
 621 Unity
 611 Hope
 607 起风了（Cover 高橋優）
 606 Try
 604 アイロニ
 601 Havana
 596 HandClap
 594 海阔天空
 593 The truth that you leave
 583 See You Again
 578 Please Don't Go
 577 Dreams
 574 Hero
 566 Despacito (Remix)
 565 Seve
 563 Lullaby
 560 That Girl
 553 Beautiful Now
 553 Angel
 552 Viva La Vida
 552 Let It Go
 550 追光者
 550 Let Me Love You
 550 Alive
 549 遇见
 548 Breathe
 544 Luv Letter
 534 I Love You
 532 We Don't Talk Anymore
 532 A Little Story
 528 Superstar
 528 Journey
 523 Maps
 521 Trip
 520 Memories
 518 Goodbye
 516 Horizon
 516 Flower Dance
 514 Summertime
 512 牵丝戏
 508 #Lov3 #Ngẫu Hứng
 506 喜欢你
 503 可能否
 503 Uptown Funk
```

