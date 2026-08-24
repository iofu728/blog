<template>
  <!-- 404:与旧站一致,不套侧边栏/工具栏等外壳,直接渲染 NotFound 内容 -->
  <Content v-if="isNotFound" />
  <div v-else
       data-app="true"
       id="app"
       class="application theme--light">
    <div class="application--wrap">
      <div class="progress-linear blog-progress"
           style="height:3px;"
           v-show="progressRunning">
        <div class="progress-linear__background error"
             style="height:3px;opacity:0.4;width:100%;"></div>
        <div class="progress-linear__bar">
          <div v-if="progressRunning"
               class="progress-linear__bar__indeterminate progress-linear__bar__indeterminate--active error">
            <div class="progress-linear__bar__indeterminate long"></div>
            <div class="progress-linear__bar__indeterminate short"></div>
          </div>
          <div class="progress-linear__bar__determinate error"
               style="width:0%;"></div>
        </div>
      </div>
      <aside class="navigation-drawer navigation-drawer--fixed"
             :class="drawerClass"
             :style="drawerStyle"
             :data-booted="booted ? 'true' : null">
        <SideNav :miniNav="miniNav"></SideNav>
        <div class="navigation-drawer__border"></div>
      </aside>
      <div v-if="showOverlay"
           class="overlay overlay--active"
           @click="navVisible = false"></div>
      <Header :layout="layout"
              :paddingLeft="leftPadding"
              :hidden="toolbarHidden"
              @toggleNav="toggleNav"></Header>
      <main class="content"
            :style="contentStyle">
        <div class="content--wrap">
          <component :is="layoutComponent"></component>
          <Footer></Footer>
        </div>
      </main>
      <transition name="scale-transition">
        <button type="button"
                class="btn btn--bottom btn--floating btn--fixed btn--right error"
                v-show="offsetTop > 300"
                @click="goTop">
          <div class="btn__content"><i class="fa fa-lg fa-chevron-up"></i></div>
        </button>
      </transition>
    </div>
  </div>
</template>
<script>
import { ref, computed } from 'vue'
import { useRouter, useData, Content } from 'vitepress'
import SideNav from './SideNav.vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
import Home from './Home.vue'
import Tags from './Tags.vue'
import Post from './Post.vue'

export default {
  name: 'layout',
  components: {
    SideNav,
    Header,
    Footer,
    Home,
    Tags,
    Post,
    Content,
  },
  setup() {
    // 路由切换时的顶部进度条(旧版依赖 vue-router 钩子,VitePress 用 router 回调)
    const router = useRouter()
    const { page } = useData()
    const progressRunning = ref(false)
    // SSR 渲染时 router 是只有 route 的桩对象
    if (router.onBeforeRouteChange) {
      router.onBeforeRouteChange(() => { progressRunning.value = true })
      router.onAfterRouteChanged(() => { progressRunning.value = false })
    }
    return { progressRunning, isNotFound: computed(() => !!page.value.isNotFound) }
  },
  data() {
    // 初始值按 SSR(移动端、抽屉关闭)渲染,与旧站 SSR 产物一致;
    // mounted 后再按真实视口修正,避免水合不匹配
    return {
      navVisible: false,
      miniNav: false,
      isMobile: true,
      booted: false,
      mobilePoint: 1264,
      offsetTop: 0,
      lastScrollTop: 0,
      toolbarHidden: false,
    }
  },
  computed: {
    layout() {
      return this.$page.frontmatter && this.$page.frontmatter.layout || 'post'
    },
    layoutComponent() {
      return { home: Home, tags: Tags, post: Post }[this.layout] || Post
    },
    drawerWidth() {
      return !this.isMobile && this.miniNav ? 80 : 240
    },
    drawerMarginTop() {
      // 旧站 drawer 全高(top:0),z-index 高于 toolbar——左上角是侧栏背景而非工具栏底色
      return 0
    },
    leftPadding() {
      return !this.isMobile && this.navVisible ? this.drawerWidth : 0
    },
    drawerClass() {
      return {
        'navigation-drawer--is-mobile': this.isMobile,
        'navigation-drawer--close': !this.navVisible,
        'navigation-drawer--open': this.navVisible,
        'navigation-drawer--mini-variant': !this.isMobile && this.miniNav,
      }
    },
    drawerStyle() {
      return {
        height: '100%',
        marginTop: this.drawerMarginTop + 'px',
        maxHeight: `calc(100% - ${this.drawerMarginTop}px)`,
        transform: `translateX(${this.navVisible ? 0 : -this.drawerWidth}px)`,
        width: this.drawerWidth + 'px',
      }
    },
    contentStyle() {
      return {
        paddingTop: '56px',
        paddingRight: '0px',
        paddingBottom: '0px',
        paddingLeft: this.leftPadding + 'px',
      }
    },
    showOverlay() {
      return this.isMobile && this.navVisible
    },
  },
  methods: {
    toggleNav() {
      if (window.innerWidth > this.mobilePoint) {
        this.miniNav = !this.miniNav
      } else {
        this.navVisible = !this.navVisible
        this.miniNav = false
      }
    },
    onScroll() {
      const top = window.pageYOffset || document.documentElement.scrollTop
      // v-toolbar scroll-off-screen: 向下滚过阈值隐藏,向上滚出现
      if (top > 100 && top > this.lastScrollTop) {
        this.toolbarHidden = true
      } else if (top < this.lastScrollTop) {
        this.toolbarHidden = false
      }
      this.lastScrollTop = top
      this.offsetTop = top
    },
    onResize() {
      const mobile = window.innerWidth <= this.mobilePoint
      if (mobile !== this.isMobile) {
        this.isMobile = mobile
        this.navVisible = !mobile
        if (!mobile) this.miniNav = false
      }
    },
    goTop() {
      // 旧版 $vuetify.goTo(0)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  },
  mounted() {
    this.isMobile = window.innerWidth <= this.mobilePoint
    this.navVisible = window.innerWidth > this.mobilePoint
    this.booted = true
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
  },
}
</script>
