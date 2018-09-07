module.exports = {
  title : '乌云压顶是吧',
  description : '㊗️某人生日快乐🎉',
  serviceWorker : true,
  markdown : {
    config : md => {
      md.set({breaks : true})
      md.use(require('markdown-it'))
    }
  },
  themeConfig : {
    repo : 'iofu728/blog',
    lastUpdated : 'Last Updated',
    editLinks : false,
    docsDir : 'docs',
    algolia :
        {apiKey : 'c42b71d494ca78750c7094eb2c55eda6', indexName : 'wyydsb'},
    serviceWorker : {
      updatePopup :
          {message : 'New content is available.', buttonText : 'Refresh'}
    },
    nav : [
      {text : 'JavaScript', link : '/javaScript/introduce'},
      {text : 'Other', link : '/other/gitSkill'},
    ],
    sidebar : {
      '/other/' : [ 'gitSkill', 'cs' ],
      '/javaScript/' : [
        {
          title : 'umi & dva 的一个实践',
          collapsable : false,
          children : [
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
          title : 'React',
          collapsable : false,
          children : [ 'immutable', 'redux', 'reduxs', 'component' ],
        },
        {
          title : '参考',
          collapsable : false,
          children : [ 'faq' ],
        },
      ],
    },
  },
};
