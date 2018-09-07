---
pageClass: custom-page-class
---
# 部署

## Service Work
`umi` 支持 Service Work （Https/localhost）

这对于使用缓存，加快js加载，有着得天独厚的帮助

当然因为使用了缓存，js build的时候必须使用hash作为文件名，以便判断是否启用缓存。

## 按需加载 及 静默加载

为了优化初始加载js时候的时间，使用按需加载模式，即把js文件按照页面维度打包，初始加载时候仅加载必要的几个文件。

build 之后会在./dist下生成：

```
./dist
├── index.html
└── static
    ├── pages__index.hash4.async.js
    ├── pages__list.hash3.async.js
    ├── umi.hash2.js
    └── umi.hash1.css
```
index.html 会加载 umi.{hash}.js 和 umi.{hash}.css，然后按需加载 index 和 list 两个页面的 JS。

但最初的实践过程中，发现按需加载延迟可能会达到300ms-600ms，已经达到可观察范围，可谓效果不太好。

于是，尝试了以下几种方案：
1. 一次性加载 结果就是在胡桃街渣服务器下，首次加载可能要个10-20s，然后就被师傅训了一顿。用户体验爆炸💥。
2. 按需加载+静默加载。静默加载就是当用户已经看得见首页之后，默默的把剩下的js资源记载一遍
* 一开始，为了偷懒，省去了hash值，把所需要加载的js列表写死在项目中。当Subscription监听到history action，先加载layout等必须的js.
等待主页加载好，既layouts/index.js进入生命周期时，把剩下的所有资源同步加载。这个阶段实测胡桃街初次加载时间在2s-6s左右
* 之后，因为接入Services Work，为了发版之后，不再调用上个版本的缓存，写了个脚本，存储build完所有js列表。并按重要程度，分为上下两部分。
当Subscription监听到history action 之后，先用fetch 调用list，然后根据list分两次同步加载js。目前实现Load时间在400ms-800ms左右。

![图片.png | left | 747x558](https://cdn.nlark.com/yuque/0/2018/png/104214/1535016231978-5b9af5e2-e384-4fb1-90d6-c1f4e55611e2.png "")
```bash
echo https://cavalry.corp.yiran.com/sdk/js/v1.js >> static/list.js
for file in static/*layout*.js static/*common*.js static/*pages__index*.js static/*task__index*.js static/*.js
do
    if test -f $file
    then
        echo "/$file" >> static/list.js
    fi
done
```

```jsx
    * fetchHashList (_, { call }) {
      importScriptTime = 1;
      const { data } = yield call(layoutServices.fetchHashList);
      const firstHashList = data.split('\n').slice(0, 5);
      firstHashList.forEach(r => {
        const script = document.createElement('script');
        script.type = 'application/javascript';
        script.async = true;
        script.src = r;
        document.body.appendChild(script);
      });
      setTimeout(() => {
        data.split('\n').slice(7, -2)
          .filter(r => !firstHashList.includes(r))
          .forEach(r => {
            const script = document.createElement('script');
            script.type = 'application/javascript';
            script.async = true;
            script.src = r;
            document.body.appendChild(script);
          });
      }, intervalTime);
    },
```

## 入场动画
为了努力实现`双一流`项目建设，在比对了各大网站之后，决定给TAISHAN加一个入场动画

实现原理：
* 在index.html加载完之后先展示layouts/PageLoadingComponent.js;
* 当layouts/index.js加载完成，开始计时，1s之后动画结束;
* 1s的设定是基于利用Services Work + 静默加载优化过后，时间差过小，入场动画反而起到不适感;
* 具体的动画原理，是基于svg + rc-tween-one，其中svg利用online generate 工具;

## 参考
* [Ant Motion](https://motion.ant.design/components/tween-one)


