<template>
  <div class="container blog-container grid-list-xl align-center">
    <div class="flex mb-3 xs12">
      <PostCard :post="$page"
                :shadowZ="16"
                layout="post">
        <div class="content custom">
          <Content></Content>
        </div>
      </PostCard>
    </div>
  </div>
</template>
<script>
import { Content } from 'vitepress'
import PostCard from './components/PostCard.vue'

export default {
  components: {
    Content,
    PostCard
  },
}
</script>
