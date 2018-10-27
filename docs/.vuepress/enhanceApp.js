function integrateGitalk(router) {
  const linkGitalk = document.createElement('link')
  linkGitalk.href = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css'
  linkGitalk.rel = 'stylesheet'
  document.body.appendChild(linkGitalk)
  const scriptGitalk = document.createElement('script')
  scriptGitalk.src = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js'
  document.body.appendChild(scriptGitalk)
  const katex = document.createElement('link')
  katex.href =
      'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css'
  katex.rel = 'stylesheet'
  const markdownCss = document.createElement('link')
  markdownCss.href =
      'https://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css'
  markdownCss.rel = 'stylesheet'
  document.body.appendChild(katex)
  document.body.appendChild(markdownCss)

  router.afterEach((to) => {
    if (scriptGitalk.onload) {
      loadGitalk(to)
    } else {
      scriptGitalk.onload = () => {
        loadGitalk(to)
      }
    }
  })

  function loadGitalk(to) {
    const commentsContainer = document.createElement('div')
    commentsContainer.id = 'gitalk-container'
    commentsContainer.classList.add('content')
    const $page = document.querySelector('.page')
    if ($page) {
      $page.appendChild(commentsContainer)
      renderGitalk(to.fullPath)
    }
  }
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
