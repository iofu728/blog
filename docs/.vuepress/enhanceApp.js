function integrateGitment(router) {
  const linkGitment = document.createElement('link')
  linkGitment.href = 'https://imsun.github.io/gitment/style/default.css'
  linkGitment.rel = 'stylesheet'
  const scriptGitment = document.createElement('script')
  document.body.appendChild(linkGitment)
  scriptGitment.src = 'https://imsun.github.io/gitment/dist/gitment.browser.js'
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
    const gitment = new Gitment({
      id: '/coment',
      owner: 'iofu728',
      repo: 'blog',
      oauth: {
        client_id: '6ac606b7bad30bff534c',
        client_secret: 'cf218bccc6b17b1feaee02b406d0c1f021aaa5e7',
      },
    })
    gitment.render('comments-container')
  }
}

export default ({
  Vue, // VuePress ����ʹ�õ� Vue ���캯��
  options, // ���ӵ���ʵ����һЩѡ��
  router, // ��ǰӦ�õ�·��ʵ��
  siteData // վ��Ԫ����
}) => {
  try {
    // ���ɾ�̬ҳʱ��node��ִ�У�û��document����
    document && integrateGitment(router)
  } catch (e) {
    console.error(e.message)
  }
}
