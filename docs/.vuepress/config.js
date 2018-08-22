module.exports = {
  title: '乌云压顶是吧',
  description: '🍿很高兴不认识你🐮🍺',
  serviceWorker: true,
  themeConfig: {
    repo: 'iofu728/blog',
    lastUpdated: 'Last Updated',
    editLinks: false,
    docsDir: 'docs',
    nav: [
      { text: 'React', link: '/react/componentdidupdate' },
      { text: 'Summary', link: '/summary/cs' },
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
    },
  },
};
