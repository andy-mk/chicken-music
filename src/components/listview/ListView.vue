<template>
  <div class="playlist-detail">
    <div class="header" ref="header">
      <h2 class="title">{{ title }}</h2>
      <div class="back" @click="back">
        <i class="iconfont icon-fanhui"></i>
      </div>
    </div>

    <div class="bg" ref="bgImage" :style="bgImageStyle()">
      <div class="filter"></div>
      <div class="play-wrapper">
        <div class="play" ref="play" @click="playAll">
          <i class="iconfont icon-zanting"></i>
          <span class="text">播放全部</span>
        </div>
      </div>
    </div>

    <div class="songlist-container" ref="songlistContainer">
      <Scroll :data="songlist" @scroll="scroll" :probeType="3" ref="scroll">
        <ul class="songlist">
          <li class="songlist-item" :key="item.id" v-for="(item,index) of songlist" @click="selectItem(index)">
            <div class="rank" v-show="rank">
              <span :class="normalRank(index+1)" v-text="index > 2 ? index : ''"></span>
            </div>
            <div class="content">
              <h2 class="name">{{ item.name }}</h2>
              <span class="singer">{{ item.singer }}</span>
            </div>
          </li>
        </ul>
      </Scroll>
      <div class="bg-layer" ref="bgLayer"></div>
    </div>

    <Loading :fixed="true" v-show="!songlist.length"></Loading>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { prefixStyle } from 'base/js/dom'
import { playlistMixin } from 'base/js/mixin'

import Scroll from 'components/scroll/Scroll'
import Loading from 'components/loading/Loading'

const transform = prefixStyle('transform')

export default {
  mixins: [playlistMixin],
  props: {
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    songlist: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      rank: false
    }
  },
  methods: {
    ...mapActions([
      'setPlaylist',
      'setFullScreen',
      'setCurrentSong',
      'setSequenceList',
      'setCurrentIndex',
      'setPlaying'
    ]),
    scroll({ y }) {
      const bgLayer = this.$refs.bgLayer
      const header = this.$refs.header
      const bgImage = this.$refs.bgImage
      if (!this.gapHeight) {
        this.gapHeight = bgImage.clientHeight - header.clientHeight
      }

      if (Math.abs(y) > this.gapHeight) {
        bgLayer.style[transform] = `translate3d(0, ${-this.gapHeight}px, 0)`
        bgImage.style.paddingTop = 0
        bgImage.style.height = header.clientHeight + 'px'
        bgImage.style.zIndex = 10
        this.$refs.play.style.display = 'none'
      } else {
        bgLayer.style[transform] = `translate3d(0, ${y}px, 0)`
        bgImage.style.paddingTop = '70%'
        bgImage.style.height = 0
        bgImage.style.zIndex = 0
        this.$refs.play.style.display = 'block'
      }

      if (y > 0) {
        let scale = 1 + y / (bgImage.clientHeight - 110)
        bgImage.style[transform] = `scale(${scale})`
      }
      if (y <= 0) {
        bgImage.style[transform] = `scale(1)`
      }
    },
    back() {
      this.$router.back()
    },
    playAll() {
      if (this.songlist.length === 0) {
        return
      }
      let index = 0
      this.setPlaylist(this.songlist)
      this.setSequenceList(this.songlist)
      this.setCurrentIndex(index)
      this.setCurrentSong(this.songlist[index])
      this.setPlaying(true)
    },
    bgImageStyle() {
      return `background-image: url('${this.bgImage}')`
    },
    selectItem(index) {
      this.setFullScreen(true)
      this.setPlaylist(this.songlist)
      this.setSequenceList(this.songlist)
      this.setCurrentIndex(index)
      this.setCurrentSong(this.songlist[index])
    },
    normalRank(index) {
      if (index === 1) return 'icon icon1'
      if (index === 2) return 'icon icon2'
      if (index === 3) return 'icon icon3'
      return 'text'
    },
    handlePlaylist(playlist) {
      let bottom = playlist.length > 0 ? '60px' : '0'
      this.$refs.songlistContainer.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _initData() {
      // 控制动画的一个变量，代表header底部距离bg底部的距离
      this.gapHeight = null

      this.rank = this.$route.path.split('/')[1] === 'rank' ? true : false
    }
  },
  components: {
    Scroll,
    Loading
  },
  created() {
    this._initData()
  }
}
</script>

<style lang="scss" scoped>
  @import 'base/styles/variable.scss';

  .playlist-detail {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: $theme-back-color;

    .loading {
      top: 100px;
    }

    .header {
      position: relative;
      height: 44px;
      z-index: 11;

      .back {
        position: absolute;
        top: 0;
        left: 0;
        width: 40px;
        line-height: 44px;
        text-align: center;

        .iconfont {
          color: $theme-color;
          font-size: 20px;
          font-weight: bold;
        }
      }

      .title {
        width: 70%;
        height: 44px;
        margin: 0 auto;
        color: #ffffff;
        line-height: 44px;
        text-align: center;
        @extend .text-overflow
      }
    }

    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      padding-top: 70%;
      overflow: hidden;
      background-color: $theme-back-color;
      background-size: 100% auto;
      background-repeat: no-repeat;

      .bg-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
      }

      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(7,17,27,.4);
      }

      .play-wrapper {
        position: absolute;
        bottom: 20px;
        width: 100%;
        z-index: 20;

        .play {
          box-sizing: border-box;
          width: 120px;
          padding: 5px 0;
          margin: 0 auto;
          border: 1px solid $theme-color;
          border-radius: 100px;
          text-align: center;
          line-height: 16px;
          color: $theme-color;

          .iconfont {
            position: relative;
            top: 1px;
            font-size: 16px;
            margin-right: 6px;
          }

          .text {
            font-size: 12px;
          }
        }
      }
    }

    .songlist-container {
      position: fixed;
      top: 263px;
      bottom: 0;
      width: 100%;

      .scroll-wrapper {
        overflow: visible;
      }

      .songlist {
        padding: 20px 30px 0 30px;

        .songlist-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 64px;

          .rank {
            width: 25px;
            margin-right: 30px;
            text-align: center;

            .text {
              font-size: 18px;
              color: $theme-color;
            }

            .icon {
              display: inline-block;
              width: 25px;
              height: 24px;
              background-size: 25px 24px;

              &.icon1 {
                background-image: url('../../base/image/first@2x.png');
              }
              &.icon2 {
                background-image: url('../../base/image/second@2x.png');
              }
              &.icon3 {
                background-image: url('../../base/image/third@2x.png');
              }
            }
          }

          .content {
            flex: 1;
            overflow: hidden;

            .name {
              width: 100%;
              color: #ffffff;
              font-size: 14px;
              line-height: 21px;
              @extend .text-overflow
            }

            .singer {
              display: block;
              color: hsla(0,0%,100%,.3);
              font-size: 12px;
              margin-top: 4px;
              line-height: 21px;
              @extend .text-overflow
            }
          }
        }
      }

      .bg-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 200%;
        z-index: -10;
        background-color: $theme-back-color;
      }
    }
  }
</style>
