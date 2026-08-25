import { defineConfig } from 'vitepress'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import themeConfig from './theme/siteConfig'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// 语雀导出的图片语法: ![描述 | center | 556x500](url)
// markdown-it 不识别竖线指令;作者指定的宽度体现了"图内字体与正文相当"的校准,予以保留,
// 同时加 max-width 防止窄屏溢出,并给正文图片加懒加载
const YUQUE_IMG = /^(.*?)\s*\|\s*(center|left|right)\s*\|\s*(\d+)x(\d+)\s*$/

function yuqueImagePlugin(md) {
  md.core.ruler.push('yuque_image', state => {
    state.tokens.forEach(token => {
      // 正文里的原生 <img> 标签(如 <center><img width="400">):保留作者的 width,只加懒加载;
      // 同时统一自闭合——markdown 会被编成 Vue 模板,未闭合的 <img> 会被 Vue 编译器丢弃
      if ((token.type === 'html_block' || token.type === 'html_inline') && token.content.includes('<img')) {
        token.content = token.content
          .replace(/<img (?![^>]*\bloading=)/g, '<img loading="lazy" ')
          .replace(/<img ([^>]*?)\s*\/?>/g, '<img $1 />')
        return
      }
      if (token.type !== 'inline' || !token.children) return
      token.children.forEach(child => {
        if (child.type !== 'image') return
        child.attrSet('loading', 'lazy')
        const m = child.content.match(YUQUE_IMG)
        if (!m) return
        const [, alt, align, width] = m
        const styles = [`width:${width}px`, 'max-width:100%']
        if (align === 'center') {
          styles.push('display:block', 'margin-left:auto', 'margin-right:auto')
        } else if (align === 'right') {
          styles.push('display:block', 'margin-left:auto')
        }
        child.attrSet('style', styles.join(';'))
        // alt 里只保留真实描述,去掉竖线指令
        const text = new state.Token('text', '', 0)
        text.content = alt.trim()
        child.children = [text]
      })
    })
  })
}

// 旧站(vuepress 0.12 + prism)的代码块保留 fence 源码收尾的空行,渲染出一个尾部空行;
// VitePress(shiki)会把它 trim 掉,导致这类代码块少一行(25.6px)。
// 注意:1) 仅当源码 fence 收尾确有空行时才补(普通代码块两边一致);
//      2) 直接插 '\n' 无效——块级末尾的换行会被 CSS 折叠,必须跟一个 line span。
// 另外:旧站 .comment 容器的 `padding:0 1rem`(1rem=14px)意外泄漏到 prism 的
// .token.comment,代码注释整体右移 14px;shiki 的注释 span 没有 class,
// 这里按 one-dark-pro 注释的特征色(#7F848E+italic)补上 class,由 CSS 还原该偏移。
// 注意 prism 把整个 /* ... */ 块注释作为一个 span(首尾各一次 padding),
// 而 shiki 按行拆分,所以块注释只有首行加左 padding、末行加右 padding、中间行不加。
// 另外 shiki 的 bash 系语法不把 `#` 注释 scope 成 comment(渲染成正文色 #ABB2BF),
// 而 prism(bash)会标成 .token.comment;对 bash 系按 `#` 前缀 + 正文色兜底补 class。
// (prism 的 vim 语法同样不把 # 当注释——旧产物里 vim 块的 # 行是纯文本,不能补)
const HASH_COMMENT_LANGS = new Set(['bash', 'sh', 'shell', 'zsh'])
// #7F848E+italic 是 one-dark-pro 的注释特征,对 c 系/js/python/bash 可靠;
// shiki 的 vim 语法会把 nginx 配置、JSON 字符串行误标成该色,而 prism-vim 没有注释 token
const STYLE_COMMENT_LANGS = new Set(['c', 'cpp', 'java', 'javascript', 'js', 'jsx', 'ts', 'typescript', 'python', 'py', 'bash', 'sh', 'shell', 'zsh'])

