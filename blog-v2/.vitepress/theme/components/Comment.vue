<template>
  <div class="card"
       style="height:auto;">
    <div class="card__title">
      <div id="comment-container"
           class="comment">
        <template v-if="loaded">
          <div class="comment-list">
            <div v-for="(c, i) in comments"
                 :key="c.id"
                 class="comment-item">
              <div class="comment-meta">
                <span class="comment-floor">#{{ i + 1 }}</span>
                <span class="comment-name">{{ c.name }}</span>
                <span class="comment-time">{{ formatTime(c.ts) }}</span>
              </div>
              <div class="comment-content">{{ c.content }}</div>
            </div>
            <div v-if="!comments.length"
                 class="comment-empty">还没有评论,来抢沙发~</div>
          </div>
          <div class="comment-form">
            <input v-model.trim="name"
                   class="comment-input"
                   maxlength="30"
                   placeholder="昵称(选填)" />
            <textarea v-model="content"
                      class="comment-input"
                      rows="3"
                      maxlength="1000"
                      placeholder="写下你的评论…"></textarea>
            <!-- 蜜罐:正常用户看不到,机器人填了就会被服务端丢弃 -->
            <input v-model="website"
                   class="comment-hp"
                   type="text"
                   tabindex="-1"
                   autocomplete="off" />
            <div class="comment-actions">
              <span class="comment-msg">{{ msg }}</span>
              <button class="comment-btn"
                      :disabled="submitting"
                      @click="submit">{{ submitting ? '提交中…' : '提交' }}</button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import request from '../requests'
import { matchSlug } from '../libs/utils'

export default {
  data() {
    return {
      loaded: false,
      comments: [],
      name: '',
      content: '',
      website: '', // 蜜罐字段
      submitting: false,
      msg: '',
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    // 评论容器在首屏内时也立即尝试一次
    this.onScroll();
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    formatTime(ts) {
      return dayjs(ts).format('YYYY-MM-DD HH:mm')
    },
    async load() {
      const slug = matchSlug(this.$page.path)
      const res = await request('/api/comments/list?slug=' + encodeURIComponent(slug))
      if (res && res.result) this.comments = res.result
      this.loaded = true
    },
    async submit() {
      if (this.submitting) return
      const content = this.content.trim()
      if (!content) {
        this.msg = '评论内容不能为空'
        return
      }
      this.submitting = true
      this.msg = ''
      const res = await request('/api/comments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: matchSlug(this.$page.path),
          name: this.name,
          content,
          website: this.website,
        }),
      })
      this.submitting = false
      if (res && res.result && res.result.added) {
        if (res.result.comment) this.comments.push(res.result.comment)
        this.content = ''
        this.msg = '评论成功'
      } else if (res && res.result && res.result.reason === 'rate_limited') {
        this.msg = '太快了,喝口水休息一下再来~'
      } else {
        this.msg = '提交失败,请稍后再试'
      }
    },
    onScroll() {
      var container = document.getElementById('comment-container');
      if (container && window.scrollY + window.innerHeight >= container.offsetTop) {
        window.removeEventListener('scroll', this.onScroll);
        if (!this.loaded) this.load()
      }
    },
  }
}
</script>
<style lang="stylus">
@import '../styles/config.styl';

.comment
  padding 0 1rem
  margin -1em auto 1em
  width 100%
  text-align left
  position relative
  min-height 6em

.comment-item
  padding 0.8em 0
  border-bottom 1px dashed #e0e0e0

.comment-meta
  font-size 0.85em
  color #888
  margin-bottom 0.3em

.comment-floor
  color $primary-color
  margin-right 0.5em

.comment-name
  font-weight 600
  color #333
  margin-right 0.5em

.comment-content
  white-space pre-wrap
  word-break break-word
  line-height 1.6

.comment-empty
  text-align center
  color #999
  padding 1em 0

.comment-form
  margin-top 1em

.comment-input
  display block
  width 100%
  box-sizing border-box
  margin-bottom 0.6em
  padding 0.5em 0.8em
  border 1px solid #ddd
  border-radius $card-border-radius
  font-family $body-font-family
  font-size 0.95em
  resize vertical
  &:focus
    outline none
    border-color $primary-color

// 蜜罐藏在视口外,display:none 会被部分机器人识别
.comment-hp
  position absolute
  left -9999px
  top -9999px
  opacity 0
  height 0
  width 0

.comment-actions
  display flex
  align-items center
  justify-content space-between

.comment-msg
  font-size 0.85em
  color $primary-color

.comment-btn
  padding 0.45em 1.6em
  border none
  border-radius $card-border-radius
  background $primary-color
  color #fff
  cursor pointer
  font-size 0.95em
  &:disabled
    opacity 0.6
    cursor default
</style>
