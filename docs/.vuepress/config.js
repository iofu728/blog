module.exports = {
  title: '乌云压顶是吧',
  description: '㊗️某人生日快乐🎉',
  serviceWorker: true,
  markdown: {
    lineNumbers: true,
    config: md => {
      md.set({ breaks: true })
      md.use(require('markdown-it'))
    }
  },
  themeConfig: {
    repo: 'iofu728/blog',
    lastUpdated: 'Last Updated',
    editLinks: false,
    docsDir: 'docs',
    algolia: {
      apiKey: 'c42b71d494ca78750c7094eb2c55eda6',
      indexName: 'wyydsb'
    },
    serviceWorker: {
      updatePopup: true
    },
    nav: [
      { text: 'React', link: '/react/componentdidupdate' },
      { text: 'Summary', link: '/summary/cs' },
      { text: 'Pdd', link: '/pdd/' },
      { text: 'Collect', link: '/collect/' },
    ],
    sidebar: {
      '/react/': [
        {
          title: 'Component',
          collapsable: false,
          children: [
            'componentdidupdate',
            'component',
          ],
        },
        {
          title: 'Redux',
          collapsable: false,
          children: ['redux', 'reduxs'],
        },
        {
          title: 'Other',
          collapsable: false,
          children: ['immutable'],
        },
      ],
      '/summary/': ['cs'],
      '/pdd/': [
        {
          title: '指南',
          collapsable: false,
          children: [
            '',
            'structure',
            'router',
            'dva',
            'promise',
            'fetch',
            'deploy',
            'style',
            'mock',
          ],
        },
        {
          title: '参考',
          collapsable: false,
          children: ['faq'],
        },
      ],
    },
  },
};
