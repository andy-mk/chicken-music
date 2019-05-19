<template>
  <transition name="slide">
    <div class="user">
      <h2 class="inform">功能正在实现中...</h2>
      <span class="back" @click="back">返 回</span>
    </div>
  </transition>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'base/styles/variable.scss';

  .user {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: $theme-back-color;

    .inform {
      width: 100%;
      margin-top: 100px;
      font-size: 16px;
      color: $theme-color;
      text-align: center;
    }

    .back {
      display: block;
      margin-top: 20px;
      font-size: 14px;
      color: $theme-color;
      text-align: center;
      text-decoration: underline;
    }
  }

  .slide-enter, .slide-leave-to {
    opacity: 0;
    transform: translateX(-50%)
  }
  .slide-enter-active, .slide-leave-active {
    transition: all .4s;
  }
</style>
