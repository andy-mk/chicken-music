<template>
  <transition name="slide">
    <div class="global-popup" v-show="popup">
      <div class="popup-wrapper">
        <div class="top">
          <h2 class="title">提示</h2>
          <span class="close" @click="close">
            <i class="iconfont icon-cha"></i>
          </span>
        </div>
        <div class="content">
          <p class="news" v-for="(item, index) in news" :key="index">{{ `${index+1}.${item}` }}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      news: [
        '推荐全屏展示该页面',
        '部分浏览器无法正常播放音乐，推荐使用QQ浏览器打开该页面'
      ]
    }
  },
  props: {
    popup: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'base/styles/variable.scss';

  .global-popup {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0,0,0,.3);

    .popup-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 70%;
      transform: translate3d(-50%, -50%, 0);
      background-color: #fff;
      border-radius: 4%;

      .top {
        position: relative;

        .title {
          width: 100%;
          height: 30px;
          font-size: 16px;
          line-height: 34px;
          text-align: center;
          padding: 5px 0;
          border-bottom: 1px solid #eee;
        }

        .close {
          position: absolute;
          top: 0;
          right: 0;
          width: 40px;
          height: 40px;
          line-height: 40px;
          text-align: center;

          .iconfont {
            font-size: 22px;
          }
        }
      }

      .content {
        padding: 15px;

        .news {
          color: #515a6e;
          font-size: 14px;
          line-height: 22px;
        }
      }
    }
  }

  .slide-leave-to {
    opacity: 0;
  }
  .slide-leave-active {
    transition: all .3s;
  }
</style>
