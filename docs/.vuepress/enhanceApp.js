function integrateGitment(router) {
  const linkGitment = document.createElement('link')
  linkGitment.href = 'https://unpkg.com/gitalk/dist/gitalk.css'
  linkGitment.rel = 'stylesheet'
  const scriptGitment = document.createElement('script')
  document.body.appendChild(linkGitment)
  scriptGitment.src = 'https://unpkg.com/gitalk/dist/gitalk.min.js'
  document.body.appendChild(scriptGitment)

  router.afterEach((to) => {
    // �ѱ���ʼ�������ҳ��������Ⱦ ������
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
      id: '/comment/',
      distractionFreeMode: false
    })
    gitalk.render('comments-container')
  }
}

export default ({
  Vue,      // VuePress ����ʹ�õ� Vue ���캯��
  options,  // ���ӵ���ʵ����һЩѡ��
  router,   // ��ǰӦ�õ�·��ʵ��
  siteData  // վ��Ԫ����
}) => {
  try {
    document && integrateGitment(router)
  } catch (e) {
    console.error(e.message)
  }
}
