<template>
  <div class="header">
    <img class="logo" src="./logo@2x.png" />
    <h2 class="title">Chicken Music</h2>
    <router-link class="user" tag="div" to="/user">
      <i class="iconfont icon-yonghu"></i>
    </router-link>
    <router-link class="search" tag="div" to="/search">
      <i class="iconfont icon-chaxun"></i>
    </router-link>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
  @import 'base/styles/variable.scss';

  .header {
    position: relative;
    height: 44px;
    text-align: center;
    color: $theme-color;
    background-color: $theme-back-color;

    .logo {
      width: 30px;
      height: 32px;
      margin: 6px 9px 0 0;
    }

    .title {
      display: inline-block;
      font-size: 18px;
      line-height: 44px;
      vertical-align: top;
    }

    .user {
      position: absolute;
      top: 0;
      left: 0;
      height: 44px;

      .iconfont {
        display: block;
        font-size: 22px;
        padding: 11px;
      }
    }

    .search {
      position: absolute;
      top: 0;
      right: 0;
      height: 44px;

      .iconfont {
        display: block;
        font-size: 20px;
        padding: 12px;
      }
    }
  }
</style>
