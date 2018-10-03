function integrateGitment(router) {
  const linkGitment = document.createElement('link')
  linkGitment.href = 'https://unpkg.com/gitalk/dist/gitalk.css'
  linkGitment.rel = 'stylesheet'
  const scriptGitment = document.createElement('script')
  document.body.appendChild(linkGitment)
  scriptGitment.src = 'https://unpkg.com/gitalk/dist/gitalk.min.js'
  document.body.appendChild(scriptGitment)

  router.afterEach((to) => {
    // 已被初始化则根据页面重新渲染 评论区
    if (scriptGitment.onload) {
      renderGitment(to.fullPath)
    } else {
      scriptGitment.onload = () => {
        const commentsContainer = document.createElement('div')
        commentsContainer.id = 'comments-container'
        commentsContainer.classList.add('content')
        const $page = document.querySelector('.page')
        if ($page) {
          $page.appendChild(commentsContainer)
          renderGitment(to.fullPath)
        }
      }
    }
  })

  function renderGitment(fullPath) {
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
    gitalk.render('comments-container')
  }
}

export default ({
  Vue,      // VuePress 正在使用的 Vue 构造函数
  options,  // 附加到根实例的一些选项
  router,   // 当前应用的路由实例
  siteData  // 站点元数据
}) => {
  try {
    integrateGitment(router)
  } catch (e) {
    console.error(e.message)
  }
}
