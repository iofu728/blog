<template>
  <v-container grid-list-xl
               align-center
               class="blog-container">
    <v-flex xs12
            class="mb-3">
      <PostCard :post="$page"
                :shadowZ="16"
                layout="post">
        <Content></Content>
      </PostCard>
    </v-flex>
  </v-container>
</template>
<script>
import Pagination from './components/Pagination'
import PostCard from './components/PostCard'
import './styles/theme.styl'

export default {
  components: {
    Pagination,
    PostCard
  },
  computed: {
    pageNum() {
      return this.$route.params.pageNum || 1
    }
  },
  methods: {
    goPage(pageNum) {
      const path = this.$site.themeConfig.pagination.path
      this.$router.push(pageNum === 1 ? '/' : path.replace(':pageNum', pageNum))
    }
  }
}
</script>