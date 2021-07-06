<template>
    <v-card>
        <v-card-title>
            <div id="utteranc-container" class="comment">
            </div>
        </v-card-title>
    </v-card>
</template>
<script>
  export default {
    mounted(){
      window.addEventListener('scroll', this.onScroll, {passive: true});
    },
    activated() {
      console.log(1);
    },
    methods: {
      renderUtteranc() {
        var container = document.getElementById('utteranc-container');
        var script = document.createElement("script");
        script.type = 'text/javascript';
        script.id = "utteranc";
        script.async = true;
        script.setAttribute('issue-term', 'title');
        script.setAttribute('theme', 'preferred-color-scheme')
        script.setAttribute('repo',`iofu728/blog`)
        script.setAttribute('crossorigin',`anonymous`)
        script.src = 'https://utteranc.es/client.js';
        container.appendChild(script);
      },
      onScroll(){
        var container = document.getElementById('utteranc-container');
        if (window.scrollY + window.innerHeight >= container.offsetTop) {
            window.removeEventListener('scroll', this.onScroll);
            this.renderUtteranc();
        }
      },
    }
  }
</script>
<style lang="stylus">
@import '../styles/config.styl';
.comment
  padding 0 1rem
  margin -1em auto
  width 100%
  text-align: center; 
  position: relative; 
  min-height: 6em;
.comments .loading
  font-size: 2em;
  display: inline-block;
  position: absolute;
  top: 2em;
  z-index: -1;
  -webkit-animation:spin 1s linear infinite;
  -moz-animation:spin 1s linear infinite;
  animation:spin 1s infinite;

@-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }

.utterances
  max-width: 100%; 
.utterances-frame
  position: absolute;
</style>
