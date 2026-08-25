import { decoderTagName, decoderTagGraph, matchSlug } from './utils'

// 纯函数,语义照抄旧 docs/.vuepress/theme/libs/blog.js 的 install() 数据组装部分。
// 同时被 data/posts.data.js(createContentLoader transform,node 侧)
// 和 docs/tags/[tag].paths.js(动态路由,node 侧)复用。
//
// pages 元素: { path, title, frontmatter, slug, authorFirstName, authorLastName, author }
// frontmatter.date 统一转成字符串,避免 Date 对象在 loader 序列化时出现时区歧义
export function buildBlogData(rawPages, themeConfig) {
  const authorFirstName = (themeConfig.authorFirstName || '').replace(/^\S/, s => s.toUpperCase())
  const authorLastName = (themeConfig.authorLastName || '').replace(/^\S/, s => s.toUpperCase())
  const author = authorFirstName + ' ' + authorLastName

  const pages = rawPages.map(({ url, frontmatter }) => {
    const fm = { ...(frontmatter || {}) }
    // js-yaml 会把 '2024-07-24 5:24:00' 解析成 Date(按 UTC);
    // 统一存 ISO 字符串,dayjs 展示时再按浏览器时区格式化,与旧站一致
    if (fm.date != null) fm.date = fm.date instanceof Date ? fm.date.toISOString() : String(fm.date)
    return {
      path: url,
      // 旧 vuepress 的标题会剥掉行内代码反引号(见 rnn/ppr 等页)
      title: ((frontmatter && frontmatter.title) || '').replace(/`/g, ''),
      frontmatter: fm,
      slug: matchSlug(url),
      authorFirstName,
      authorLastName,
      author,
    }
  })

  // $page 查找索引(按 path / 按 layout 取第一个,语义同旧版)
  const pagesByPath = {}
  const pageByLayout = {}
  pages.forEach(page => {
    pagesByPath[page.path] = page
    const layout = (page.frontmatter && page.frontmatter.layout) || 'post'
    if (!(layout in pageByLayout)) {
      pageByLayout[layout] = page
    }
  })

  const postList = []
  const posts = {}
  const titleList = []

  // 按日期倒序(与原 sortBy(pages, page => -new Date(date)) 等价;
  // 无 date 的页面比较结果为 NaN,视作 0,依赖 V8 稳定排序保持原位,与旧版一致)
  pages.slice()
    .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
    .forEach(page => {
      postList.push(page.slug)
      posts[page.slug] = page
      titleList.push(page.title)
    })

  const tags = {}
  const tagG = {}
  const tagGList = {}
  postList.forEach(slug => {
    const list = posts[slug].frontmatter ? posts[slug].frontmatter.tags || [] : []
    const tmpTagG = {}
    const addTag = new Set()
    list.forEach(tagName => {
      const t = decoderTagName(tagName)
      t.forEach(tt => {
        tt.forEach(k => {
          if (!tags[k]) {
            tags[k] = []
          }
          if (!addTag.has(k)) {
            tags[k] = tags[k].concat(slug)
            addTag.add(k)
          }
          if (!tagG[k]) {
            tagG[k] = new Set()
          }
          if (!tmpTagG[k]) {
            tmpTagG[k] = new Set()
          }
        })
        var l0 = tt[0], l1 = tt[1], l2 = tt[2]
        if (!!l1) {
          tagG[l0].add(l1)
          tmpTagG[l0].add(l1)
        }
        if (!!l2) {
          tagG[l1].add(l2)
          tmpTagG[l1].add(l2)
        }
      })
    })
    tagGList[slug] = decoderTagGraph(tmpTagG)
  })
  const tagList = decoderTagGraph(tagG)

  // Set 无法被 loader 序列化,且后续只读,转成普通数组
  const tagsOut = {}
  Object.keys(tags).forEach(k => { tagsOut[k] = tags[k] })

  return { pages, pagesByPath, pageByLayout, postList, posts, titleList, tags: tagsOut, tagList, tagGList }
}
