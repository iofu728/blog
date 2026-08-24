<template>
  <a :href="to"
     :class="isActive ? 'tag-active' : null">
    <span tabindex="0"
          v-ripple
          class="capitalize chip-tag chip chip--label chip--small"
          :class="'label-' + level.toString()">
      <span class="chip__content">
        <slot>{{slug}}</slot>
      </span>
    </span>
  </a>
</template>
<script>
export default {
  props: {
    slug: String,
    tag: String,
    level: Number,
  },
  computed: {
    to() {
      const tags = this.$site.themeConfig.tags
      // 旧站是 SPA 路由 /tags/<name>;VitePress 静态产物需要 .html 后缀
      return tags && tags.path ? tags.path.replace(':tagName', this.slug) + '.html' : ''
    },
    isActive() {
      return this.$route.path === this.to
    }
  }
}
</script>
<style lang="stylus">
@import '../styles/config.styl';

.tag-active {
  .chip {

  }
}

.chip-tag {
  &.chip {
    .chip__content {
      cursor: inherit;
      font-family: $font-code;
    }
  }
}

.label-1{
  background: #e0e0e0 !important;
}

.label-2{
  color: #fff !important;
  background: #6c8b9c !important;
}

.label-3{
  color: #fff !important;
  background: #a28989 !important;
}
</style>
