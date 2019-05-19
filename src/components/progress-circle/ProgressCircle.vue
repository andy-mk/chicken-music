<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background ignore" r="50" cx="50" cy="50" fill="transparent"/>
      <circle class="progress-bar ignore" r="50" cx="50" cy="50" fill="transparent"
              :stroke-dasharray="dashArray"
              :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dashArray: Math.PI * 100
    }
  },
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  computed: {
    dashOffset() {
      return (1 - this.percent) * this.dashArray
    }
  }
}
</script>

<style lang="scss" scoped>
  .progress-circle {
    position: relative;
    circle {
      transform-origin: center;
      &.progress-background {
        transform: scale(0.9);
        stroke: rgba(255,205,49,.5);
      }
      &.progress-bar {
        transform: scale(0.9) rotate(-90deg);
        stroke: #ffcd32;
      }
    }

    .ignore {
      stroke-width: 8px;
    }
  }

</style>
