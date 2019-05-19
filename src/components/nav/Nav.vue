<template>
  <div class="nav">
    <router-link class="nav-item" to='/recommend' tag="div">
      <span class="nav-link">推荐</span>
    </router-link>
    <router-link class="nav-item" to='/singer' tag="div">
      <span class="nav-link">歌手</span>
    </router-link>
    <router-link class="nav-item" to='/rank' tag="div">
      <span class="nav-link">排行</span>
    </router-link>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
  @import 'base/styles/variable.scss';

  .nav {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 44px;
    color: hsla(0,0%,100%,.5);
    font-size: 14px;
    line-height: 44px;

    .nav-item {
      .nav-link {
        padding-bottom: 5px;
      }
    }
  }

  .router-link-active {
    color: $theme-color;

    .nav-link {
      border-bottom: 2px solid $theme-color;
    }
  }
</style>
