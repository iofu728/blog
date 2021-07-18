import sortBy from 'lodash/sortBy'
import dayjs from 'dayjs'
import request from '../requests'
import '../styles/global.styl'
import { decoderTagName, decoderTagGraph, matchSlug } from './utils'


let time = 0

const install = (Vue, { theme, pages }) => {
  // 不依赖已有的内置数据，在这里对 siteData 解析，组装博客需要的数据混入Vue
  // Example： { postList: [], posts: {}, tagList: [], tags: { }  }
  const postList = []
  const posts = {}
  const pageViews = {}
  const titleList = []

  request('/api/pv/list?timestamp=' + new Date().getTime(), {headers: {'Content-Type': 'application/json'}})
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
  console.log(tagList);

  Vue.mixin({
    created () {
      time += 1
      this.waitTime(time)
    },
    methods: {
      waitTime(tempTime) {
        setTimeout(() => {if(tempTime === time) {
          try {
            this.replaceLatexCode();
            this.getMathJax();
            window && this.updateZoom();
            this.getPageViews();
            this.bindUtteranc();
          } catch (e) {
            console.error(e.message);
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
        request('/api/pv/update?timestamp=' + new Date().getTime() + '&titleName=' + matchSlug(this.$page.path), {headers: {'Content-Type': 'application/json'}})
          .catch(reason => console.log(reason.message));

      },
      replaceLatexCode(){
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
      },
      getMathJax() {
        const script1 = document.createElement('script');
        script1.src = 'https://wyydsb.xin/files/MathJax-2.7.4/AMS-setcounter.js';
        script1.type = 'text/javascript';
        script1.id = "ams-counter";
        setTimeout(() => document.body.appendChild(script1), 500);
        const script2 = document.createElement('script');
        script2.type = 'text/javascript';
        script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
        script2.id = "tex-ams";
        setTimeout(() => document.body.appendChild(script2), 700);
        setTimeout(() => document.getElementById("ams-counter").remove(), 2000);
        setTimeout(() => document.getElementById("tex-ams").remove(), 2000);
      },
      renderUtteranc() {
        var container = document.getElementById('utteranc-container');
        var script = document.createElement("script");
        script.type = 'text/javascript';
        script.id = "utteranc";
        script.async = true;
        script.setAttribute('issue-term', 'title');
        script.setAttribute('theme', 'github-light')
        script.setAttribute('repo',`iofu728/blog`)
        script.setAttribute('crossorigin',`anonymous`)
        script.src = 'https://utteranc.es/client.js';
        container.appendChild(script);
      },
      onScroll() {
        var container = document.getElementById('utteranc-container');
        if (window.scrollY + window.innerHeight >= container.offsetTop) {
            window.removeEventListener('scroll', this.onScroll);
            this.renderUtteranc();
        }
      },
      bindUtteranc() {
        if (document.getElementsByTagName("iframe").length === 1) {
          document.getElementsByClassName("utterances")[0].remove();
          window.addEventListener('scroll', this.onScroll, {passive: true});
        }
      }
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
