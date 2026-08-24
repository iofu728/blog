import { createContentLoader } from 'vitepress'
import { buildBlogData } from '../libs/blogData'
import themeConfig from '../siteConfig'

// 扫描 docs 下全部 md(srcDir 即 ../docs,pattern 相对 srcDir 解析)。
// 只返回元数据(path/title/frontmatter/tags 索引),不带 markdown 原文,避免打进客户端 bundle。
// [tag].md 是标签动态路由模板,不作为文章计入。
export default createContentLoader('**/*.md', {
  transform(raw) {
    return buildBlogData(raw.filter(p => p.url !== '/tags/[tag].html'), themeConfig)
  }
})
