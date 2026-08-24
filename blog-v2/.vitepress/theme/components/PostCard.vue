<template>
  <article :class="cardClass"
           style="height:auto;">
    <div class="card__title">
      <div class="flex xs12"
           v-if="notHome">
        <a :href="page.path"
           class="headline post-title-link"
           v-if="isList">{{ page.title }}</a>
        <h2 class="display-1 mb-3"
            v-else>{{ page.title }}</h2>
        <div class="post-meta">
          <span class="author">{{ page.author }}</span>
          <PostTime v-if="page.frontmatter"
                    :date="page.frontmatter.date"></PostTime>
          <span class="title_views">文章访问量:{{ page.titleViews }}</span>
        </div>
      </div>
    </div>
    <div class="card__text pt-0 pb-0">
      <div class="flex xs12">
        <slot>{{ page.excerpt }}</slot>
      </div>
    </div>
    <div class="card__text pt-0 pb-0"
         v-if="notHome">
      <div class="flex xs12">
        <Cite :bibtex="bibtex.content">{{ bibtex.content }}</Cite>
      </div>
    </div>
    <div class="card__actions">
      <div class="flex xs12">
        <Tag v-if="tagGList"
             v-for="tag in tagGList"
             :key="tag[0]"
             :slug="tag[0]"
             :level="tag[1]">{{ tag[0] }}</Tag>
      </div>
    </div>
  </article>
</template>
<script>
import Tag from "./Tag.vue";
import Cite from "./Cite.vue";
import PostTime from "./PostTime.vue";
import { matchSlug } from "../libs/utils";

export default {
  data() {
    return {
      bibtex: {},
    };
  },
  mounted() {
    // SSR 构建时没有 location,不生成 BibTeX(与旧版一致,SSR 产物 bibtex 为空)
    this.getBibTeX();
  },
  watch: {
    '$route.path'() {
      this.getBibTeX();
    }
  },
  components: {
    Tag,
    PostTime,
    Cite,
  },
  props: {
    post: {
      type: [String, Object],
      required: true,
    },
    shadowZ: Number,
    layout: {
      type: String,
      required: true,
    },
  },
  computed: {
    // 旧版在 created/轮询里组装 page;现在 $blog.pageViews 是 reactive 的,直接算即可。
    // 语义同旧 getTitleViews:pageViews 到达后,无历史数据的文章显示 0 而不是空白
    page() {
      const base = typeof this.post === "string" ? this.$blog.posts[this.post] : this.post;
      if (!base) return {};
      const pageViews = this.$blog.pageViews;
      if (pageViews && Object.keys(pageViews).length) {
        const slug = matchSlug(this.$route.path);
        return Object.assign({}, base, {
          titleViews: (pageViews.titleViewsMap || {})[slug] || 0,
        });
      }
      return base;
    },
    tagGList() {
      const slug = matchSlug(this.$route.path);
      return this.$blog.tagGList[slug];
    },
    isList() {
      return this.layout === "list";
    },
    notHome() {
      return this.page.frontmatter && this.page.frontmatter.layout !== "home";
    },
    cardClass() {
      return [
        "card",
        this.shadowZ ? `elevation-${this.shadowZ}` : "",
        `${this.layout}-card`,
      ];
    },
  },
  methods: {
    getBibTeX() {
      if (
        typeof this.bibtex.href !== "undefined" &&
        document.location.href === this.bibtex.href
      ) {
        return true;
      }
      var url = document.location.href;
      const removeTags = ["#", "?"];
      for (var i = 0; i < removeTags.length; ++i) {
        if (url.indexOf("#") != -1) {
          url = url.substring(0, url.indexOf("#"));
        }
      }
      const author = this.page.authorLastName + ", " + this.page.authorFirstName;
      const title = this.page.title;
      const date = new Date(this.page.frontmatter.date);
      var path = this.page.path.split("/");
      if (path.length > 2) {
        path = path[2].replace(".html", "");
      }
      const journal = this.$site.title;
      var bibName = this.page.authorLastName.toLocaleLowerCase() + date.getFullYear() + path;
      const bibtex = "@misc{" + bibName + ",\n\ttitle={" + title
                  + "},\n\turl={" + url + "},\n\tjournal={" + journal
                  + "},\n\tauthor={" + author + "},\n\tyear={" + date.getFullYear()
                  + "},\n\tmonth={" + date.toLocaleString('default', { month: 'long' }) + "}\n}"
      this.bibtex = {
        content: bibtex,
        href: url,
      };
    },
  },
};
</script>
<style lang="stylus">
@import '../styles/config.styl';

.post-card {
  // padding: 0 16px 16px;
}

.list-card {
  .card__title {
    padding-bottom: 0;
  }
}

.post-title-link {
  position: relative;
  display: inline-block;
  text-decoration: none;

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: $primary-color;
    visibility: hidden;
    transform: scaleX(0);
    transition: 0.3s ease-in-out;
  }

  &:hover, &:active {
    &:after {
      visibility: visible;
      transform: scaleX(1);
    }
  }
}

.author
  font-family: $font-code;
  margin 0 10px 0 0
  color #6d6d6d

.title_views
  font-family: $font-code;
  margin 0 0 0 10px
  color #6d6d6d
</style>
