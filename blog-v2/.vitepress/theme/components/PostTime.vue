<template>
  <time class="secondary--text post-time"
        :datetime="isoDate"
        v-if="type === 'date'">{{formatDate}}</time>
  <time class="secondary--text post-time"
        :datetime="isoDate"
        v-else>{{formatDateTime}}</time>
</template>
<script>
import dayjs from 'dayjs'

export default {
  props: {
    type: {
      type: String,
      default: 'date'
    },
    date: [String, Date]
  },
  computed: {
    // Vue 3 没有 filter,旧模板里的 {{ date | date }} / | dateTime 改为 computed
    format() {
      return this.$site.themeConfig.format
    },
    formatDate() {
      return dayjs(this.date).format(this.format.date)
    },
    formatDateTime() {
      return dayjs(this.date).format(this.format.dateTime)
    },
    isoDate() {
      const d = dayjs(this.date)
      return d.isValid() ? d.toISOString() : this.date
    }
  }
}
</script>
<style>
.post-time {
    font-family: Georgia,serif;
    font-weight: 500;
}
</style>
