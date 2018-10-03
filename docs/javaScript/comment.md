---
pageClass: custom-page-class
---

# Using Gitalk support comment for Vuepress

这两天折腾了一下comment功能

自己写花的代价肯定更大

所以选择用组件

目前用的比较多的有Gitalk Gitment

Gitment因为实践之后不能评论（可能是很久没人维护了）

于是最后选择更实(hao)用(kan)的Gitalk

## OAuth application
Gitalk, Gitment 都是基于GitHub Issue 作为Comment

那么Gitalk和Gitment的原理就相对于调用Github issue的接口对issue内容进行提取展示在div内

那么必须对你的某个repository的issue进行授权

这就是OAuth application

参考[官方文档](https://github.com/gitalk/gitalk)

## initial Issue

刚才说了Gitalk大致的思路

实际上，它调用的接口如下
```http
https://api.github.com/repos/${owner}/${repo}/issues?client_id=${clientID}&client_secret=${clientSecret}&labels=Gitalk,${id}
```

可以看出这个调用的HTTP请求中存在如下参数
1. owner: github username
2. repo: github repository name(ps: 不包括username，仅是repo name)
3. clientID: OAuth application得到的id
4. clientSecret: OAuth application得到的secret
5. id: 可以看出这个是issue的参数，所以我们需要在issues中建立相应带labels为id的issue🎈
  * 因为Lz比较懒，只想建一个issue放comment，所以这里id设为'comment'，你可以用fullPath给每个页面一个comment issue

## enhanceApp.js

vuepress 支持个性定制

用户通过enhanceApp.js对js渲染做相应的改动

参考[官方文档](https://vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements)

其中Gitalk中的各参数参考[initial Issue](#initial-issue)

附上enhanceApp.js作为参考

```js
function integrateGitalk(router) {
  const linkGitalk = document.createElement('link')
  linkGitalk.href = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css'
  linkGitalk.rel = 'stylesheet'
  const scriptGitalk = document.createElement('script')
  document.body.appendChild(linkGitalk)
  scriptGitalk.src = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js'
  document.body.appendChild(scriptGitalk)

  router.afterEach((to) => {
    if (scriptGitalk.onload) {
      renderGitalk(to.fullPath)
    } else {
      scriptGitalk.onload = () => {
        const commentsContainer = document.createElement('div')
        commentsContainer.id = 'gitalk-container'
        commentsContainer.classList.add('content')
        const $page = document.querySelector('.page')
        if ($page) {
          $page.appendChild(commentsContainer)
          renderGitalk(to.fullPath)
        }
      }
    }
  })
  function renderGitalk(fullPath) {
    const gitalk = new Gitalk({
      clientID: '6ac606b7bad30bff534c',
      clientSecret: 'cf218bccc6b17b1feaee02b406d0c1f021aaa5e7',
      repo: 'blog',
      owner: 'iofu728',
      admin: ['iofu728'],
      id: 'comment',
      distractionFreeMode: false,
      language: 'zh-CN',
    })

    gitalk.render('gitalk-container')
  }
}

export default ({Vue, options, router, siteData}) => {
  try {
    document && integrateGitalk(router)
  } catch (e) {
    console.error(e.message)
  }
}
```

## FAQ
1. 如果出现Error: Container not found, document.getElementById: gitalk-container
  * 确保本地启动没这个报错，可能是service 缓存的问题
2. GET https://api.github.com/user 401 (Unauthorized)
  * 无影响
3. vue-router.esm.js?8c4f:1905 ReferenceError: Gitalk is not defined
  * js包还在下载中，找不到Gitalk

如果有其他问题 可以在comment中留言

## 参考
. [VuePress 集成第三方评论模块](https://hughfenghen.github.io/fe/vuepress-gitment.html)
. [评论系统](https://wuwaki.me/yubisaki/usage.html#%E8%AF%84%E8%AE%BA%E7%B3%BB%E7%BB%9F)
