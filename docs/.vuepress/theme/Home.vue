<template>
  <div class="home">
    <div class="home_main">
      <div class="home-wrap">
        <div class="hero">
          <img v-if="data.heroImage" :src="$withBase(data.heroImage)" alt="hero">
          <p class="description">
            {{ data.tagline || $description || ' ' }}
          </p>
          <h1 class="title-h1">{{ data.heroText || $title || ' ' }}</h1>
          <p class="action" v-if="data.actionText && data.actionLink">
            <NavLink class="action-button" :item="actionLink"/>
          </p>
          <p class="description-text">{{data.descriptionText}}</p>
        </div>
      </div>
    </div>
    <div class="home_about">
      <div class="home-wrap">
        <Content custom/>
        <div class="pv">{{pv}}</div>
        <div class="footer">{{data.footer}}</div>
      </div>
    </div>
    <div class="home_features">
      <div class="home-wrap">
        <div class="features">
          <div class="feature">
          </div>
        </div>
      </div>
    </div>
    <div class="end" v-if="data.footer"></div>
  </div>
</template>

<script>
import NavLink from './NavLink.vue'
import request from './requests'

export default {
  data(){
    return{
      pv: '',
    }
  },
  components: { NavLink },
  computed: {
    data () {
      return this.$page.frontmatter
    },
    actionLink () {
      return {
        link: this.data.actionLink,
        text: this.data.actionText
      }
    },
  },
  created: function () {
     this.getPv()
  },
  methods: {
    getPv: function () {
      const vm = this;
      request('https://wyydsb.xin/pv.txt')
        .then(res => {vm.pv = res;})
        .catch(reason => console.log(reason.message));
    },
  }
}
</script>

<style lang="stylus">
@import './styles/config.styl'

.home
  &-wrap
    padding $navbarHeight 0rem 0
    max-width 960px
    margin 0 auto
  &_main
    background url('./../public/main-bg.png')
    background-attachment fixed
    background-size cover
    background-position left bottom
    background-repeat no-repeat
    color #fff
    padding 200px 0
  &_about
    background #fff
    color #000
    .home-wrap
      padding 80px 80px 0 160px
      p
        max-width 759px
    &-title
      font-size 48px
      font-weight 300
      border-bottom none
      margin 0 0 38px 0
  &_features
    background url('./../public/features-bg.png')
    background-attachment fixed
    background-size cover
    background-position left top
    background-repeat no-repeat
    color #000
    .home-wrap
      padding 80px 1.5rem 55px
  .hero
    background none
    text-align center
    img
      max-height 280px
      display block
      margin 3rem auto 1.5rem
    h1
      margin-top 0
      font-size 100px
      font-weight bold
    .title-h1
      margin-top 0
      font-size 38px
    .description
      margin 15px auto
    .action
      margin 30px auto
    .description
      max-width 35rem
      font-size 27px
      line-height 1.3
      color #fff
    .description-text
      margin   30px auto
      max-width 35rem
      font-size 17px
      line-height 1.3
      color #fff
    .action-button
      display inline-block
      font-size 18px
      color #000
      background-color #fff
      padding 0.8rem 2rem
      border-radius 29px
      transition border .2s ease-in-out
      border 1px solid #034c5f
      box-sizing border-box
      // border-bottom 1px solid darken($accentColor, 10%)
      &:hover
        border 1px solid lighten(#06b8e6, 10%)
  .features
    .title
      padding 0
      width 100%
      h2
        border-bottom 0 none
        margin 0 0 37px 0
        font-size 48px
        font-weight 300
    display flex
    flex-wrap wrap
    align-items flex-start
    align-content stretch
    justify-content space-between
  .feature
    flex-grow 1
    max-width 48%
    box-sizing border-box
    margin: 0 0 20px 0
    h2
      font-size 28px
      font-weight 400
      border-bottom none
      padding-bottom 0
      color #000
      margin 15px 0
    p
      color #000
      margin 15px 0
  .pv
    display flex
    justify-content center
    align-items center
  .end
    margin 0.1rem 0 0 0
    padding 0.9rem 1rem
  .footer
    padding 0.9rem 1rem
    background #fff
    text-align center
    font-size 17px
    color: #324157
    display flex
    justify-content center
    align-items center
    margin 2rem 2rem 2rem 2rem
    span
      a
        color #000
        opacity .8
        transition color .3s ease-in-out
        &:hover
          color $accentColor
    .action
      margin 0
      display inline-block
      padding 0.8rem 2rem
      border-radius 29px
      transition border .2s ease-in-out
      border: 1px solid #000
      box-sizing border-box
      font-size 18px
      &:hover
        border 1px solid $accentColor 
      a
        color #000

@media (max-width: $MQMobile)
  .home
    &_about
      .home-wrap
        padding 40px 1.5rem
    &_features
      .home-wrap
        padding 40px 1.5rem 20px
    &_main
      padding 100px 0
    .features
      flex-direction column
      .title
        h2
          font-size 34px
    .feature
      max-width 100%
    .footer
      padding 0.9rem 1.5rem
      .action
        font-size 14px
      span
        font-size 14px

@media (max-width: $MQMobileNarrow)
  .home
    .hero
      img
        max-height 210px
        margin 2rem auto 1.2rem
      h1
        font-size 2rem
        margin  0 1.2rem 2rem
      .description, .action
        margin 0.2rem auto 0.8rem 
      .description
        font-size 1.2rem
      .action-button
        font-size 1rem
        padding 0.6rem 1.2rem
    .feature
      h2
        font-size 1.25rem
    .footer
      flex-direction column
      span
        order: 1
        margin: 20px 0 0 0
        font-size: 12px
        
</style>







