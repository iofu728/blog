<script>
import { h } from 'vue'
import { useRoute } from 'vitepress'
import { isActive, hashRE, groupHeaders } from './util'

// Vue 3 没有 functional: true,改为 setup 返回渲染函数
export default {
  props: ['item'],

  setup(props) {
    const route = useRoute()
    return () => {
      const item = props.item
      const routeLike = { path: route.path, hash: '' }
      // use custom active class matching logic
      // due to edge case of paths ending with / + hash
      const selfActive = isActive(routeLike, item.path)
      // for sidebar: auto pages, a hash link should be active if one of its child
      // matches
      const active = item.type === 'auto'
        ? selfActive || item.children.some(c => isActive(routeLike, item.basePath + '#' + c.slug))
        : selfActive
      const link = renderLink(item.path, item.title || item.path, active)
      if (item.type === 'auto') {
        return [link, renderChildren(item.children, item.basePath, routeLike, 1)]
      } else if (active && item.headers && !hashRE.test(item.path)) {
        const children = groupHeaders(item.headers)
        return [link, renderChildren(children, item.path, routeLike, 1)]
      } else if (active) {
        // 旧版此处会渲染一个空的 sub-headers 容器(headers 数据在迁移后不再提供)
        return [link, h('ul', { class: 'sidebar-sub-headers' })]
      } else {
        return link
      }
    }
  }
}

function renderLink(to, text, active) {
  return h('a', {
    href: to,
    class: {
      active,
      'sidebar-link': true
    }
  }, text)
}

function renderChildren(children, path, route, maxDepth, depth = 1) {
  if (!children || depth > maxDepth) return null
  return h('ul', { class: 'sidebar-sub-headers' }, children.map(c => {
    const active = isActive(route, path + '#' + c.slug)
    return h('li', { class: 'sidebar-sub-header' }, [
      renderLink(path + '#' + c.slug, c.title, active),
      renderChildren(c.children, path, route, maxDepth, depth + 1)
    ])
  }))
}
</script>

<style lang="stylus">
@import './styles/config.styl'

.sidebar .sidebar-sub-headers
  padding-left 1rem
  font-size 0.95em

a.sidebar-link
  font-weight 400
  display inline-block
  color $primary-color
  border-left 0.25rem solid transparent
  padding 0.35rem 1rem 0.35rem 2.25rem
  line-height 1.4
  width: 100%
  box-sizing: border-box
  &:hover
    color #DC143C
  &.active
    font-weight 600
    color #DC143C
    border-left-color #DC143C
  .sidebar-group &
    padding-left 2rem
  .sidebar-sub-headers &
    padding-top 0.25rem
    padding-bottom 0.25rem
    padding-left 3.25rem
    border-left none
    &.active
      font-weight 500
</style>
