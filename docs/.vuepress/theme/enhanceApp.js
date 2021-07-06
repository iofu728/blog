import i18n from './libs/i18n'
import blog from './libs/blog'
import routes from './libs/routes'
import components from './components'

function getGitalk() {
  const linkGitalk = document.createElement('link');
  linkGitalk.href = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css';
  linkGitalk.rel = 'stylesheet';
  document.body.appendChild(linkGitalk);
  const scriptGitalk = document.createElement('script');
  scriptGitalk.src = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js';
  document.body.appendChild(scriptGitalk);
}

function prepare (siteData) {
  siteData.pages.forEach(page => {
    if (!page.frontmatter) {
      page.frontmatter = {}
    }
    page.author = siteData.themeConfig.author;
  })
  siteData.pages.push({
    frontmatter: {},
    key: "v-8848",
    path: "/404.html",
    title: "404",
  })
  if (siteData.locales) {
    Object.keys(siteData.locales).forEach(path => {
      siteData.locales[path].path = path
    })
  }
  Object.freeze(siteData)
}

export default ({ Vue, options, router, siteData }) => {
  prepare(siteData)
  const { themeConfig: theme, pages } = siteData
  Vue.use(i18n, theme.lang)
  Vue.use(blog, { theme, pages })
  Vue.use(routes, { router, theme })
  Vue.use(components, theme)
  try {
    document
  } catch (e) {
    console.error(e.message)
  }
}
