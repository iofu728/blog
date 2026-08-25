<template>
  <div class="container blog-container py-5 grid-list-xl align-center">
    <div class="layout row wrap">
      <Tag v-for="item in $blog.tagList"
           :key="item[0]"
           :level="item[1]"
           :slug="item[0]">#{{item[0]}} {{$blog.tags[item[0]].length}}</Tag>
    </div>
    <ul class="reset elevation-1 mt-4 list"
        v-if="pageList">
      <template v-for="(slug, index) in pageList"
                :key="slug">
        <a v-ripple
           :href="$blog.posts[slug].path"
           class="list__tile list__tile--link">
          <div class="list__tile__sub-title list-inline-time">
            <PostTime v-if="$blog.posts[slug].frontmatter"
                      :date="$blog.posts[slug].frontmatter.date"></PostTime>
          </div>
          <div class="list__tile__title primary--text">{{ $blog.posts[slug].title }}</div>
        </a>
        <hr class="divider"
            v-if="index + 1 < pageList.length">
      </template>
    </ul>
  </div>
</template>
<script>
import { useData } from 'vitepress'
import Tag from './components/Tag.vue'
import PostTime from './components/PostTime.vue'
import { matchSlug } from './libs/utils'

export default {
  components: {
    Tag,
    PostTime
  },
  setup() {
    const { params } = useData()
    return { params }
  },
  computed: {
    tagName() {
      // 动态路由 /tags/<tag>.html 带 params.tag;/tags/ 索引页没有,退化为 undefined
      return (this.params && this.params.tag) || matchSlug(this.$route.path)
    },
    pageList() {
      return this.$blog.tags[this.tagName]
    }
  }
}
</script>
<style lang="stylus">
.list-inline-time {
  min-width: 120px;
  width: 220px !important;
}
</style>
