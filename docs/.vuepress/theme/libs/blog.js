import sortBy from 'lodash/sortBy'
import dayjs from 'dayjs'
import request from '../requests'
import '../styles/global.styl'

const slugReg = /\/([^\/]+).html$/
function matchSlug(path) {
  const arr = path.match(slugReg)
  return arr ? arr[1] : null
}
let time = 0

const install = (Vue, { theme, pages }) => {
  // 不依赖已有的内置数据，在这里对 siteData 解析，组装博客需要的数据混入Vue
  // Example： { postList: [], posts: {}, tagList: [], tags: { }  }
  const postList = []
  const posts = {}
  const pageViews = {}
  const titleList = []

  request('/api/pv/list?timestamp=' + new Date().getTime())
    .then(res => res.result)
    .then(pv => Object.keys(pv).forEach(r => pageViews[r] = pv[r]))
    .catch(reason => console.log(reason.message));

  sortBy(pages, page => -new Date(page.frontmatter.date)).forEach(page => {
    const slug = matchSlug(page.path)
    postList.push(slug)
    posts[slug] = { ...page, slug }
    titleList.push(page.title)
  })

  const tags = {}
  const tagList = []
  postList.forEach(slug => {
    const list = posts[slug].frontmatter ? posts[slug].frontmatter.tags || [] : []
    list.forEach(tagName => {
      if (!tags[tagName]) {
        tags[tagName] = []
        tagList.push(tagName)
      }
      tags[tagName] = tags[tagName].concat(slug)
    })
  })

  Vue.mixin({
    created () {
      time += 1
      this.waitTime(time)
    },
    methods: {
      waitTime(tempTime) {
        setTimeout(() => {if(tempTime === time) {
          try {
            window && this.updateZoom();
            this.getPageViews();
          } catch (e) {
            console.error(e.message)
          }
        }}, 500)
      },
      updateZoom () {
        import('medium-zoom')
          .then(mediumZoom => {
            mediumZoom.default(document.querySelectorAll('.content img'));
          })
      },
      getPageViews () {
        console.log(pageViews);
        console.log(this.$page.path);
        request('/api/pv/update?timestamp=' + new Date().getTime() + '&titleName=' + matchSlug(this.$page.path))
          .catch(reason => console.log(reason.message));

      },
    },
    computed: {
      $blog() {
        return { postList, posts, tags, tagList, pageViews, titleList}
      },
      $postNav() {
        const slug = matchSlug(this.$route.path)
        if (!slug) return
        const index = postList.indexOf(slug)
        const prev = postList[index - 1]
        const next = postList[index + 1]
        return {
          prev: prev ? posts[prev] : null,
          next: next ? posts[next] : null
        }
      },
      $page() {
        // override $page data
        const { path, meta } = this.$route
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i]
          const titleName = matchSlug(page.path)

          const layout = page.frontmatter ? page.frontmatter.layout || 'post' : 'post'
          if (page.path === path || layout === meta.layout) {
            if (Object.keys(pageViews).length && pageViews.titleViewsMap && titleName in pageViews.titleViewsMap){
              return { ...page, path, titleViews: pageViews.titleViewsMap[titleName]}
            }
            return { ...page, path } // rewrite path
          }
        }
      }
    }
  })

  const format = theme.format
  Vue.filter('date', value => dayjs(value).format(format.date))
  Vue.filter('dateTime', value => dayjs(value).format(format.dateTime))
}

export default { install }
