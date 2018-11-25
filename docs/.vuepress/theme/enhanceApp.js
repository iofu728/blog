import i18n from './libs/i18n'
import blog from './libs/blog'
import routes from './libs/routes'
import components from './components'
import './styles/theme.styl'


function getGitalk() {
  const linkGitalk = document.createElement('link');
  linkGitalk.href = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css';
  linkGitalk.rel = 'stylesheet';
  document.body.appendChild(linkGitalk);
  const scriptGitalk = document.createElement('script');
  scriptGitalk.src = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js';
  document.body.appendChild(scriptGitalk);
}

export default ({ Vue, options, router, siteData }) => {
  const { themeConfig: theme, pages } = siteData
  Vue.use(i18n, theme.lang)
  Vue.use(blog, { theme, pages })
  Vue.use(routes, { router, theme })
  Vue.use(components, theme)
  try {
    document && getGitalk()
  } catch (e) {
    console.error(e.message)
  }
}
