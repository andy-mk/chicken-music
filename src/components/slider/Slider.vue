<template>
  <div class="slider-wrapper" ref="sliderWrapper">
    <div class="slider-content" ref="sliderContent">
      <slot></slot>
    </div>
    <div class="dots">
      <div
        class="dot"
        :key="index"
        :class="{'active': currentIndex === index}"
        v-for="(item, index) of dots"></div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  data() {
    return {
      dots: [],
      currentIndex: 0
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    loop: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  methods: {
    refresh() {
      this.slider && this.slider.refresh()
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.sliderWrapper, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop
        }
      })

      if (this.autoPlay) {
        this._play()
        this.slider.on('scrollEnd', () => {
          this.currentIndex = this.slider.getCurrentPage().pageX
          this._play()
        })
      }
      this.slider.on('beforeScrollStart', () => {
        clearTimeout(this.timer)
      })
      window.addEventListener('resize', () => {
        this._initSliderWidth()
      })
    },
    _initSliderWidth() {
      const sliderContent = this.$refs.sliderContent
      const sliderItem = [...sliderContent.children]
      const clientWidth = document.body.clientWidth

      let sliderContentWidth = 0
      sliderItem.map((item, index) => {
        item.style.width = clientWidth + 'px'
        sliderContentWidth += clientWidth
      })
      sliderContent.style.width = sliderContentWidth + 'px'
    },
    _initDot() {
      const sliderItem = [...this.$refs.sliderContent.children]
      this.dots = sliderItem.filter((item, index) => {
        return index === 0 || index === sliderItem.length - 1 ? false : true
      })
    },
    _play() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (!this.slider) {
          return
        }
        this.slider.next()
      }, this.interval)
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._initSlider()
        this._initSliderWidth()
        this._initDot()
      }, 20)
    }
  },
  activated() {
    this._play()
  },
  deactivated() {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="scss" scoped>
  .slider-wrapper {
    position: relative;
    min-height: 1px;

    .slider-content {
      overflow: hidden;
      white-space: nowrap;
    }

    .dots {
      position: absolute;
      bottom: 10px;
      width: 100%;
      text-align: center;

      .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin: 0 4px;
        border-radius: 4px;
        background-color: hsla(0,0%,100%,.5);
      }

      .active {
        width: 20px;
        background-color: hsla(0,0%,100%,.8);
      }
    }
  }
</style>