function trailingNewlinePlugin(md) {
  const origFence = md.renderer.rules.fence
  md.renderer.rules.fence = (tokens, idx, ...rest) => {
    let html = origFence(tokens, idx, ...rest)
    const lang = (tokens[idx].info || '').trim().split(/\s+/)[0].toLowerCase()
    let inBlockComment = false
    if (STYLE_COMMENT_LANGS.has(lang)) {
      html = html.replace(
        /<span style="(--shiki-light:#7F848E;--shiki-light-font-style:italic[^"]*)">([^<]*)<\/span>/g,
        (m, style, text) => {
          let cls = ''
          if (inBlockComment) {
            if (text.includes('*/')) { cls = 'old-comment-r'; inBlockComment = false }
          } else if (text.includes('/*') && !text.includes('*/')) {
            cls = 'old-comment-l'; inBlockComment = true
          } else {
            cls = 'old-comment'
          }
          return cls ? `<span class="${cls}" style="${style}">${text}</span>` : m
        },
      )
    }
    if (HASH_COMMENT_LANGS.has(lang)) {
      html = html.replace(
        /<span style="(--shiki-light:#ABB2BF;--shiki-dark:#ABB2BF;?)">(\s*#[^<]*)<\/span>/g,
        '<span class="old-comment" style="$1">$2</span>',
      )
    }
    const trailing = (tokens[idx].content.match(/\n+$/) || [''])[0].length - 1
    return trailing > 0 && html.includes('</code></pre>')
      ? html.replace('</code></pre>', '\n<span class="line"> </span>'.repeat(trailing) + '</code></pre>')
      : html
  }
}

// 旧站(vuepress 0.12)会给正文里的每个外链自动追加 OutboundLink 箭头图标(inline svg);
// VitePress 没有此行为,缺失的 15px 图标会改变移动端折行点。按旧产物的原始标记补回
const OUTBOUND_SVG = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg>'

function outboundLinkPlugin(md) {
  md.core.ruler.push('outbound_link', state => {
    for (const token of state.tokens) {
      if (token.type !== 'inline' || !token.children) continue
      const children = token.children
      for (let i = 0; i < children.length; i++) {
        if (children[i].type !== 'link_open') continue
        const href = children[i].attrGet('href') || ''
        if (!/^https?:\/\//.test(href)) continue
        let level = 1, j = i + 1
        for (; j < children.length; j++) {
          if (children[j].type === 'link_open') level++
          else if (children[j].type === 'link_close' && --level === 0) break
        }
        if (j >= children.length) continue
        const svg = new state.Token('html_inline', '', 0)
        svg.content = OUTBOUND_SVG
        children.splice(j, 0, svg)
        i = j
      }
    }
  })
}

// 旧站的 [[toc]] 渲染成 <div class="table-of-contents">…</div> 后还残留一个空 <p></p>,
// 其 margin 折叠后给目录下方多出 ~2.5px;VitePress 渲染的 <nav> 没有这个空 p。
// 在 nav 后补回空 <p></p>,精确复现旧站的折叠间距(涉及 cs/terminal/anoj2018II/entrance 4 页)
function tocCompatPlugin(md) {
  const orig = md.renderer.rules.toc_close
    || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))
  md.renderer.rules.toc_close = (...args) => orig(...args) + '<p></p>'
}

// 旧站(vuepress 0.12)的标题锚点 <a class="header-anchor"> 在标题文字之前,
// 后随一个空格(仅当标题以普通文本开头;以 `code` 等开头时无空格),
// inline 占据行宽(长标题在移动端的折行点受此影响);VitePress 把锚点放在文字之后,
// 之前的 float 方案不改变行宽,折行点不同。把锚点 token 移到最前并按旧规则补空格
function anchorCompatPlugin(md) {
  md.core.ruler.push('anchor_compat', state => {
    for (let i = 0; i < state.tokens.length; i++) {
      const t = state.tokens[i]
      if (t.type !== 'inline' || !t.children) continue
      if (!state.tokens[i - 1] || state.tokens[i - 1].type !== 'heading_open') continue
      const children = t.children
      const ai = children.findIndex(c => c.type === 'link_open' && (c.attrGet('class') || '').includes('header-anchor'))
      if (ai < 0) continue
      let level = 1, j = ai + 1
      for (; j < children.length; j++) {
        if (children[j].type === 'link_open') level++
        else if (children[j].type === 'link_close' && --level === 0) break
      }
      if (j >= children.length) continue
      const anchorTokens = children.splice(ai, j - ai + 1)
      const inserts = [...anchorTokens]
      if (children[0] && children[0].type === 'text') {
        const space = new state.Token('text', '', 0)
        space.content = ' '
        inserts.push(space)
      }
      children.unshift(...inserts)
    }
  })
}

// (已放弃)jsdecoder.md 的 `> <center><img>` 在旧站经 Vue2 hydration 保留在 <p> 内;
// Vue3/浏览器 HTML 解析都会用 <center> 关闭 <p>,markdown 层无法对齐,且改了会更糟,按已知差异处理

