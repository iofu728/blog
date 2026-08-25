// 旧 docs/.vuepress/config.js 的 themeConfig 原样搬迁。
// 独立成模块是因为 node 侧(posts.data.js / tags/[tag].paths.js)和客户端(theme)都要用,
// 从 .vitepress/config.js 反向 import 会把整个站点配置拖进数据 loader。
export default {
  lang: 'en-US',
  subTitle: ' ',
  authorFirstName: 'Huiqiang',
  authorLastName: 'Jiang',
  icpLicense: '浙ICP备19005445号',
  email: 'iofu728@163.com',
  since: 2017,
  avatar: '/face.jpg',
  avatarLink: '/',
  menus: [
    // icons by https://fontawesome.com/icons
    { text: 'Home', icon: 'fa fa-home', url: '/' },
    { text: 'NLP', icon: 'fab fa-nintendo-switch', url: '/NLP/MInference.html' },
    { text: 'Spider', icon: 'fa fa-bug', url: '/Spider/jsdecoder.html' },
    { text: 'Linux', icon: 'fab fa-linux', url: '/Linux/spinlock.html' },
    { text: 'Tags', icon: 'fa fa-tag', url: '/tags/' },
    {
      text: 'Scholar',
      icon: 'fas fa-adjust',
      url: 'https://scholar.google.com/citations?user=99KtvpYAAAAJ',
      external: true
    },
    {
      text: 'Zhihu',
      icon: 'fa fa-podcast',
      url: 'https://www.zhihu.com/people/gunjianpan',
      external: true
    },
    {
      text: 'CV',
      icon: 'fa fa-user-circle',
      url: 'https://hqjiang.com',
      external: true
    },
  ],
  socials: ['Weibo', 'QQ', 'Facebook', 'Twitter', 'GooglePlus'],
  colors: {
    primary: '#07527a',
    secondary: '#6d6d6d',
    accent: '#fff',
    error: '#DC143C',
    warning: '#e6af5f',
    info: '#00B8D4',
    success: '#1DA57A'
  },
  format: { date: 'YYYY年MM月DD日 HH:mm:ss', dateTime: 'YYYY年MM月DD日 HH:mm:ss' },
  pagination: { path: '/page/:pageNum', pageSize: 5 },
  tags: { path: '/tags/:tagName' },
  categories: { path: '/categories/:category' },
  sidebar: {
    '/NLP/': [
      {
        title: 'NLP',
        collapsable: false,
        children: [
          'MInference', 'LLMLingua_en', 'LLMLingua', 'MLKD', 'AdvPicker', 'CGExpan',
          'REALM', 'kadapter', 'relativepositionembed', 'mrfn', 'xiaoice',
          'summarization', 'ecmo', 'chatbot', 'rnn', 'vsm'
        ],
      },
    ],
    '/DataMining/': [
      {
        title: 'Data Mining',
        collapsable: false,
        children: ['ppr', 'pageranks', 'pagerank', 'frequent'],
      },
    ],
    '/Linux/': [
      {
        title: 'Linux',
        collapsable: false,
        children: ['schedule', 'synch', 'spinlock'],
      },
    ],
    '/Spider/': [
      {
        title: 'Spider',
        collapsable: false,
        children: ['jsdecoder', 'spiderskill', 'neteasedb', 'netease'],
      },
    ],
    '/DB/': [
      {
        title: 'DB',
        collapsable: false,
        children: ['peloton', 'truncate'],
      },
    ],
    '/Operations/': [
      {
        title: 'Operations',
        collapsable: false,
        children: ['AcademicTrans', 'zshsh', 'terminal', 'brew', 'spider', 'pv', 'redirect', 'nohup', 'accident', 'gitSkill', 'nginx'],
      },
      {
        title: 'Hadoop',
        collapsable: false,
        children: ['pseudo', 'mapreduce'],
      },
    ],
    '/other/': [
      {
        title: 'Summary',
        collapsable: false,
        children: ['deecamp', 'cs'],
      },
      {
        title: 'Sundry',
        collapsable: false,
        children: ['numpy', 'chip'],
      },
    ],
    '/Coding/': [
      'LeetCode',
      'catalog',
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
          '1014', '1017', '1018', '1021', '1022', '1026', '1033', '1034',
          '1040', '1044', '1049', '1056', '1057', '1066', '1068', '1072',
          '1075', '1076', '1079', '1080', '1082', '1086', '1087', '1107',
        ],
      },
    ],
    '/javaScript/': [
      {
        title: 'Vuepress',
        collapsable: false,
        children: ['comment'],
      },
      {
        title: 'React',
        collapsable: false,
        children: ['functional', 'immutable', 'redux', 'reduxs', 'component'],
      },
    ],
  }
}
