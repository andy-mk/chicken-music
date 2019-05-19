<template>
  <div class="progress-bar">
    <div class="container" ref="container" @click="progressClick">
      <div class="progress-wrapper">
        <div class="progress" ref="progress"></div>
      </div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.stop="touchProgressStart"
        @touchmove="touchProgressMove"
        @touchend="touchProgressEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from 'base/js/dom'
import { mapGetters } from 'vuex'

const transform = prefixStyle('transform')

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters([
      'fullScreen'
    ])
  },
  watch: {
    percent(p) {
      if (this.touch.initialize) {
        return
      }

      let conWidth = this.el.con.clientWidth
      let currentPos = conWidth * p
      let btnLeft = conWidth * p
      let proLeft = -(conWidth - currentPos)

      this.el.pro.style[transform] = `translateX(${proLeft}px)`
      this.el.btn.style[transform] = `translateX(${btnLeft}px)`
    },
    fullScreen(newValue) {
      if (!newValue) {
        return
      }

      let percent = this.percent
      let proWidth = this.el.con.clientWidth
      let proLeft = -(proWidth - (proWidth * percent))
      let btnLeft = proWidth * percent

      this.el.pro.style[transform] = `translateX(${proLeft}px)`
      this.el.btn.style[transform] = `translateX(${btnLeft}px)`
    }
  },
  methods: {
    progressClick(event) {
      let conLeft = this.el.con.getBoundingClientRect().x
      let conWidth = this.el.con.clientWidth
      let percent = (event.x - conLeft) / conWidth

      this.$emit('changeTime', percent)
    },
    touchProgressStart(e) {
      this.touch.initialize = true
      this.touch.left = this.el.con.getBoundingClientRect().x + (this.el.btn.style.width / 2)
      this.touch.min = this.touch.left
      this.touch.max = this.touch.left + this.el.con.clientWidth
    },
    touchProgressMove(e) {
      this.touch.moveX = e.touches[0].pageX
      if (this.touch.moveX <= this.touch.min || this.touch.moveX >= this.touch.max) {
        return
      }

      let proLeft = this.el.con.clientWidth
      let currentPos = this.touch.moveX - this.touch.left
      this.el.btn.style[transform] = `translateX(${currentPos}px)`
      this.el.pro.style[transform] = `translateX(${currentPos - proLeft}px)`
    },
    touchProgressEnd(e) {
      let conWidth = this.el.con.clientWidth
      let btnLeft = this.el.btn.getBoundingClientRect().x
      let currentPos = btnLeft - this.touch.left + (this.el.btn.clientWidth / 2)
      let percent = currentPos / conWidth

      this.$emit('changeTime', percent)
      this.touch.initialize = false
    }
  },
  created() {
    this.el = {}
    this.touch = {}
  },
  mounted() {
    this.el.pro = this.$refs.progress
    this.el.con = this.$refs.container
    this.el.btn = this.$refs.progressBtn
  }
}
</script>

<style lang="scss" scoped>
  @import 'base/styles/variable.scss';

  .progress-bar {
    position: relative;
    height: 30px;

    .container {
      position: absolute;
      top: 13px;
      width: 100%;
      height: 4px;
      background-color: rgba(0,0,0,.3);

      .progress-wrapper {
        width: 100%;
        height: 100%;
        overflow: hidden;

        .progress {
          width: 100%;
          height: 100%;
          background-color: $theme-color;
          transform: translateX(-100%);
        }
      }

      .progress-btn-wrapper {
        position: absolute;
        top: -13px;
        left: -15px;
        width: 30px;
        height: 30px;

        .progress-btn {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          width: 10px;
          height: 10px;
          background-color: $theme-color;
          border: 3px solid #ffffff;
          border-radius: 50%;
        }
      }
    }
  }
</style>