export default defineConfig({
  // 文章源文件复用仓库现有 docs/,产物 URL 与现网一致(/NLP/xxx.html)
  srcDir: '../docs',
  srcExclude: ['.vuepress/**'],
  cleanUrls: false,
  base: '/',
  lang: 'en-US',
  title: '乌云压顶是吧',
  description: '🍥',
  // 旧内容里存在历史死链,构建不因此失败
  ignoreDeadLinks: true,
  sitemap: { hostname: 'https://wyydsb.xin' },
  // 旧站标题格式:{pageTitle} · 乌云压顶是吧
  titleTemplate: ':title · 乌云压顶是吧',
  // 首页 frontmatter.title 与站点标题相同,旧站首页标题不拼后缀;
  // 旧站 <title> 会剥掉行内代码反引号
  transformPageData(pageData) {
    if (pageData.title) {
      pageData.title = pageData.title.replace(/`/g, '')
      if (pageData.title === '乌云压顶是吧') {
        pageData.titleTemplate = false
      }
    }
  },
  themeConfig,
  head: [
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#07527a' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: '/icons/192.png' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/192.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#07527a' }],
    ['meta', { name: 'referrer', content: 'no-referrer' }],
    // 第三方域名提前解析 DNS(数学公式、统计)
    ['link', { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' }],
    ['link', { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' }],
    ['script', { type: 'text/x-mathjax-config' },
      `MathJax.Hub.Config({
          tex2jax: {inlineMath: [['$','$'], ['\\\\(','\\\\)']]},
          processEnvironments: true,
          TeX: {equationNumbers: {autoNumber: ["AMS"], useLabelIds: true}, extensions: ["AMSmath.js", "AMSsymbols.js", "extpfeil.js"]},
          "HTML-CSS": {linebreaks: {automatic: true, width: "95% container"}, noReflows: false, styles: {".MathJax_Display": {margin: "1em 0em 0.7em;", display: "inline-block!important;"}}},
          "PreviewHTML": {linebreaks: {automatic: true, width: "95% container"}, noReflows: false, styles: {".MathJax_PHTML_Display": {margin: "1em 0em 0.7em;", display: "inline-block!important;"}}},
          "CommonHTML": {linebreaks: {automatic: true, width: "95% container"}, noReflows: false, styles: {".MJXc-display": {margin: "1em 0em 0.7em;", display: "inline-block!important;"}}},
          "SVG": {linebreaks: {automatic: true, width: "95% container"}, noReflows: false, styles: {".MathJax_SVG_Display": {margin: "1em 0em 0.7em;", display: "inline-block!important;"}}}
      });`],
    ['script', {}, `
      (function() {
        var meta = document.createElement("meta");
        meta.name = "google-site-verification";
        meta.content = "7ULbF13p7e6Z16vpi2tbAPHXHJBVu83TaxPTnvwnA8I";
        setTimeout(() => document.body && document.body.appendChild(meta))})(); `],
    ['script', {}, `
      (function() {
        var script = document.createElement("script");
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=UA-113936890-1";
        setTimeout(() => document.body && document.body.appendChild(script), 2000)})(); `],
    ['script', {}, `
      (function() {
        var script = document.createElement("script");
        script.text = 'window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag("js", new Date());gtag("config", "UA-113936890-1");';
        setTimeout(() => document.body && document.body.appendChild(script), 2100)})(); `],
  ],
  markdown: {
    lineNumbers: true,
    // 旧站(vuepress 0.12 默认 markdown-it)不做裸 URL 自动链接;
    // 且语雀导出的部分 URL 含零宽空格,linkify 会把它 punycode 成 xn-- 坏链
    linkify: false,
    // 替代旧站的 prism-tomorrow,亮暗统一 one-dark-pro
    theme: { light: 'one-dark-pro', dark: 'one-dark-pro' },
    config: md => { yuqueImagePlugin(md); trailingNewlinePlugin(md); outboundLinkPlugin(md); tocCompatPlugin(md); anchorCompatPlugin(md) },
  },
  vue: {
    template: {
      compilerOptions: {
        // 旧文章里的 <center>/<font> 不在 Vue 的内置 HTML 标签表里,不声明会被当组件解析:
        // SSR 渲染成注释、客户端渲染成原生元素,既丢内容又造成水合不一致
        isCustomElement: tag => tag === 'center' || tag === 'font',
      },
    },
  },
  vite: {
    // VitePress 默认 publicDir 是 srcDir/public(即 docs/public),指回 blog-v2/public
    publicDir: path.resolve(dirname, '../public'),
    resolve: {
      // 文章在仓库根 docs/ 下,裸引 vue 会解析到根 node_modules 的 Vue 2,强制指向本项目的 Vue 3
      alias: [
        { find: 'vue/server-renderer', replacement: path.resolve(dirname, '../node_modules/vue/server-renderer/index.mjs') },
        { find: /^vue$/, replacement: path.resolve(dirname, '../node_modules/vue/dist/vue.runtime.esm-bundler.js') },
      ],
    },
  },
})
