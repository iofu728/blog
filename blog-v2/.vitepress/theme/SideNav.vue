<template>
  <div>
    <div class="aside-brand-wrap">
      <div class="aside-brand">
        <a :href="content.avatarLink"
           :class="avatarClass">
          <img :src="$withBase(content.avatar)"
               alt="avatar">
        </a>
        <hgroup class="mt-3 variant-hide">
          <div class="subheading white--text">{{$page.author}}</div>
          <a :href="`mailto:${content.email}`"
             :title="content.email"
             class="aside-mail primary--text text--lighten-5">{{content.email}}</a>
        </hgroup>
      </div>
    </div>
    <hr class="divider theme--dark">
    <div class="list nav-list">
      <div class="secondary--text"
           v-for="item in content.menus"
           :key="item.text">
        <a v-ripple
           :href="item.url"
           :target="item.external ? '_blank' : null"
           :class="menuClass(item)">
          <div class="list__tile__avatar">
            <div class="avatar"
                 style="height:40px;width:40px;"><i :class="item.icon"></i></div>
          </div>
          <div class="list__tile__content">{{item.text}}</div>
        </a>
      </div>
    </div>
    <div class="bottom-sidebar"
         v-if="sidebarGroup.length && !miniNav"></div>
    <ul class="sidebar-links"
        v-if="sidebarGroup.length && !miniNav">
      <li v-for="(item, i) in sidebarGroup"
          :key="i">
        <SidebarGroup v-if="item.type === 'group'"
                      :item="item"
                      :first="i === 0"
                      :open="i === openGroupIndex"
                      :collapsable="item.collapsable || item.collapsible"
                      @toggle="toggleGroup(i)" />
        <SidebarLink v-else
                     :item="item" />
      </li>
    </ul>
  </div>
</template>
<script>
import { resolveSidebarItems, isActive } from './util'
import SidebarGroup from './SidebarGroup.vue'
import SidebarLink from './SidebarLink.vue'
import { data as blogData } from './data/posts.data'

export default {
  name: 'SideNav',
  components: { SidebarGroup, SidebarLink },
  props: ['miniNav'],
  data() {
    return {
      openGroupIndex: 0
    }
  },
  created() {
    this.refreshIndex()
  },
  watch: {
    '$route.path'() {
      this.refreshIndex()
    }
  },
  computed: {
    content() {
      return this.$site.themeConfig
    },
    routePath() {
      return this.$route.path.replace(/(^|\/)index\.html$/, '$1') || '/'
    },
    routeLike() {
      return { path: this.$route.path, hash: '' }
    },
    siteLike() {
      return { pages: blogData.pages, themeConfig: this.$site.themeConfig }
    },
    sidebarGroup() {
      return resolveSidebarItems(
        this.$page,
        this.routeLike,
        this.siteLike,
        '/'
      )
    },
    avatarClass() {
      // 旧站 avatar 是指向 / 的 router-link(非 exact):所有页面都带 router-link-active
      return 'aside-avatar elevation-2 ' +
        (this.routePath === '/' ? 'router-link-exact-active router-link-active' : 'router-link-active')
    },
  },
  methods: {
    menuClass(item) {
      if (item.external) return 'list__tile list__tile--link'
      const exact = item.url === '/'
      const active = exact
        ? this.routePath === '/'
        : this.routePath.indexOf(item.url) === 0
      if (!active) return 'list__tile list__tile--link'
      // 类名拼接对齐旧站 v-list-tile + router-link 的实际渲染结果
      const exactMatch = this.routePath === item.url
      return (exactMatch
        ? 'nav-active list__tile--active primary--text list__tile--active'
        : 'router-link-active list__tile--active primary--text') +
        ' list__tile list__tile--link'
    },
    refreshIndex() {
      const index = resolveOpenGroupIndex(
        this.routeLike,
        this.sidebarGroup
      )
      if (index > -1) {
        this.openGroupIndex = index
      }
    },
    toggleGroup(index) {
      this.openGroupIndex = index === this.openGroupIndex ? -1 : index
    },
  }
}

function resolveOpenGroupIndex(route, items) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.type === 'group' && item.children.some(c => isActive(route, c.path))) {
      return i
    }
  }
  return -1
}
</script>
<style lang="stylus">
@import './styles/config.styl';

.nav-active {
  .nav-icon {
    color: inherit;
  }
}

.nav-list {
  .list__tile {
    font-weight: 500;
  }
}

.aside {
  &-brand {
    padding: 48px 24px 24px;
    background: rgba($primary-color, 0.5);
    transition: 0.2s ease-in-out;
  }

  &-brand-wrap {
    background-image: url('./imgs/brand.jpg');
    background-repeat: no-repeat;
    background-size: 100%;
  }

  &-avatar {
    display: block;
    width: 80px;
    height: 80px;
    border: 2px solid #fff;
    border-radius: 50%;
    overflow: hidden;
    transition: 0.2s ease-in-out;

    img {
      width: 100%;
      height: 100%;
    }
  }

  &-mail {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.navigation-drawer--mini-variant {
  .variant-hide {
    display: none;
  }

  .aside {
    &-brand {
      padding: 8px 16px;
      background: #fff;
    }

    &-avatar {
      width: 48px;
      height: 48px;
    }
  }
}

.bottom-sidebar
  border-bottom  2px solid lighten($gray-color, 20%)
.sidebar-links
  padding 1.5rem 0
</style>
