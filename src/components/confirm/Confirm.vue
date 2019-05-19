<template>
  <transition name="confirm">
    <div class="confirm">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">是否清空{{ hint }}</p>
          <div class="operate">
            <div class="operate-btn left" @click="cancel">取消</div>
            <div class="operate-btn" @click="clear">清空</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    hint: {
      type: String,
      default: ''
    }
  },
  methods: {
    clear() {
      this.$emit('clear')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
  .confirm {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    background-color: rgba(0,0,0,.3);
    z-index: 1;

    .confirm-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      z-index: 2;

      .confirm-content {
        width: 240px;
        border-radius: 13px;
        background-color: #333;

        .text {
          padding: 19px 15px;
          line-height: 22px;
          font-size: 16px;
          text-align: center;
          color: hsla(0,0%,100%,.5);
        }

        .operate {
          display: flex;
          flex-direction: row;
          font-size: 14px;
          color: hsla(0,0%,100%,.3);
        }

        .operate-btn {
          flex: 1;
          text-align: center;
          line-height: 22px;
          padding: 10px 0;
          border-top: 1px solid rgba(0,0,0,.3);

          &.left {
            border-right: 1px solid rgba(0,0,0,.3);
          }
        }
      }
    }
  }

  @keyframes confirm-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  .confirm-enter, .confirm-leave-to {
    opacity: 0;
  }
  .confirm-enter-active {
    transition: all .3s;
    animation: confirm-in .3s
  }
  .confirm-leave-active {
    transition: all .3s;
  }
</style>
