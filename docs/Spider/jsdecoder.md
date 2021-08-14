---
title: 究竟是道德的沦丧，还是现实的骨感，让携程反爬工程师在代码里写下这句话-『爬虫进阶第二弹』
date: 2019-04-21 18:13:11
tags: [Spider]
description: 爬虫进阶技巧
---

本文仅用作**学习交流**，**不得用于任何商业用途**；

---

> 4 月的北京，这天气像是 80 岁的老奶奶 👵，捂得慌。
> 实验室/自习室的角落，清脆的打字声，夹杂着几声叹气，一个套着格子衬衫，头发不多的大叔直视着屏幕。
> 眼神坚定的他，快速的敲下了一行命令。‘这次一定要成了’。
> 而屏幕的那头，终于有了些反应，一个个字符鲜活的蹦了出来，像极了`[黑镜：潘达斯奈基]`中男主被操控的感觉。
> 可他原本充满期待的脸突然开始扭曲，放佛在屏幕上看到了什么恐怖的东西
> 只见屏幕上欣然出现这么一句话
> <center><img width="700" src="https://cdn.nlark.com/yuque/0/2019/png/104214/1555907913480-5d5ca694-f788-424c-9230-2889043cfeac.png"></center>

上次发完[你已经是一个成熟的爬虫了，应该学会自己去对抗反爬码农了 🙊-『爬虫进阶指南』](https://zhuanlan.zhihu.com/p/61575267)就不断有小伙伴向我我请教如何解决一些 js 逆向工程的问题

其实这个问题说小了涉及 js、py 基础语法，说大了涉及网络攻防，涉及对方公司架构，甚至涉密。

而且做这种逆向工程还特别费时间，(其实反爬工程师做加密方案也特别累， 所以一般做这种`混淆加密`的都是该公司的核心业务)，所以这方便的资料其实特别少。

还是再想提醒下大家，爬虫是一个获取信息的好工具，但还请相互体谅，本文也仅用作学习使用。

本文分析两个案例，一个是去年被爬怕了的`马蜂窝`，一个是`携程`, 像这种公司体量很大，业务繁多，也不可能全部分析，具体来说:

- [马蜂窝的景点信息, （可能是被爬怕了吧 🤐）](http://www.mafengwo.cn/jd/10186/gonglve.html)
- [携程的酒店详情页, 涉及动态酒店房源库存，房型，价格](https://hotels.ctrip.com/hotel/4889292.html)

**乱入总结:**

- **携程 996**
- 马蜂窝看不出来 是不是 996

打个小广告, 求 star[自带高可用 Proxy 库的 spider 代码](https://github.com/iofu728/spider) hhh

## 马蜂窝

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1555894492064-b531da3e-c648-42b3-8bb9-56f3fc3eb069.png)

我们要爬的是所有景点信息，这个信息是请求`http://www.mafengwo.cn/ajax/router.php`获取的

其中需要一坨参数，除了一眼能看出语义的参数之外，也就`_sn`, `sAct`(可惜它不变)可能是被加密过的。

<center><img width="700" src="https://cdn.nlark.com/yuque/0/2019/png/104214/1555894491808-06716ae6-d12b-47d4-a843-ce744f3fbd4d.png"></center>

google 了一下没发现有提供解决方案的~~(快速解决问题才是王道)~~，大概推测了一下马蜂窝在去年年底做了这次加密方案。

第一反应，不是先做逆向，而是猜测可能是通过前置请求从后端拿到的，然后翻了一下发现并没有，对比了一下前后几个请求，发现这个参数出现次数还挺多的，**而且值还不一样**，行了 js 加密石锤了

然后去筛哪些 js 对这个参数的生成有所影响（用 chrome 的开发者工具暴力 block）

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1555894491885-4aa9c6d1-df6a-4d44-a147-7ae8442869b7.png)

饿 他们这 js 有点少，闭着眼睛 都能猜出来是哪个，jQuery 一般会放自己构造 cookie 构造 Header 头的逻辑（当然这里也有可能同时使用 Cookie & `_sn`一起做效验）

这个时候我们做一个实验，来看一下 Header 里面的内容有没有作用在 encoder 和 decoder 中。

打开 chrome 的无痕模式(有些时候需要 clear 一下 History, 这跟 ServiceWork 机制有关，有兴趣的同学可以查下相关资料), 先打开开发者模式，然后键入我们爬取的 URL。

（现在我们模拟的是首次进入该网站的用户，通常为了做到首次加载网页在几百 ms 内，都会对一些不必要的功能做 delay 加载操作，这个时候的条件能获得到信息，则之后也能）-这也是一个小技巧吧 🤖

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1555898775208-4ac8717d-5889-4d36-9272-62c417368df1.png)

然后我们看一下，没有 Cookie(这也可以理解，JQuery.js 和混淆所需要的`/js/hotel/sign/index.js`两个文件是异步获取的，为了保证用户的用户体验，前端在首次加载做了妥协。

然后我们工作的重点，就是研究`http://js.mafengwo.net/js/hotel/sign/index.js?1552035728`这个 js 做了哪些混淆

首先，一看这个安全做的就不是特别好，这个 js 是通过静态的 url 来获取的，获取的过程没有任何加密，也就是说我解密出来一次，只要你不发版，我基本上都能用(所以大家看看就行了，别用做商业用途)

(然后，从时间戳上看，这个版本是`2019-03-08 17:02:08`发的，所以起码这一个多月他们没有做什么改动，3 月 8 日星期五，hhh 看不出来是不是 996

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1555897357899-787c7237-bc34-4279-a49e-f0fcd064e2e9.png)

我们来看一下代码，首先，这种混淆也做的比较套路，就是最外层堆一层 Unicode 来让你不能直接在 Preview 中直接看出语义信息，然后丢一个数组来存使用的字符变量

所以我们一开始做的事情是，做 js 代码解混淆，起码先变成能看的代码（PS: 看 Vscode 中右边 👉 预览中，那一大坨很规律的代码块，这一定是做的是类似 DES 的多层加密计算

- 解 Unicode `\\x75` -> `\x75` -> `codecs.unicode_escape_decode(origin_js)[0]`
- 从第五行的数组`__Ox2133f`中，替换常量字符
- 然后这种无意义的变量名称看的难受，而且太长，就做一个替换
- 然后用 Vscode，`Toggle Format`插件做一下自动格式化

```python
def decode_js_test():
    ''' decode js for test '''
    with open(decoder_js_path, 'r') as f:
        decoder_js = [codecs.unicode_escape_decode(ii.strip())[0] for ii in f.readlines()]
    __Ox2133f = [ii.strip() for ii in decoder_js[4][17:-2].replace('\"', '\'').split(',')]
    decoder_str = '|||'.join(decoder_js)
    params = re.findall(r'(\_0x\w{6,8}?)=|,|\)', decoder_str)
    params = sorted(list(set([ii for ii in params if len(ii) > 6])), key=lambda ii: len(ii), reverse=True)
    for ii, jj in enumerate(__Ox2133f):
        decoder_str = decoder_str.replace('__Ox2133f[{}]'.format(ii), jj)
    for ii, jj in enumerate(params):
        decoder_str = decoder_str.replace(jj, 'a{}'.format(ii))
    decoder_js = decoder_str.split('|||')
    with open(origin_js_path, 'w') as f:
        f.write('\n'.join(decoder_js))
    return decoder_js
```

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1555897357854-6681edcc-9753-4baf-8f4d-315e918867ad.png)

经过初步的解耦之后，我们得到了上面的代码。可以看到在第 389 行出现了我们需要的 `_sn` 变量 😙

```js
a40["ajaxPrefilter"](function(a410, a411) {
  var a23 = a40["extend"](true, {}, a411["data"] || {}); // 拿data
  if (a23["_sn"]) {
    delete a23["_sn"]; // 删去已有的`_sn`
  }
  a23["_ts"] = new Date()["getTime"](); // `_ts` = 13位时间戳
  var a13 = a425(a40["extend"](true, {}, a23)); // 加密了
  if ("data" in a410) {
    a410["data"] += "&_ts=" + a23["_ts"] + "&_sn=" + a13; // 拼接字符串
  } else {
    a410["data"] = "_ts=" + a23["_ts"] + "&_sn=" + a13;
  }
});
```

上面这坨代码实际上就是实现`_sn`的入口函数，逻辑比较简单，就是把拿到的拿到的 data 加上当前时间戳，丢给 a425 这个函数

`a425`就是上面那张图第 348 行定义的，a425 也就 40 多行代码，逻辑也很简单

他是调用了`a36`这个函数的`hash`方法，传进去了(一个把 Object 做了 JSON 序列化的字符串，在加上了一个字符常量)，最后对结果截取了 2，12 位

然后`a18`就是上面那行调用了一下`a427`的返回值，大概扫一眼，`a427`做了一件按 dict 的`keys`排序的工作(因为后面要做 JSON 序列化，顺序很重要)

然后`hash`函数是在第 283 行定义的

```js
a36["hash"] = function(a11, a36a) {
  if (/[-￿]/["test"](a11)) {
    a11 = unescape(encodeURIComponent(a11));
  }
  var a26 = a38(a11); // 实际上a36a就是告诉你做几层加密
  return !!a36a ? a26 : a9(a26);
};
```

我想你听到这里已经懵逼了，然后我告诉你，其实这个的逆向已经做完了，只要找到入口函数，（只要接下来的所有函数都在本文件范围内）问题一切都解决了

爬虫 本质上来讲 就是做一个模拟浏览器的工作。从最开始的模拟浏览器发 HTTP 请求，发 WebSocket 请求，到后面的模拟浏览器编译 js，其实做的都是一件事情。

在这里做逆向，也是模拟浏览器做 js 的编译，那为什么不让 node 或者 chrome v8 帮我们做这些事情呢。

很大程度上是因为很多 js 编译需要一个 DOM，当然我们有了 jsdom 之后，这就不是问题了

所以我们按着刚才的思路解析构造 data，添加`_ts`时间戳，做排序，加盐，然后丢给上面的 a36 函数是不是就可以了

```js
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function analysis_js(html, salt, prepare_map) {
  const dom = new JSDOM(html);
  window = dom.window;
  document = window.document;
  window.decodeURIComponent = decodeURIComponent;

  const script_element = document.querySelector("script");
  console.log(script_element);
  const script = script_element.innerHTML;
  eval(script);
  return window["SparkMD5"]
    ["hash"](JSON["stringify"](prepare_map) + salt)
    ["slice"](2, 12);
}
```

在实际操作过程中需要把最后一段入口函数删了，因为他会掉 JQuery 中定义的一个变量, 当然你也可以在前面申明一下这个变量。

[具体代码参见](https://github.com/iofu728/spider/blob/master/mafengwo/mafengwo.py)

拿到大概 95w 个景点信息，至于为什么花了 6 个小时，因为每个页面都需要去调 node 去编译，这个并发数就不能开太多，试了一下超过 300 我的 MBP 就不听话了，最后开了 150 个（这个后面有空可以调优一下

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1555900934786-18e14b43-c6c7-466f-93e3-2e71bc747272.png)

看着黄色的`_sn`弹出来的时候，满脸的喜悦 🌚

## 携程酒店详情页

和携程比起来，前面的马蜂窝就是个弟弟（太真实了，当然这部分比较涉及携程他们核心业务了，做的好也是可以理解的

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1555902084552-056e0124-3b2d-4792-bbdd-de9e5281d604.png)

