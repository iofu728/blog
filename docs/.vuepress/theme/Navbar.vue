<template>
  <header class="navbar">
    <router-link :to="$localePath" class="home-link">
      <img class="logo" :src="$withBase(logo)" alt="Logo">
      <span class="site-name">{{data}}</span>
    </router-link>

    <div class="links">
      <NavLinks class="can-hide"/>
      <AlgoliaSearchBox v-if="isAlgoliaSearch" :options="algolia"/>
      <SearchBox v-else-if="$site.themeConfig.search !== false"/>
    </div>
    <SidebarButton @toggle-sidebar="$emit('toggle-sidebar')"/>
  </header>
</template>

<script>
import SidebarButton from './SidebarButton.vue'
import AlgoliaSearchBox from '@AlgoliaSearchBox'
import SearchBox from './SearchBox.vue'
import NavLinks from './NavLinks.vue'

export default {
  components: { SidebarButton, NavLinks, SearchBox, AlgoliaSearchBox },
  computed: {
    data () {
      return this.$site.title
    },
    algolia () {
      return this.$themeLocaleConfig.algolia || this.$site.themeConfig.algolia || {}
    },
    isAlgoliaSearch () {
      return this.algolia && this.algolia.apiKey && this.algolia.indexName
    },
    logo () {
      return require('./../public/logo.png')
    }
  }
}
</script>

<style lang="stylus">
@import './styles/config.styl'

.navbar
  padding 9px 3.5rem
  line-height $navbarHeight - 1.4rem
  position relative
  box-shadow: 1px 0 3px #d6d6d6;
  a, span, img
    display inline-block
  .site-name
    color: #000
    margin 0 0 0 50px
    font-size 21px
    top 3px
    position absolute
  .logo
    height $navbarHeight - 16px
    min-width $navbarHeight - 16px
    margin-right 0
    vertical-align top
  .links
    font-size 0.9rem
    position absolute
    right 3.5rem
    top 2px

@media (max-width: $MQMobile)
  .navbar
    padding 0.9rem 1.5rem
    .links
      right 3.5rem
    .logo
      height 2rem
      min-width 2rem
    
    .can-hide
      display none
</style>
