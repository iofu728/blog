<template>
    <v-card>
        <v-card-title>
            <div id="gitalk-container" class="comment"></div>
        </v-card-title>
    </v-card>
</template>
<script>
// import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'

  export default {
    name: '',
    data() {
      return {
        gitalk: new Gitalk({
          clientID: '6ac606b7bad30bff534c',
          clientSecret: 'cf218bccc6b17b1feaee02b406d0c1f021aaa5e7',
          repo: 'blog',
          owner: 'iofu728',
          admin: ['iofu728'],
          id: 'comment',
          distractionFreeMode: false,
          language: 'zh-CN',
        })
      }
    },
    mounted(){
      this.gitalk.render("gitalk-container");
    }

  }
</script>
<style lang="stylus">
  .comment
    padding 1rem
    margin 0 auto

</style>
