<template>
  <div class="cite">
    <div class="instruction">
      <div>{{ $tt("citeInstructions") }}</div>
    </div>
    <div class="bibtex"><slot>{{ bibtex }}</slot></div>
  </div>
</template>
<script>
export default {
  props: {
    bibtex: {
      type: String,
      default: "{}",
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '../styles/config.styl';

.cite
  padding: 12px
  background: #f3f3f3
  border-radius: 4px;
  font-family: $font-code;

.instruction
  font-weight: 600

.bibtex
  display: inline-block
  padding: 9px
  margin: 0 3px
  line-height: 1.2
  white-space: pre-wrap;

@media (max-width: $MQMobile)
  .instruction
    font-size: 12px
  .bibtex
    font-size: 11px

</style>
