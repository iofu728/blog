---
title: 利用`Gitalk`给Vuepress搭建的blog增加评论功能
date: 2018-10-03 15:45:06
tags: [Gitalk, Vue, JavaScript]
description: Vuepress Gitalk
---

`Update Vue version` 👉

这两天折腾了一下`comment`功能

自己写花的代价肯定更大

所以选择用组件

目前用的比较多的有Gitalk Gitment

Gitment因为实践之后不能评论（~~可能是很久没人维护了~~）

于是最后选择更实(`hao`)用(`kan`)的Gitalk

## OAuth application
Gitalk, Gitment 都是基于`GitHub Issue `作为Comment

那么Gitalk和Gitment的原理就相对于调用Github issue的接口对issue内容进行提取展示在div内

那么必须对你的某个repository的issue进行授权

这就是`OAuth application`

参考[官方文档](https://github.com/gitalk/gitalk)

## initial Issue

刚才说了Gitalk大致的思路

实际上，它调用的接口如下
```bash
https://api.github.com/repos/${owner}/${repo}/issues?client_id=${clientID}&client_secret=${clientSecret}&labels=Gitalk,${id}
```

可以看出这个调用的HTTP请求中存在如下参数
1. `owner`: github username
2. `repo`: github repository name(ps: 不包括username，仅是repo name)
3. `clientID`: OAuth application得到的id
4. `clientSecret`: OAuth application得到的secret
5. `id`: 可以看出这个是issue的参数，所以我们需要在issues中建立相应带labels为id的issue🎈
    * 因为Lz比较懒，只想建一个issue放comment，所以这里id设为`'comment'`，你可以用fullPath给每个页面一个comment issue

## enhanceApp.js

vuepress 支持个性定制

用户通过`/docs/.vuepress/enhanceApp.js`对js渲染做相应的改动

参考[官方文档](https://vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements)

其中Gitalk中的各参数参考[initial Issue](#initial-issue)

附上enhanceApp.js作为参考

```js
function integrateGitalk(router) {
  const linkGitalk = document.createElement('link');
  linkGitalk.href = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css';
  linkGitalk.rel = 'stylesheet';
  document.body.appendChild(linkGitalk);
  const scriptGitalk = document.createElement('script');
  scriptGitalk.src = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js';
  document.body.appendChild(scriptGitalk);

  router.afterEach((to) => {
    if (scriptGitalk.onload) {
      loadGitalk(to);
    } else {
      scriptGitalk.onload = () => {
        loadGitalk(to);
      }
    }
  });

  function loadGitalk(to) {
    let commentsContainer = document.getElementById('gitalk-container');
    if (!commentsContainer) {
      commentsContainer = document.createElement('div');
      commentsContainer.id = 'gitalk-container';
      commentsContainer.classList.add('content');
    }
    const $page = document.querySelector('.page');
    if ($page) {
      $page.appendChild(commentsContainer);
      if (typeof Gitalk !== 'undefined' && Gitalk instanceof Function) {
        renderGitalk(to.fullPath);
      }
    }
  }
  function renderGitalk(fullPath) {
    const gitalk = new Gitalk({
      clientID: 'xxx',
      clientSecret: 'xxx', // come from github development
      repo: 'blog',
      owner: 'iofu728',
      admin: ['iofu728'],
      id: 'comment',
      distractionFreeMode: false,
      language: 'zh-CN',
    });
    gitalk.render('gitalk-container');
  }
}

export default ({Vue, options, router}) => {
  try {
    document && integrateGitalk(router)
  } catch (e) {
    console.error(e.message)
  }
}
```

## Vue 版本
但 因为Gitalk 写的时候是用React 所以import 其实会报错 所以 还是第一种Work
```vue
<template>
    <v-card>
        <v-card-title>
            <div id="gitalk-container" class="comment"></div>
        </v-card-title>
    </v-card>
</template>
<script>
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'

  export default {
    name: '',
    data() {
      return {
        gitalk: new Gitalk({
          clientID: 'xxx',
          clientSecret: 'xxx',
          repo: 'blog',
          owner: 'iofu728',
          admin: ['iofu728'],
          id: 'comment',
          distractionFreeMode: false,
          language: 'zh-CN',
        })
      }
    },
    mounted(){
      this.gitalk.render("gitalk-container");
    }

  }
</script>
<style lang="stylus">
  .comment
    padding 1rem
    margin 0 auto

</style>
```

## FAQ
1. 如果出现`Error: Container not found, document.getElementById: gitalk-container`
    * 确保本地启动没这个报错，可能是`service 缓存`的问题
    * 也有可能是真的没有初始化`gitalk-container div`
      - 为解决这个问题，对已经scriptGitalk的页面重新建立gitalk-container div
2. `GET https://api.github.com/user 401 (Unauthorized)`
    * 无影响
3. `vue-router.esm.js?8c4f:1905 ReferenceError: Gitalk is not defined`
    * js包还在下载中，找不到Gitalk
4. `NetWork Error`
    * 一开始还以为是js加载顺序的问题（于是把拖了快一个月问题3的bug修了）
    * 后来才发现那段时间GitHub Api不稳定 你频繁请求的时候 是会出现Network Error的状态
    * 这个就无解了

如果有其他问题 可以在comment中留言

## 参考
. [VuePress 集成第三方评论模块](https://hughfenghen.github.io/fe/vuepress-gitment.html)  
. [评论系统](https://wuwaki.me/yubisaki/usage.html#%E8%AF%84%E8%AE%BA%E7%B3%BB%E7%BB%9F)
