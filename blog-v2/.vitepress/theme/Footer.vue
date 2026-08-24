<template>
  <footer class="footer blog-footer darken-1 mt-3 theme--dark"
          style="height:auto;">
    <div class="primary--text text--lighten-4 text-xs-center py-3 card card--flat card--tile primary"
         style="height:auto;">
      <div class="card__text pb-0 mt-1">累计访问量: {{pageViews.totalPageViews}} | 昨日访问量: {{pageViews.yesterdayPageViews}} | 昨日爬虫数: {{pageViews.yesterdayPageSpider}}</div>
      <div class="card__text pt-0 pb-0 mt-1">
        <span>{{$page.author }} &copy; {{since}}</span>
        <span>
          <template v-if="$site.themeConfig.icpLicense">
            <a href="https://beian.miit.gov.cn/"
               target="_blank"
               rel="noopener noreferrer">{{$site.themeConfig.icpLicense}}{{icpSuffix}}</a>
            <br />
          </template>
          Power by
          <a href="https://vuepress.vuejs.org"
             target="_blank"
             rel="noopener noreferrer">VuePress</a> &
          <a href="https://github.com/iofu728/blog"
             target="_blank"
             rel="noopener noreferrer">iofu728/blog</a>
        </span>
      </div>
      <div class="card__text pt-0 mt-1"
           v-html="$tt('license')"></div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      // SSR 与客户端首帧都为空,mounted 后再补,避免水合文本不一致
      icpSuffix: '',
    };
  },
  mounted() {
    this.icpSuffix = this.getICP();
  },
  computed: {
    // $blog.pageViews 是 reactive 对象,接口返回后自动刷新,无需旧版的每秒轮询
    pageViews() {
      return this.$blog.pageViews;
    },
    since() {
      const since = this.$site.themeConfig.since;
      const now = new Date().getFullYear();
      return since < now ? `${since} - ${now}` : since;
    }
  },
  methods: {
    getICP() {
      try {
        let href = window.location.href;
        return href.includes(".com") ? "-5" : (href.includes(".cn") ? "-6" : "-4");
      } catch (e) {
        return "";
      }
    }
  }
};
</script>
<style lang="stylus">
.blog-footer {
  font-size: 13px;

  .card {
    width: 100%;
    opacity: 0.9;
  }

  .card__text {
    span {
      &:not(:first-child):before {
        content: '·';
        padding: 0 0.5em;
      }
    }

    a {
      color: inherit;
      text-decoration: none;
      border-bottom: 1px dotted rgba(255, 255, 255, 0.5);

      &:hover {
        color: #fff;
        border-bottom: 1px solid rgba(255, 255, 255, 0.7);
      }
    }
  }
}
</style>
