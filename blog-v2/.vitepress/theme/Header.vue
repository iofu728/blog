<template>
  <nav class="blog-toolbar toolbar toolbar--fixed theme--dark primary"
       :style="toolbarStyle">
    <div class="toolbar__content"
         style="height:56px;">
      <button type="button"
              class="btn btn--icon"
              @click="toggleNav">
        <div class="btn__content"><i class="fa fa-bars"></i></div>
      </button>
      <div class="toolbar__title">{{$page.title === 'Home' ? $siteTitle : $page.title || $siteTitle}}</div>
      <div class="spacer"></div>
      <span class="links"></span>
      <Share origin="top right">
        <button type="button"
                class="btn btn--icon">
          <div class="btn__content"><i class="fa fa-share-alt"></i></div>
        </button>
      </Share>
    </div>
  </nav>
</template>
<script>
import Share from './components/Share.vue'

export default {
  components: {
    Share,
  },
  props: {
    layout: String,
    paddingLeft: {
      type: Number,
      default: 0,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    toolbarStyle() {
      return {
        marginTop: '0px',
        paddingRight: '0px',
        paddingLeft: this.paddingLeft + 'px',
        transform: `translateY(${this.hidden ? -56 : 0}px)`,
      }
    },
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
    margin: 0;
  }
}

.links
  display inline-block
  position relative
  margin-right 0.5rem
</style>