我们的目标是爬取上面网页中各种房型，及其实时价格(话说我在做这个项目的过程中，见证了这个酒店从最低的 2k 一晚涨到现在最低 2.5k 一晚，有钱真好 🙊

直接切入正题，要的信息是通过`https://hotels.ctrip.com/Domestic/tool/AjaxHote1RoomListForDetai1.aspx?psid=&MasterHotelID=4889292&hotel=4889292&EDM=F&roomId=&IncludeRoom=&city=2&showspothotel=T&supplier=&IsDecoupleSpotHotelAndGroup=F&contrast=0&brand=776&startDate=2019-04-22&depDate=2019-04-23&IsFlash=F&RequestTravelMoney=F&hsids=&IsJustConfirm=&contyped=0&priceInfo=-1&equip=&filter=&productcode=&couponList=&abForHuaZhu=&defaultLoad=T&esfiltertag=&estagid=&Currency=&Exchange=&minRoomId=0&maskDiscount=0&TmFromList=F&th=119&RoomGuestCount=1,1,0&eleven=573c4df76400696c0f50224f3feea79e894d093dbe66ed9a281dc762444f01a0&callback=CASHLJQCOMFKWXCzzML&_=1555901561986`

这个 URL 获得的，可以看到这次的参数有点多，剔除有语义含义的，不会变的，只剩下最后三个参数

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1555902084522-babef171-3f26-4d71-a4d5-91f426af4f7d.png)

