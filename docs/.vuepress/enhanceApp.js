import Gitalk from 'gitalk'

function integrateGitment(router) {
  const linkGitalk = document.createElement('link')
  linkGitalk.href = 'https://unpkg.com/gitalk/dist/gitalk.css'
  linkGitalk.rel = 'stylesheet'
  const scriptGitalk = document.createElement('script')
  document.body.appendChild(linkGitalk)
  scriptGitalk.src = 'https://unpkg.com/gitalk/dist/gitalk.min.js'
  document.body.appendChild(scriptGitalk)

  router.afterEach((to) => {
    if (scriptGitalk.onload) {
      renderGitalk(to.fullPath)
    } else {
      scriptGitalk.onload = () => {
        const commentsContainer = document.createElement('div')
        commentsContainer.id = 'comments'
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
      language: ['zh-CN', 'en'],
      id: fullPath,
      distractionFreeMode: false
    })

    gitalk.render('comments')
  }
}

export default ({
  Vue,      // VuePress 正在使用的 Vue 构造函数
  options,  // 附加到根实例的一些选项
  router,   // 当前应用的路由实例
  siteData  // 站点元数据
}) => {
  try {
    // 生成静态页时在node中执行，没有document对象
    document && integrateGitment(router)
  } catch (e) {
    console.error(e.message)
  }
}
