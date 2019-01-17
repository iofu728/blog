<template>
  <v-app v-scroll="onScroll">
    <v-progress-linear :height="3"
                       color="error"
                       :indeterminate="progressRunning"
                       :background-opacity="0.4"
                       class="blog-progress"
                       v-show="progressRunning"></v-progress-linear>
    <v-navigation-drawer app
                         :mobile-break-point="mobilePoint"
                         :mini-variant.sync="miniNav"
                         :width="240"
                         v-model="navVisible">
      <SideNav :miniNav="miniNav"></SideNav>
    </v-navigation-drawer>
    <Header :layout="layout"
            @toggleNav="toggleNav"></Header>
    <v-content>
      <component :is="layout"></component>
      <Footer></Footer>
    </v-content>
    <transition name="scale-transition">
      <v-btn fab
             fixed
             right
             bottom
             color="error"
             @click="$vuetify.goTo(0)"
             v-show="offsetTop > 300">
        <i class="fa fa-lg fa-chevron-up"></i>
      </v-btn>
    </transition>
  </v-app>
</template>
<script>
import Vue from 'vue'
import SideNav from './SideNav'
import Header from './Header'
import Footer from './Footer'
import Home from './Home'
import Tags from './Tags'
import Post from './Post'
import { pathToComponentName, updateMetaTags } from './libs/utils'
import mediumZoom from 'medium-zoom'
import './styles/global.styl'

export default {
  name: 'layout',
  components: {
    SideNav,
    Header,
    Footer,
    Home,
    Tags,
    Post,
  },
  data() {
    const mobilePoint = 1264
    return {
      navVisible: true,
      miniNav: false,
      mobilePoint: 1264,
      offsetTop: 0,
      progressRunning: false
    }
  },
  computed: {
    layout() {
      return this.$page.frontmatter && this.$page.frontmatter.layout || 'post'
    }
  },
  methods: {
    createTitle() {
      const title = `${this.$siteTitle}`
      const pageTitle = this.$page.title
      const subTitle = this.$site.themeConfig.subTitle.replace(/^\s+|\s+$/g,"")
      return (pageTitle && pageTitle !== 'Home' ? `${pageTitle} · ` : '') + title + `${subTitle ? `· ${subTitle}` : ''}`
    },
    toggleNav() {
      if (window.innerWidth > this.mobilePoint) {
        this.miniNav = !this.miniNav
      } else {
        this.navVisible = !this.navVisible
        this.miniNav = false
      }
    },
    onScroll(e) {
      this.offsetTop = window.pageYOffset || document.documentElement.scrollTop
    },
    updateZoom () {
      mediumZoom(document.querySelectorAll('.content img'))
    },
  },
  created() {
    if (this.$ssrContext) {
      this.$ssrContext.title = this.createTitle()
      this.$ssrContext.lang = this.$lang
      this.$ssrContext.description = this.$page.description || this.$description
    } else {
      this.navVisible = window.innerWidth > this.mobilePoint
    }
  },
  mounted() {
    this.updateZoom()
    // update title / meta tags
    this.currentMetaTags = new Set()
    const updateMeta = () => {
      document.title = this.createTitle()
      document.documentElement.lang = this.$lang
      const meta = [
        {
          name: 'description',
          content: this.$description
        },
        ...(this.$page.frontmatter ? this.$page.frontmatter.meta || [] : [])
      ]
      this.currentMetaTags = new Set(updateMetaTags(meta, this.currentMetaTags))
    }
    this.$watch('$page', updateMeta)
    updateMeta()

    this.$router.beforeEach((to, from, next) => {
      if (to.path !== from.path && !Vue.component(pathToComponentName(to.path))) {
        this.progressRunning = true
      }
      next()
    })

    this.$router.afterEach(() => {
      this.progressRunning = false
    })
  },
  beforeDestroy() {
    updateMetaTags(null, this.currentMetaTags)
  },
}
</script>
<style src="@fortawesome/fontawesome-free-webfonts/css/fa-solid.css"></style>
<style src="@fortawesome/fontawesome-free-webfonts/css/fa-regular.css"></style>
<style src="@fortawesome/fontawesome-free-webfonts/css/fa-brands.css"></style>
<style src="@fortawesome/fontawesome-free-webfonts/css/fontawesome.css"></style>
<style src="prismjs/themes/prism-tomorrow.css"></style>