同样经过测试，发现 Cookie 对请求没有影响

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1555902084558-3a1734e1-3bdf-4448-a164-0b384348695e.png)

然后还是筛 js，呜呜呜，真 TM 的多，block 之前大概 59 个 js，最后主要是两个 js 在起作用

- `https://webresource.c-ctrip.com/ResHotelOnline/R8/search/js.merge/showhotelinformation.js?releaseno=2019-04-20-10-34-30`
- `https://hotels.ctrip.com/domestic/cas/oceanball?callback=CASkcfYhfhvxJljvZR&_=1555901561840`

根据时间戳，20 号也就是前天，周六，**携程 996 石锤了** 🙈(`showhotelinformation`这个文件实际上是前端和反爬工程师共用的文件，目测应该是前端做了修改)

也正是这个原因，`showhotelinformation`文件长达 8k 多行，我的 Vscode 都卡死了（VScode 垃圾，还是 Sublime 香), 当然这样也以为这这个 js 不会有太多混淆（明明就没有）

为了节省大家时间，直接搜`getDetailHotel`，然后往上看就可以看到 Url 拼接的入口函数`getRoomHtml`

我们发现他通过读 html 一些标签来构造参数，也可以理解，毕竟那么多个酒店详情页呢，得写的通用一点

然后调用了`getHotelDetail`传了拼接好的 URL 和两个回调函数，继续看

