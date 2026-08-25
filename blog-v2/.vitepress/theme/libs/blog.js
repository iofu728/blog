import { reactive } from 'vue'
import request from '../requests'
import { matchSlug } from './utils'
import { data as blogData } from '../data/posts.data'

const MATH_REG = /\$\$|\\\(|\\\[|\\begin\{/

// 语义照抄旧 docs/.vuepress/theme/libs/blog.js:
// 数据由 data/posts.data.js 在构建期算好,这里只做客户端挂载(PV、MathJax、图片缩放、$page 覆写)
const { pagesByPath, pageByLayout, postList, posts, tags, tagList, titleList, tagGList } = blogData
const pageViews = reactive({})

// 访问量接口只在浏览器端请求,SSR 构建时没有 window
let pvFetched = false
function fetchPageViews() {
  if (typeof window === 'undefined' || pvFetched) return
  pvFetched = true
  request('/api/pv/list?timestamp=' + new Date().getTime(), { headers: { 'Content-Type': 'application/json' } })
    .then(res => res && res.result)
    .then(pv => pv && Object.keys(pv).forEach(r => pageViews[r] = pv[r]))
    .catch(reason => console.log(reason && reason.message))
}

function replaceLatexCode() {
  var i, text, code, codes = document.getElementsByTagName('code')
  for (i = 0; i < codes.length;) {
    code = codes[i]
    if (code.parentNode.tagName !== 'PRE' && code.childElementCount === 0) {
      text = code.textContent
      if (/^\$[^$]/.test(text) && /[^$]\$$/.test(text)) {
        text = text.replace(/^\$/, '\\(').replace(/\$$/, '\\)')
        code.textContent = text
      }
      if (/^\\\((.|\s)+\\\)$/.test(text) || /^\\\[(.|\s)+\\\]$/.test(text) ||
          /^\$(.|\s)+\$$/.test(text) ||
          /^\\begin\{([^}]+)\}(.|\s)+\\end\{[^}]+\}$/.test(text)) {
        code.outerHTML = code.innerHTML // remove <code></code>
        continue
      }
    }
    i++
  }
}

function hasMath() {
  const content = document.querySelector('.content')
  if (!content) return false
  return MATH_REG.test(content.innerHTML)
}

function getMathJax() {
  // 注:原 AMS-setcounter.js 托管在 wyydsb.xin/files/ 下,已 404,不再加载
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS-MML_HTMLorMML'
  script.id = 'tex-ams'
  setTimeout(() => document.body.appendChild(script), 500)
  setTimeout(() => {
    const el = document.getElementById('tex-ams')
    el && el.remove()
  }, 2000)
}

function updateZoom() {
  import('medium-zoom')
    .then(mediumZoom => {
      mediumZoom.default(document.querySelectorAll('.content img'))
    })
}

function reportPageView(path) {
  request('/api/pv/update?timestamp=' + new Date().getTime() + '&titleName=' + matchSlug(path), { headers: { 'Content-Type': 'application/json' } })
    .catch(reason => console.log(reason && reason.message))
}

// 页面内的 DOM 任务(数学公式、图片缩放、访问量)只需在内容稳定后执行一次。
// 每个组件 created 都会触发调度,这里用防抖合并,全局最多保留一个定时器。
let timer = null
const makeSchedule = route => () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    if (typeof document === 'undefined') return
    try {
      replaceLatexCode()
      if (hasMath()) {
        getMathJax()
      }
      updateZoom()
      reportPageView(route.path)
    } catch (e) {
      console.error(e.message)
    }
  }, 500)
}

// VitePress 首页/索引页路由形如 /index.html、/tags/index.html,
// loader 产出的页面 path 形如 /、/tags/,查找 $page 前先归一化
function normalizeRoutePath(path) {
  return path.replace(/(^|\/)index\.html$/, '$1') || '/'
}

const install = (app, r) => {
  // 注意:闭包捕获本 app 的 route,不能用模块级变量——
  // SSR 构建时多个页面并发渲染、共享模块状态,模块级 router 会串到其他 app
  const route = r.route
  const schedule = makeSchedule(route)
  fetchPageViews()

  app.config.globalProperties.$blog = { postList, posts, tags, tagList, pageViews, titleList, tagGList }

  Object.defineProperty(app.config.globalProperties, '$postNav', {
    get() {
      const slug = matchSlug(route.path)
      if (!slug) return
      const index = postList.indexOf(slug)
      const prev = postList[index - 1]
      const next = postList[index + 1]
      return {
        prev: prev ? posts[prev] : null,
        next: next ? posts[next] : null
      }
    }
  })

  Object.defineProperty(app.config.globalProperties, '$page', {
    get() {
      // override $page data(语义同旧版:按 path 精确匹配,否则按 layout 兜底,path 重写为当前路由)
      const path = normalizeRoutePath(route.path)
      const frontmatter = route.data && route.data.frontmatter
      const layout = (frontmatter && frontmatter.layout) || 'post'
      const page = pagesByPath[path] || pageByLayout[layout]
      if (!page) return { path, title: '', frontmatter: {} }
      const titleName = matchSlug(page.path)
      if (Object.keys(pageViews).length && pageViews.titleViewsMap && titleName in pageViews.titleViewsMap) {
        return { ...page, path, titleViews: pageViews.titleViewsMap[titleName] }
      }
      return { ...page, path } // rewrite path
    }
  })

  app.mixin({
    created() {
      schedule()
    }
  })
}

export default { install }
