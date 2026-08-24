// 为每个标签生成一个 /tags/<tag>.html 页面,页面元数据(layout: tags)驱动主题渲染标签文章列表。
// 注意:本文件在 docs/ 下,仓库根 package.json 不是 type:module,
// VitePress 会把它打成 CJS,因此不能 import 'vitepress'(ESM-only)。
// 这里自包含地扫描 md 的 frontmatter tags,标签展开逻辑复用主题的纯函数。
const fs = require('node:fs')
const path = require('node:path')
const { decoderTagName } = require('../../blog-v2/.vitepress/theme/libs/utils.js')

const docsDir = path.resolve(__dirname, '..')

function walk(dir) {
  const out = []
  for (const name of fs.readdirSync(dir)) {
    if (name === '.vuepress' || name === 'node_modules') continue
    const p = path.join(dir, name)
    const stat = fs.statSync(p)
    if (stat.isDirectory()) out.push(...walk(p))
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

// 提取 frontmatter 的 tags(兼容行内 [a, b] 和 REALM.md 的跨行流式数组)
function extractTags(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return []
  const fm = m[1]
  const tagMatch = fm.match(/^tags:(.*)$/m)
  if (!tagMatch) return []
  let rest = tagMatch[1]
  if (!rest.includes('[')) {
    // 跨行数组:继续吞并后续行直到 ']'
    const lines = fm.slice(fm.indexOf(tagMatch[0]) + tagMatch[0].length).split('\n')
    for (const line of lines) {
      rest += '\n' + line
      if (line.includes(']')) break
    }
  }
  rest = rest.trim()
  if (!rest.startsWith('[')) return []
  return rest
    .replace(/^\[/, '')
    .replace(/][\s\S]*$/, '')
    .split(',')
    .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
}

module.exports = {
  async paths() {
    const tags = new Set()
    for (const file of walk(docsDir)) {
      if (file.endsWith(path.join('tags', '[tag].md'))) continue
      const src = fs.readFileSync(file, 'utf-8')
      for (const tagName of extractTags(src)) {
        for (const tt of decoderTagName(tagName)) {
          for (const k of tt) tags.add(k)
        }
      }
    }
    return [...tags].map(tag => ({
      params: { tag },
      content: '---\nlayout: tags\ntitle: Tags\n---\n'
    }))
  }
}