```js
getHotelDetails: a,
function a(e, t) {
    $.BizMod.Promise(n).any(function (i) {
        console.log(i);
        i && (e += "&eleven=" + encodeURIComponent(i)),
            o(e, t)
    })
```

可以看到这边通过一个 Promise 的回调函数来获得了 eleven 参数，那么关键就在这个 n 的函数中

```js
function n(t) {
    var o, i = e(15), n = !1; // callback随机15位字符
    for (; i in window;) // 去window里面占坑，用于后面的回调函数
        i = e(15);
    o = hotelDomesticConfig.cas.OceanBallUrl + "?callback=" + i + "&_=" + (new Date).getTime(),
        window[i] = function (e) {
            var o = "";
            try {o = e()
            } catch (i) {
            } finally {
                t.resolve(o)
            }
        },
        $.loader.js(o, { // 调用封装的cQuery的loader js
            onload: function () {
                setTimeout(function () {n || t.reject("")}, 5e3)
            },
            onerror: function (e) {e && (window[i] = void 0),t.reject("")}
        })
}

function e(e) { // 就是随机生成指定长度字符串, 关键应该是字符长度
    for (var t = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], o = "CAS", i = 0; i < e; i++) {
        var n = Math.ceil(51 * Math.random());
        o += t[n]
    }
    return o
}
```

也就是 通过随机生成 callback，请求 oceanball 这个 URL 来获得 eleven

lz 当时也是这么天真的，直到我看了一下返回的 js

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1555903953409-9f26a0f5-c59f-4f82-aa1a-6d4bf3e9fbf1.png)

你可以从右边的预览条感受到这个的恐怖

其实逻辑超级简单，用 String.formCharCode 把那么长的数组转成 js 代码，然后再用 eval 编译这个 js 代码

那我们看一下，Unicode2Char 之后的代码长什么样子

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1555904106996-ffd6b361-d613-46c8-8218-364f06c67d11.png)

同样的做一次解混淆，把过长的不含语义的变量做一个替换，得到

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1555904196200-9a03b246-a4f9-45fa-ac39-b2ca48296d43.png)

可以看到最后一行，出现了我们刚才的那个随机生成的`callback`变量，果然他在这里，作为一个回调函数，需要 window 有声明 `window[callback]` 这个变量

所以，我们要的 eleven 就是上面的 a52，也就是第 408 行做的一个 String.fromCode 操作

好做到这里，其实我已经大概明白了，想也用之前的办法用 jsdom 加 node 编译做一个，

经过一系列调试，结果我竟然拿到了一句具有语义的字符，竟然还是中文，这就跟做坏事被人发现一样，惶恐惶恐

<center><img width="700" src="https://cdn.nlark.com/yuque/0/2019/png/104214/1555907913480-5d5ca694-f788-424c-9230-2889043cfeac.png"></center>

不得不说，携程在这上面还是做了挺多工作的，首先三层混淆，拿到这个 js 的本来就已经比较难了，还做了 node this 的欺骗，防止你直接运行这段代码来获取 eleven

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1555906163089-eba0edcd-2148-4d64-9946-528b24870ed8.png)

其次除了这点，他在代码里还做了很多效验，你 User-Agent 不同拿到的 elven 也是不同的，还会效验`location.url`，`navigation.href`，还会去看你能不能 createElement，有多少个 Element

其次，这个 OceanBall 是动态请求获得的，一个是针对 referer 做的效验，还有一个是其实他这个 js 有好几个版本，防止你只分析一个，

[具体代码详见](https://github.com/iofu728/spider/blob/master/ctrip/hotelDetail.py) 对携程我就只爬了一个页面，因为最近对这部分数据没什么需求，也不打算使劲怼了，成年人要相互体谅 哈哈哈哈哈哈哈哈哈

得到的结果

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1555906163081-77c902ad-643a-4e46-8489-ed323a964261.png)

其实你再用心一点还能发现一些很奇妙的东西，比如说携程好像还和华住有广告合作什么的 hhh

好哩，这部分内容就讲完了，欢迎给我评论交流，谢谢 👹
