<template>
  <v-card :class="cardClass" tag="article">
    <!-- <v-card-media>
    </v-card-media> -->
    <v-card-title>
      <v-flex xs12 v-if="notHome">
        <router-link
          :to="page.path"
          class="headline post-title-link"
          v-if="isList"
          >{{ page.title }}</router-link
        >
        <h2 class="display-1 mb-3" v-else>{{ page.title }}</h2>
        <div class="post-meta">
          <span class="author">{{ page.author }}</span>
          <PostTime
            v-if="page.frontmatter"
            :date="page.frontmatter.date"
          ></PostTime>
          <span class="title_views">文章访问量:{{ page.titleViews }}</span>
        </div>
      </v-flex>
    </v-card-title>
    <v-card-text class="pt-0 pb-0">
      <v-flex xs12>
        <slot>{{ page.excerpt }}</slot>
      </v-flex>
    </v-card-text>
    <v-card-text class="pt-0 pb-0" v-if="notHome">
      <v-flex xs12>
        <Cite :bibtex="bibtex">{{ bibtex }}</Cite>
      </v-flex>
    </v-card-text>
    <v-card-actions>
      <v-flex xs12>
        <Tag
          v-if="page.frontmatter"
          v-for="tag in page.frontmatter.tags"
          :key="tag"
          :slug="tag"
          >{{ tag }}</Tag
        >
      </v-flex>
    </v-card-actions>
  </v-card>
</template>
<script>
import Tag from "./Tag";
import Cite from "./Cite";
import PostTime from "./PostTime";
import { matchSlug } from "../libs/utils";

export default {
  data() {
    return {
      page: {},
    };
  },
  created() {
    this.getTitleViews();
    try {
      this.getBibTeX();
      window && this.haveTitleViews();
    } catch (e) {
      console.error(e.message);
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
    isList() {
      return this.layout === "list";
    },
    notHome() {
      return this.page.frontmatter && this.page.frontmatter.layout !== "home";
    },
    cardClass() {
      return [
        this.shadowZ ? `elevation-${this.shadowZ}` : "",
        `${this.layout}-card`,
      ];
    },
  },
  methods: {
    haveTitleViews() {
      setTimeout(() => {
        this.getBibTeX();
        this.getTitleViews();
        this.haveTitleViews();
      }, 1000);
    },
    getTitleViews() {
      if (
        typeof this.page.titleViews !== "undefined" &&
        typeof this.page.path !== "undefined" &&
        this.page.path ===
          (typeof this.post === "string"
            ? this.$blog.posts[this.post].path
            : this.post.path)
      ) {
        return true;
      }
      this.page = Object.assign(
        {},
        typeof this.post === "string" ? this.$blog.posts[this.post] : this.post
      );
      if (Object.keys(this.$blog.pageViews).length) {
        const slug = matchSlug(this.$route.path);
        this.page = Object.assign(this.page, {
          titleViews: this.$blog.pageViews.titleViewsMap[slug],
        });
      }
    },
    getBibTeX() {
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
      const journal = this.$localeConfig.title;
      var bibName = this.page.authorLastName.toLocaleLowerCase() + date.getFullYear() + path;
      const bibtex = "@misc{"+ bibName + ",\n\ttitle={" + title
                  + "},\n\turl={" + url + "},\n\tjournal={" + journal
                  + "},\n\tauthor={" + author + "},\n\tyear={" + date.getFullYear()
                  + "},\n\tmonth={" + date.toLocaleString('default', { month: 'long' }) + "}\n}"
      this.bibtex = bibtex;
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
