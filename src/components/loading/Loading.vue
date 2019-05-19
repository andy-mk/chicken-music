<template>
  <div class="loading" :class="fixed ? 'loading-fixed' : 'loading-flow'">
    <img class="img" src="./loading.gif" />
  </div>
</template>

<script>
export default {
  props: {
    fixed: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .loading-flow {
    width: 100%;
    height: 28px;
    text-align: center;

    .img {
      width: 28px;
      height: 28px;
    }
  }

  .loading-fixed {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 100%;

    .img {
      position: absolute;
      top: 0;
      bottom: 100px;
      left: 0;
      right: 0;
      margin: auto;
      width: 28px;
      height: 28px;
    }
  }
</style>
