<template>
  <div class="page">
    <div class="empty"></div>
    <div class="page-edit">{{title + ' ' + lastUpdated}}</div>
    <Content :custom="false"/>
    <!--<div class="page-edit">-->
      <!--<div class="last-updated" v-if="lastUpdated">-->
        <!--<span class="prefix">{{ lastUpdatedText }}: </span>-->
        <!--<span class="time">{{ lastUpdated }}</span>-->
      <!--</div>-->
    <!--</div>-->
    <div class="page-nav" v-if="prev || next">
      <p class="inner">
        <span class="prev">
          <span class="prev-a">
            <router-link v-if="prev" :to="prev.path">
              <div class="link-left"> <span class="amp">&lt;</span> PREV</div>
              <div class="title">{{ prev.title || prev.path||' '}}</div>
            </router-link>
          </span>
        </span>
        <span class="next">
          <span class="prev-a">
            <router-link v-if="next" :to="next.path">
              <div class="link-left">NEXT <span class="amp">&gt;</span></div>
              <div class="title">{{ next.title || next.path||' '}}</div>
            </router-link>
          </span>
        </span>
      </p>
    </div>
    <slot name="bottom"/>
  </div>
</template>

<script>
import { resolvePage, normalize, outboundRE, endingSlashRE } from './util'
import request from './requests'

export default {
  props: ['sidebarItems'],
  computed: {
    lastUpdated () {
      if (this.$page.lastUpdated) {
        return new Date(this.$page.lastUpdated).toLocaleString(this.$lang)
      }
    },
    lastUpdatedText () {
      if (typeof this.$themeLocaleConfig.lastUpdated === 'string') {
        return this.$themeLocaleConfig.lastUpdated
      }
      if (typeof this.$site.themeConfig.lastUpdated === 'string') {
        return this.$site.themeConfig.lastUpdated
      }
      return 'Last Updated'
    },
    prev () {
      const prev = this.$page.frontmatter.prev;
      if (prev === false) {
        return;
      } else if (prev) {
        return resolvePage(this.$site.pages, prev, this.$route.path)
      } else {
        return resolvePrev(this.$page, this.sidebarItems)
      }
    },
    next () {
      const next = this.$page.frontmatter.next;
      if (next === false) {
        return;
      } else if (next) {
        return resolvePage(this.$site.pages, next, this.$route.path)
      } else {
        return resolveNext(this.$page, this.sidebarItems)
      }
    },
    title () {
      return this.$page.title;
    },
    editLink () {
      if (this.$page.frontmatter.editLink === false) {
        return
      }
      const {
        repo,
        editLinks,
        docsDir = '',
        docsBranch = 'master',
        docsRepo = repo
      } = this.$site.themeConfig

      let path = normalize(this.$page.path)
      if (endingSlashRE.test(path)) {
        path += 'README.md'
      } else {
        path += '.md'
      }

      if (docsRepo && editLinks) {
        const base = outboundRE.test(docsRepo)
          ? docsRepo
          : `https://github.com/${docsRepo}`
        return (
          base.replace(endingSlashRE, '') +
          `/edit/${docsBranch}` +
          (docsDir ? '/' + docsDir.replace(endingSlashRE, '') : '') +
          path
        )
      }
    },
    editLinkText () {
      return (
        this.$themeLocaleConfig.editLinkText ||
        this.$site.themeConfig.editLinkText ||
        `Edit this page`
      )
    }
  },
  created: function () {
    this.getPv()
  },
  methods: {
    getPv: function () {
      request('https://localhost/pv.txt')
        .then(res => res)
        .catch(reason => console.log(reason.message));
    },
  }
}

function resolvePrev (page, items) {
  return find(page, items, -1)
}

function resolveNext (page, items) {
  return find(page, items, 1)
}

function find (page, items, offset) {
  const res = []
  items.forEach(item => {
    if (item.type === 'group') {
      res.push(...item.children || [])
    } else {
      res.push(item)
    }
  })
  for (let i = 0; i < res.length; i++) {
    const cur = res[i]
    if (cur.type === 'page' && cur.path === page.path) {
      return res[i + offset]
    }
  }
}
</script>

<style lang="stylus">
@import './styles/config.styl'
@require './styles/wrapper.styl'

.page
  padding-bottom 2rem

.page-edit
  @extend $wrapper
  padding-top 1rem
  padding-bottom 1rem
  overflow auto
  .edit-link
    display inline-block
    a
      color lighten($textColor, 25%)
      margin-right 0.25rem
  .last-updated
    float right
    font-size 0.9em
    .prefix
      font-weight 500
      color lighten($textColor, 25%)
    .time
      font-weight 400
      color #aaa

.page-nav
  max-width $contentWidth + 150px
  margin 10px auto
  padding: 5px;
  .inner
    min-height 2rem
    margin 1rem 0 1rem 0
    overflow auto // clear float
    flex-wrap: wrap;
    flex-direction: row;
    display: flex;
    flex: 1 1 auto;
  .prev
    flex-basis: 50%;
    flex-grow: 0;
    max-width: 50%;
    text-align: left!important;
    flex-shrink: 1;
    cursor: pointer;
    transition: all 0.3s;
  .prev-a
    padding 10px
    cursor: pointer;
    align-items: center;
    border-radius: 2px;
    display: inline-flex;
    flex: 0 1 auto;
    font-size: 14px;
    font-weight: 500;
    justify-content: center;
    min-width: 88px;
    outline: 0;
    text-transform: uppercase;
    text-decoration: none;
    transition: .3s cubic-bezier(.25,.8,.5,1),color 1ms;
    position: relative;
    vertical-align: middle;
  .prev-a:hover
    background-color #dddddd;
  .next
    text-align: right!important;
    flex-shrink: 1;
    flex-basis: 50%;
    flex-grow: 0;
    max-width: 50%;
  .link-left
    color: #9e9e9e!important;
    -webkit-font-smoothing: antialiased;
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    line-height: 1;
    content: "\F053";
    font-size 17px
    font-weight: 900;
  .amp
    font-weight: 1000;
    font-size 18px
  .title
    font-size 18px
    font-weight 555

.empty
  padding  44px
  background-color #f6f6f6

@media (max-width: $MQMobile)
  .page-edit
    .edit-link
      margin-bottom .5rem
    .last-updated
      font-size .8em
      float none
      text-align left

</style>
