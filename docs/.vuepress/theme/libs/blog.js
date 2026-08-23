import dayjs from 'dayjs'
import request from '../requests'
import '../styles/global.styl'
import { decoderTagName, decoderTagGraph, matchSlug } from './utils'


const MATH_REG = /\$\$|\\\(|\\\[|\\begin\{/

const install = (Vue, { theme, pages }) => {
  // 不依赖已有的内置数据，在这里对 siteData 解析，组装博客需要的数据混入Vue
  // Example： { postList: [], posts: {}, tagList: [], tags: { }  }
  const postList = []
  const posts = {}
  const pageViews = {}
  const titleList = []

  // 访问量接口只在浏览器端请求，SSR 构建时没有 window
  if (typeof window !== 'undefined') {
    request('/api/pv/list?timestamp=' + new Date().getTime(), {headers: {'Content-Type': 'application/json'}})
      .then(res => res.result)
      .then(pv => Object.keys(pv).forEach(r => pageViews[r] = pv[r]))
      .catch(reason => console.log(reason.message));
  }

  // $page 查找索引，避免每个组件求值时都 O(n) 扫描全量页面
  const pagesByPath = {}
  const pageByLayout = {}
  pages.forEach(page => {
    pagesByPath[page.path] = page
    const layout = page.frontmatter && page.frontmatter.layout || 'post'
    if (!(layout in pageByLayout)) {
      pageByLayout[layout] = page
    }
  })

  // 按日期倒序（与原 sortBy(pages, page => -new Date(date)) 等价）
  pages.slice()
    .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
    .forEach(page => {
      const slug = matchSlug(page.path)
      postList.push(slug)
      posts[slug] = { ...page, slug }
      titleList.push(page.title)
    })

  const tags = {}
  const tagG = {}
  const tagGList = {}
  postList.forEach(slug => {
    const list = posts[slug].frontmatter ? posts[slug].frontmatter.tags || [] : []
    const tmpTagG = {};
    const addTag = new Set();
    list.forEach(tagName => {
      const t = decoderTagName(tagName);
      t.forEach(tt => {
        tt.forEach(k => {
          if (!tags[k]) {
            tags[k] = []
          }
          if (!addTag.has(k)) {
            tags[k] = tags[k].concat(slug);
            addTag.add(k);
          }
          if (!tagG[k]) {
            tagG[k] = new Set();
          }
          if (!tmpTagG[k]) {
            tmpTagG[k] = new Set();
          }
        })
        var l0 = tt[0], l1 = tt[1], l2 = tt[2];
        if (!!l1) {
          tagG[l0].add(l1);
          tmpTagG[l0].add(l1);
        }
        if (!!l2) {
          tagG[l1].add(l2);
          tmpTagG[l1].add(l2);
        }
      })
    })
    tagGList[slug] = decoderTagGraph(tmpTagG);
  })
  const tagList = decoderTagGraph(tagG);

  function replaceLatexCode() {
    var i, text, code, codes = document.getElementsByTagName('code');
    for (i = 0; i < codes.length;) {
      code = codes[i];
      if (code.parentNode.tagName !== 'PRE' && code.childElementCount === 0) {
        text = code.textContent;
        if (/^\$[^$]/.test(text) && /[^$]\$$/.test(text)) {
          text = text.replace(/^\$/, '\\(').replace(/\$$/, '\\)');
          code.textContent = text;
        }
        if (/^\\\((.|\s)+\\\)$/.test(text) || /^\\\[(.|\s)+\\\]$/.test(text) ||
            /^\$(.|\s)+\$$/.test(text) ||
            /^\\begin\{([^}]+)\}(.|\s)+\\end\{[^}]+\}$/.test(text)) {
          code.outerHTML = code.innerHTML;  // remove <code></code>
          continue;
        }
      }
      i++;
    }
  }

  function hasMath() {
    const content = document.querySelector('.content');
    if (!content) return false;
    return MATH_REG.test(content.innerHTML);
  }

  function getMathJax() {
    // 注:原 AMS-setcounter.js 托管在 wyydsb.xin/files/ 下,已 404,不再加载
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
    script.id = "tex-ams";
    setTimeout(() => document.body.appendChild(script), 500);
    setTimeout(() => document.getElementById("tex-ams").remove(), 2000);
  }

  function updateZoom() {
    import('medium-zoom')
      .then(mediumZoom => {
        mediumZoom.default(document.querySelectorAll('.content img'));
      })
  }

  function reportPageView(path) {
    request('/api/pv/update?timestamp=' + new Date().getTime() + '&titleName=' + matchSlug(path), {headers: {'Content-Type': 'application/json'}})
      .catch(reason => console.log(reason.message));
  }

  function renderUtteranc() {
    var container = document.getElementById('utteranc-container');
    var script = document.createElement("script");
    script.type = 'text/javascript';
    script.id = "utteranc";
    script.async = true;
    script.setAttribute('issue-term', 'title');
    script.setAttribute('theme', 'github-light')
    script.setAttribute('repo', `iofu728/blog`)
    script.setAttribute('crossorigin', `anonymous`)
    script.src = 'https://utteranc.es/client.js';
    container.appendChild(script);
  }

  function onUtterancScroll() {
    var container = document.getElementById('utteranc-container');
    if (container && window.scrollY + window.innerHeight >= container.offsetTop) {
      window.removeEventListener('scroll', onUtterancScroll);
      renderUtteranc();
    }
  }

  function bindUtteranc() {
    if (document.getElementsByTagName("iframe").length === 1) {
      document.getElementsByClassName("utterances")[0].remove();
      window.addEventListener('scroll', onUtterancScroll, {passive: true});
    }
  }

  // 页面内的 DOM 任务（数学公式、图片缩放、访问量、评论）只需在内容稳定后执行一次。
  // 每个组件 created 都会触发调度，这里用防抖合并，全局最多保留一个定时器，
  // 代替原先每个组件各起一个 setTimeout 再用计数器判定的方式。
  let timer = null
  let lastVm = null
  const schedule = vm => {
    lastVm = vm
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (typeof document === 'undefined') return
      try {
        replaceLatexCode();
        if (hasMath()) {
          getMathJax();
        }
        updateZoom();
        reportPageView(lastVm.$route.path);
        bindUtteranc();
      } catch (e) {
        console.error(e.message);
      }
    }, 500)
  }

  Vue.mixin({
    created () {
      schedule(this)
    },
    computed: {
      $blog() {
        return { postList, posts, tags, tagList, pageViews, titleList, tagGList}
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
        const page = pagesByPath[path] || pageByLayout[meta && meta.layout]
        if (!page) return
        const titleName = matchSlug(page.path)
        if (Object.keys(pageViews).length && pageViews.titleViewsMap && titleName in pageViews.titleViewsMap){
          return { ...page, path, titleViews: pageViews.titleViewsMap[titleName]}
        }
        return { ...page, path } // rewrite path
      }
    }
  })

  const format = theme.format
  Vue.filter('date', value => dayjs(value).format(format.date))
  Vue.filter('dateTime', value => dayjs(value).format(format.dateTime))
}

export default { install }
