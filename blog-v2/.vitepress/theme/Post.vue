<template>
  <div class="container blog-container grid-list-xl align-center">
    <div class="layout row wrap">
      <div class="flex mb-3 xs12">
        <PostCard :post="$page"
                  :shadowZ="16"
                  layout="post">
          <div class="content custom">
            <Content></Content>
          </div>
        </PostCard>
      </div>
      <div class="flex text-xs-left xs6">
        <a v-if="$postNav.prev"
           :href="$postNav.prev.path"
           class="post-nav btn btn--flat btn--router">
          <div class="btn__content">
            <div class="grey--text">
              <i class="fa mr-1 fa-chevron-left"></i>{{$tt('postNav_prev')}}</div>
            <div class="title mt-1 primary--text hidden-xs-only">{{$postNav.prev.title}}</div>
          </div>
        </a>
      </div>
      <div class="flex text-xs-right xs6">
        <a v-if="$postNav.next"
           :href="$postNav.next.path"
           class="post-nav btn btn--flat btn--router">
          <div class="btn__content">
            <div class="grey--text">{{$tt('postNav_next')}}
              <i class="fa ml-1 fa-chevron-right"></i>
            </div>
            <div class="title mt-1 primary--text hidden-xs-only">{{$postNav.next.title}}</div>
          </div>
        </a>
      </div>
      <div class="flex mt-3 xs12">
        <Comment></Comment>
      </div>
    </div>
  </div>
</template>
<script>
import { Content } from 'vitepress'
import PostCard from './components/PostCard.vue'
import Comment from './components/Comment.vue'

export default {
  components: {
    Content,
    PostCard,
    Comment
  },
}
</script>
<style lang="stylus">
@import './styles/config.styl';

.post-nav {
  &.btn {
    width 100%
    height: auto;
  }

  .btn__content {
    flex-direction: column;
    align-items: normal;
    padding: 8px 16px;
  }
}
</style>
