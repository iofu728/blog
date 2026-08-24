<template>
  <div class="menu"
       v-show="!!socials">
    <div class="menu__activator"
         @click.stop="toggle">
      <slot></slot>
    </div>
    <transition name="scale-transition">
      <div class="menu__content"
           :class="{ 'menu__content--active': open }"
           :style="menuStyle"
           v-show="open">
        <div class="list">
          <div class="secondary--text"
               v-for="item in socials"
               :key="item.text">
            <a v-ripple
               :href="item.href"
               target="_brank"
               rel="noopener noreferrer"
               class="list__tile list__tile--link">
              <div class="list__tile__avatar">
                <div class="avatar"
                     style="height:40px;width:40px;"><i class="fab fa-lg"
                       :class="`fa-${item.icon}`"></i></div>
              </div>
              <div class="list__tile__title capitalize">{{$tt(item.text)}}</div>
            </a>
          </div>
          <div class="secondary--text"
               key="copy">
            <a v-ripple
               class="list__tile list__tile--link"
               @click="copyLink">
              <div class="list__tile__avatar">
                <div class="avatar"
                     style="height:40px;width:40px;"><i class="fa fa-lg fa-copy"></i></div>
              </div>
              <div class="list__tile__title">{{$tt('copyLink')}}</div>
            </a>
          </div>
        </div>
        <input type="text"
               :value="url"
               ref="copyEl"
               tabindex="-1"
               aria-hidden="true"
               class="fake-hide">
      </div>
    </transition>
  </div>
</template>
<script>
import defaultSocials from '../libs/socials'

export default {
  props: {
    origin: String
  },
  data() {
    return {
      socials: null,
      url: '',
      open: false,
    }
  },
  computed: {
    menuStyle() {
      // 对齐旧站 v-menu 的实际内联样式(top right 锚点)
      return {
        maxHeight: 'auto',
        minWidth: '0px',
        maxWidth: 'auto',
        top: '12px',
        left: '0px',
        transformOrigin: this.origin || 'top right',
        zIndex: this.open ? 8 : 0,
      }
    },
  },
  methods: {
    toggle() {
      this.open = !this.open
    },
    closeOnOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.open = false
      }
    },
    copyLink() {
      const $el = this.$refs.copyEl
      $el.focus()
      $el.select()
      document.execCommand('copy')
      $el.blur()
    },
    createShare() {
      const customSocials = this.$site.themeConfig.socials
      if (!customSocials) return
      const url = location.origin + location.pathname
      const { title, excerpt: summary } = this.$page
      const origin = location.origin + this.$site.base
      const pic = ''
      this.url = url
      this.socials = customSocials.map(item => {
        const { icon, share } = defaultSocials[item]
        const href = share({ url, title, summary, origin, pic })
        return { text: item, icon, href }
      })
    },
  },
  watch: {
    open(val) {
      if (val) {
        document.addEventListener('click', this.closeOnOutside)
      } else {
        document.removeEventListener('click', this.closeOnOutside)
      }
    },
    '$route.path'() {
      this.createShare()
    },
  },
  mounted() {
    // 旧版在 beforeMount 初始化;移到这里,保证 SSR 与客户端首帧一致(菜单初始隐藏)
    this.createShare()
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeOnOutside)
  },
}
</script>
