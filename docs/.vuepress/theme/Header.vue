<template>
  <v-toolbar app
             dark
             scroll-off-screen
             color="primary"
             :height="56"
             :scroll-threshold="100"
             class="blog-toolbar">
    <v-btn icon
           @click="toggleNav">
      <i class="fa fa-bars"></i>
    </v-btn>
    <v-toolbar-title>{{$page.title === 'Home' ? $siteTitle : $page.title || $siteTitle}}</v-toolbar-title>
    <v-spacer></v-spacer>
    <!--<v-btn icon @click="clickSearch">-->
      <!--<i class="fa fa-search"></i>-->
    <!--</v-btn>-->
    <span class="links">
      <AlgoliaSearchBox v-if="isAlgoliaSearch" :options="algolia"/>
    </span>
    <Share origin="top right">
      <v-btn icon>
        <i class="fa fa-share-alt"></i>
      </v-btn>
    </Share>
  </v-toolbar>
</template>
<script>
import Share from './components/Share'
import AlgoliaSearchBox from './AlgoliaSearchBox'

export default {
  components: {
    Share,
    AlgoliaSearchBox,
  },
  data() {
    return {
      searchStatus: null,
    }
  },
  computed: {
    algolia () {
      return this.$themeLocaleConfig.algolia || this.$site.themeConfig.algolia || {}
    },
    isAlgoliaSearch () {
      return this.algolia && this.algolia.apiKey && this.algolia.indexName
    },
  },
  props: {
    layout: String
  },
  methods: {
    toggleNav() {
      this.$emit('toggleNav')
    },
  }
}
</script>
<style lang="stylus">
@import './styles/config.styl';

.blog-toolbar {
  .toolbar__title {
    font-size: 18px;
  }
}

.links
  display inline-block
  position relative
  margin-right 0.5rem

</style>
