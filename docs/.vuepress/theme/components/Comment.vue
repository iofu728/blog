<template>
    <v-card>
        <v-card-title>
            <div id="gitalk-container" class="comment"></div>
        </v-card-title>
    </v-card>
</template>
<script>

  export default {
    mounted(){
      this.haveGitalk();
    },
    methods: {
      haveGitalk(){
        if (typeof Gitalk !== 'undefined' && Gitalk instanceof Function) {
          this.renderGitalk();
        } else {
          setTimeout(() => {this.haveGitalk()}, 1000)
        }
      },
      renderGitalk(){
        if (typeof Gitalk !== 'undefined' && Gitalk instanceof Function) {
          const gitalk = new Gitalk({
            clientID: '6ac606b7bad30bff534c',
            clientSecret: '88846074834e9cf5bbb1f586eac98a0aef7150d8',
            repo: 'blog',
            owner: 'iofu728',
            admin: ['iofu728'],
            id: 'comment',
            distractionFreeMode: false,
            language: 'zh-CN',
          })
          try {
            document && gitalk.render("gitalk-container");
          } catch (e) {
            console.error(e.message)
          }
        }
      }
    }

  }
</script>
<style lang="stylus">
  .comment
    padding 1rem
    margin 0 auto
    width 100%

</style>
