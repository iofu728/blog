<template>
  <router-link :to="to"
               :tag="tag"
               exact
               exact-active-class="tag-active">
    <v-chip label
            small
            v-ripple
            class="capitalize chip-tag"
            :class="'label-'+ level.toString()">
      <slot>{{slug}}</slot>
    </v-chip>
  </router-link>
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
      return tags && tags.path ? tags.path.replace(':tagName', this.slug) : ''
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


