<template>
  <div class="scroll-wrapper" ref="scrollWrapper">
    <div class="scroll-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    probeType: {
      type: Number,
      default: 0
    }
  },
  methods: {
    _initScroll() {
      this.scroll = new BScroll(this.$refs.scrollWrapper, {
        scrollY: true,
        probeType: this.probeType,
        click: true
      })
      this.scroll.on('scroll', ({ x, y }) => {
        this.$emit('scroll', { x, y })
      })
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo(x, y, time) {
      this.scroll.scrollTo(x, y, time)
    },
    scrollToElement(el, time, offsetX, offsetY) {
      this.scroll.scrollToElement(el, time, offsetX, offsetY)
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  },
  mounted() {
    this._initScroll()
  }
}
</script>

<style lang="scss" scoped>
  .scroll-wrapper {
    height: 100%;
    overflow: hidden;
  }
</style>
