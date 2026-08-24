import { withBase } from 'vitepress'
import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
import i18n from './libs/i18n'
import blog from './libs/blog'
import ripple from './directives/ripple'

import '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css'
import '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css'
import '@fortawesome/fontawesome-free-webfonts/css/fontawesome.css'
import './styles/vendor-vuetify.css'
import './styles/theme-colors.css'
import './styles/theme.styl'

export default {
  Layout,
  NotFound,
  enhanceApp({ app, router, siteData }) {
    app.use(i18n)
    app.use(blog, router)
    app.directive('ripple', ripple)
    // vuepress 全局属性到 VitePress 体系的映射
    app.config.globalProperties.$site = siteData.value
    app.config.globalProperties.$siteTitle = siteData.value.title
    app.config.globalProperties.$withBase = withBase
    app.config.globalProperties.$route = router.route
  }
}
