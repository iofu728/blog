module.exports = {
  title: '乌云压顶是吧',
  description: '㊗️某人生日快乐🎉',
  serviceWorker: true,
  markdown: {
    config: md => {
      md.set({breaks: true})
      md.use(require('markdown-it'))
    }
  },
  themeConfig: {
    repo: 'iofu728/blog',
    lastUpdated: 'Last Updated',
    editLinks: false,
    docsDir: 'docs',
    algolia: {apiKey: 'c42b71d494ca78750c7094eb2c55eda6', indexName: 'wyydsb'},
    serviceWorker: {
      updatePopup:
          {message: 'New content is available.', buttonText: 'Refresh'}
    },
    nav: [
      {text: 'Pat', link: '/pat/'},
      {text: 'JavaScript', link: '/javaScript/introduce'},
      {text: 'Other', link: '/other/pv'},
    ],
    sidebar: {
      '/other/': ['pv', 'gitSkill', 'pdd', 'cs'],
      '/pat/': [
        '',
        {
          title: 'Summary',
          collapsable: false,
          children: ['sort', 'entrance'],
        },
        {
          title: 'ANOJ',
          collapsable: false,
          children: ['anoj2018II'],
        },
        {
          title: 'PAT',
          collapsable: false,
          children: [
            '1014', '1015', '1017', '1018', '1021', '1022', '1026',
            '1033', '1034', '1038', '1040', '1044', '1049', '1056',
            '1057', '1063', '1066', '1068', '1072', '1073', '1074',
            '1075', '1076', '1077', '1078', '1079', '1080', '1081',
            '1082', '1083', '1084', '1085', '1086', '1087'
          ],
        },
      ],
      '/javaScript/': [
        {
          title: 'umi & dva 的一个实践',
          collapsable: false,
          children: [
            'introduce',
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
          title: 'React',
          collapsable: false,
          children: ['immutable', 'redux', 'reduxs', 'component'],
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
