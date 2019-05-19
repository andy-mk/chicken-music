<template>
  <div class="player">
    <transition
      name="normal"
      @after-enter="afterEnter"
      @enter="enter"
      @after-leave="afterLeave"
      @leave="leave">
      <!-- 播放器 全屏 -->
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <div class="filter"></div>
          <img class="img" :src="currentSong.image" />
        </div>
        <div class="top">
          <div class="header" ref="header">
            <h2 class="title">{{ currentSong.name }}</h2>
            <div class="back" @click="closeFullScreen">
              <i class="iconfont icon-fanhui"></i>
            </div>
          </div>
          <div class="singer">{{ currentSong.singer }}</div>
        </div>
        <div class="middle">
          <!-- 唱片部分 -->
          <div class="middle-l" v-show="cd">
            <div class="cd-wrapper" ref="cdWrapper" @click="toggleCd">
              <div class="cd">
                <img :class="cdClass" class="img" :src="currentSong.image" />
              </div>
            </div>
          </div>
          <!-- 歌词部分 -->
          <div class="middle-r" v-show="!cd" @click="toggleCd" @touchstart="middleRStart" @touchend="middleREnd">
            <Scroll :data="lyric" ref="scroll">
              <div class="lyric-wrapper" ref="lyricWrapper">
                <p
                  class="lyric-line"
                  :key="index"
                  :class="lineNo === index ? 'active': ''"
                  v-for="(item, index) of lyric">{{ item.c }}</p>
              </div>
            </Scroll>
            <div class="no-lyric" v-show="!lyric.length">暂无歌词</div>
          </div>
        </div>
        <div class="bottom">
          <div class="playing-lyric-wrapper" v-show="cd">
            <p class="playing-lyric">{{ playingLyric }}</p>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l" ref="time_l">{{ formatTime(this.currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar :percent="percent" @changeTime="changeTime"></ProgressBar>
            </div>
            <span class="time time-r">{{ formatTime(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon mode"><i class="iconfont" :class="playModeIcon" @click="changePlayMode"></i></div>
            <div class="icon" @click="prev"><i class="iconfont icon-shangyiqu101"></i></div>
            <div class="icon" @click="togglePlaying"><i class="iconfont" :class="playIcon"></i></div>
            <div class="icon" @click="next"><i class="iconfont icon-xiayiqu101"></i></div>
            <div class="icon" @click="selectLike"><i :class="likeIcon" class="iconfont"></i></div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 播放器 底部 -->
    <div class="mini-player" v-show="currentSong.name" @click.stop="showFullScreen">
      <div class="icon">
        <div class="imageWrapper">
          <img :class="cdClass" class="img" :src="currentSong.image" />
        </div>
      </div>
      <div class="text">
        <h2 class="name">{{ currentSong.name }}</h2>
        <p class="singer">{{ currentSong.singer }}</p>
      </div>
      <div class="control" @click.stop="togglePlaying">
        <ProgressCircle :radius="radius" :percent="percent">
          <i class="ignore iconfont icon-play-mini" ref="iconPlayMini" :class="playIcon"></i>
        </ProgressCircle>
      </div>
      <div class="playlist" @click.stop="togglePlaylistShow">
        <i class="iconfont icon-caidan"></i>
      </div>
    </div>

    <!-- 播放列表 -->
    <Playlist
      v-show="showPlaylist"
      :modeIcon="playModeIcon"
      @next="next"
      @close="togglePlaylistShow"
      @changeMode="changePlayMode"></Playlist>

    <!-- 音频组件 -->
    <audio
      muted
      :src="currentSong.url"
      ref="audio"
      @canplay="canplay"
      @ended="end"
      @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
import { playMode } from './config.js'
import { formatLyric, createRandomList, findSongIndex } from 'base/js/util'
import { mapGetters, mapActions } from 'vuex'
import Stroage from 'base/js/stroage'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'base/js/dom'

import Scroll from 'components/scroll/Scroll'
import Playlist from 'components/playlist/Playlist'
import ProgressBar from 'components/progress-bar/ProgressBar'
import ProgressCircle from 'components/progress-circle/ProgressCircle'

const stroage = new Stroage('like')
const transform = prefixStyle('transform')

export default {
  data() {
    return {
      cd: true,
      lyric: [],
      lineNo: 0,
      radius: 32,
      reading: false,
      currentTime: 0,
      lyricTouch: false,
      showPlaylist: false
    }
  },
  methods: {
    ...mapActions([
      'setPlaying',
      'setCurrentIndex',
      'setCurrentSong',
      'setPlayMode',
      'setRandomList',
      'setFullScreen',
      'setSequenceList',
      'setPlaylist'
    ]),
    toggleCd() {
      this.cd = !this.cd
      if (!this.cd) {
        this.toLyricLine()
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      }
    },
    togglePlaying() {
      if (this.reading || this.currentSong.url === 'null') {
        return
      }
      this.setPlaying(!this.playing)
    },
    togglePlaylistShow() {
      this.showPlaylist = !this.showPlaylist
    },
    canplay() {
      this.setPlaying(true)
    },
    end() {
      this.currentTime = 0
      if (this.playMode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    prev() {
      if (this.reading) {
        return
      }
      if (!this.playlist.length) {
        this.setPlaying(false)
        return
      }

      if (this.currentIndex - 1 < 0) {
        this.setCurrentIndex(this.playlist.length - 1)
      } else {
        this.setCurrentIndex(this.currentIndex - 1)
      }
      if (this.playlist[this.currentIndex] === this.currentSong) {
        this.loop()
      }
      this.setCurrentSong(this.playlist[this.currentIndex])
    },
    next() {
      if (this.reading) {
        return
      }
      if (!this.playlist.length) {
        this.setPlaying(false)
        return
      }

      if (this.currentIndex + 1 >= this.playlist.length) {
        this.setCurrentIndex(0)
      } else {
        this.setCurrentIndex(this.currentIndex + 1)
      }
      if (this.playlist[this.currentIndex] === this.currentSong) {
        this.loop()
      }
      this.setCurrentSong(this.playlist[this.currentIndex])
    },
    loop() {
      this.$refs.audio.play()
    },
    updateTime(event) {
      if (this.reading) {
        return
      }
      this.currentTime = event.target.currentTime
      this.toLyricLine()
    },
    formatTime(t) {
      if (!t) {
        return '0:00'
      }
      const m_unit = parseInt(t / 60 % 10)
      const s_ten = parseInt(t % 60 / 10)
      const s_unit = parseInt(t % 60 % 10)
      const time = `${m_unit}:${s_ten}${s_unit}`
      return time
    },
    changeTime(percent) {
      this.$refs.audio.currentTime = parseInt(percent * this.currentSong.duration)
    },
    changePlayMode() {
      let mode = (this.playMode + 1) % 3
      if (mode === playMode.loop) {
        return this.setPlayMode(mode)
      }
      if (mode === playMode.random) {
        let list = createRandomList(this.sequenceList)
        this.setPlaylist(list)
        this.setCurrentIndex(-1)
      } else {
        let list = this.sequenceList
        let index = findSongIndex(this.currentSong.id, list)
        this.setPlaylist(list)
        this.setCurrentIndex(index)
      }
      this.setPlayMode(mode)
    },
    closeFullScreen() {
      this.setFullScreen(false)
    },
    showFullScreen() {
      this.setFullScreen(true)
      this.toLyricLine()
    },
    findLyricIndex(t) {
      for (let i = 0; i < this.lyric.length; i++) {
        if (!this.lyric[i + 1]) {
          return i
        }
        if (this.lyric[i].t <= t && t < this.lyric[i + 1].t) {
          return i
        }
      }
    },
    toLyricLine() {
      if (!this.$refs.lyricWrapper.children || this.lyricTouch) {
        return
      }

      let lines = this.$refs.lyricWrapper.children
      this.lineNo = this.findLyricIndex(this.currentTime)
      this.$refs.scroll.scrollToElement(lines[this.lineNo], 300, true, true)
    },
    middleRStart() {
      clearTimeout(this.lyricTouchTimer)
      this.lyricTouch = true
    },
    middleREnd() {
      this.lyricTouchTimer = setTimeout(() => {
        this.lyricTouch = false
      }, 2000)
    },
    selectLike() {
      let song = this.currentSong
      let arr = stroage.get()
      if (song.like) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === song.id.toString()) {
            let val = stroage.remove(i)
            song.like = !val
            break
          }
        }
      } else {
        let val = stroage.push(song.id)
        song.like = val
      }
    },
    enter(el, done) {
      if (!this.cd) {
        return
      }
      const { x, y, scale } = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      // 如果当前是歌词页面,则重新计算 歌词scroll 的高度
      if (!this.cd) this.$refs.scroll.refresh()
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      if (!this.cd) {
        setTimeout(done, 400)
        return
      }
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    _reset() {
      this.setPlaying(false)
      this.currentTime = 0
      this.lyric = []
    },
    _getPosAndScale() {
      // 起始位置的参数
      let targetWidth = 40
      let initialLeft = 20
      let initialBottom = 10
      // 结束位置的参数
      let width = window.innerWidth * 0.8
      let endTop = 80
      let endLeft = width / 2

      let scale = targetWidth / width
      let x = -(endLeft - initialLeft)
      let y = window.innerHeight - endTop - endLeft - initialBottom
      return { x, y, scale }
    }
  },
  computed: {
    ...mapGetters([
      'playlist',
      'currentIndex',
      'playing',
      'playMode',
      'fullScreen',
      'currentSong',
      'sequenceList'
    ]),
    playIcon() {
      return this.playing ? 'icon-bofang1' : 'icon-zanting'
    },
    playModeIcon() {
      if (this.playMode === playMode.sequence) {
        return 'icon-liebiaoxunhuan'
      }
      if (this.playMode === playMode.random) {
        return 'icon-suiji'
      }
      if (this.playMode === playMode.loop) {
        return 'icon-danquxunhuan'
      }

      return false
    },
    likeIcon() {
      return this.currentSong.like ? 'icon-xihuan' : 'icon-xihuan-xianxing'
    },
    percent() {
      if (this.reading) {
        return 0
      }
      return parseInt(this.currentTime) / this.currentSong.duration
    },
    cdClass() {
      return this.playing ? 'play' : 'play pause'
    },
    playingLyric() {
      return this.lyric[this.lineNo] ? this.lyric[this.lineNo].c : '暂无歌词'
    }
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id || newSong.id === oldSong.id) {
        return
      }
      this._reset()
      this.reading = true

      // 获取歌曲播放地址
      newSong.getUrl().then((res) => {
        if (res) {
          this.currentSong.url = res
          this.setPlaying(true)
        } else {
          this.currentSong.url = 'null'
        }
        this.reading = false
      })

      // 获取歌词
      newSong.getLyric().then(res => {
        this.lyric = formatLyric(res)
      })
    },
    playing(newValue) {
      const audio = this.$refs.audio
      setTimeout(() => {
        newValue ? audio.play() : audio.pause()
      }, 100)
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
  }
}
</script>

<style lang="scss" scoped>
  @import 'base/styles/variable.scss';

  .player {

    .normal-player {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: #fff;
      z-index: 100;

      .background {
        position: absolute;
        top: -50%;
        left: -50%;
        bottom: 0;
        opacity: .6;
        width: 300%;
        height: 300%;
        filter: blur(30px);
        z-index: -10;

        .filter {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background: #000;
          opacity: .6;
        }

        .img {
          width: 100%;
          height: 100%;
        }
      }

      .top {

        .header {
          position: relative;
          height: 44px;
          line-height: 44px;
          z-index: 11;
          font-size: 18px;
          text-align: center;
          color: #ffffff;

          .title {
            width: 70%;
            margin: 0 auto;
            @extend .text-overflow
          }

          .back {
            position: absolute;
            top: 0;
            left: 0;
            width: 15%;
            line-height: 44px;
            text-align: center;
            transform: rotate(-90deg);

            .iconfont {
              color: $theme-color;
              font-size: 24px;
              font-weight: bold;
            }
          }
        }

        .singer {
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          color: #ffffff;
          text-align: center;
        }
      }

      .middle {
        position: fixed;
        top: 80px;
        bottom: 170px;
        width: 100%;

        .middle-l {
          position: relative;
          padding-top: 80%;

          .cd-wrapper {
            position: absolute;
            top: 0;
            left: 10%;
            width: 80%;
            height: 100%;
            box-sizing: border-box;

            .cd {
              width: 100%;
              height: 100%;

              .img {
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid hsla(0,0%,100%,.1);

                &.play {
                  animation: rotate 20s linear infinite
                }
                &.pause {
                  animation-play-state: paused
                }
              }
            }
          }
        }

        .middle-r {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 80%;
          padding: 0 10%;
          height: 100%;

          .no-lyric {
            position: absolute;
            top: 50%;
            width: 80%;
            line-height: 30px;
            font-size: 14px;
            text-align: center;
            color: hsla(0,0%,100%,.5);
          }

          .lyric-wrapper {
            display: flex;
            flex-direction: column;

            .lyric-line {
              text-align: center;
              line-height: 34px;
              font-size: 14px;
              color: hsla(0,0%,100%,.5);

              &.active {
                color: #ffffff;
              }
            }
          }
        }
      }

      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;

        .playing-lyric-wrapper {
          width: 70%;
          margin: 0 auto;
          padding: 20px 0;
          text-align: center;
          color: #ffffff;

          .playing-lyric {
            font-size: 14px;
            line-height: 20px;
          }
        }

        .progress-wrapper {
          display: flex;
          width: 80%;
          margin: 0 auto;
          padding: 10px 0;

          .time {
            width: 36px;
            line-height: 30px;
            font-size: 12px;
            color: #ffffff;
          }

          .time-l {
            text-align: left;
          }

          .time-r {
            text-align: right;
          }

          .progress-bar-wrapper {
            flex: 1;
          }
        }

        .operators {
          position: relative;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 80%;
          padding: 0 10%;

          .icon {

            .iconfont {
              font-size: 26px;
              color: #ffcd32;
            }

            .icon-shangyiqu101, .icon-xiayiqu101 {
              font-size: 24px;
            }

            .icon-zanting, .icon-bofang1 {
              font-size: 46px;
            }

            .icon-xihuan {
              color: #f0746b;
            }
          }

          .mode {
            width: 26px;
            height: 26px;
          }
        }
      }
    }

    .mini-player {
      position: absolute;
      bottom: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      height: 60px;
      background-color: #333;

      .icon {
        width: 40px;
        height: 40px;
        padding: 0 10px 0 20px;

        .imageWrapper {
          width: 100%;
          height: 100%;

          .img {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite
            }
            &.pause {
              animation-play-state: paused
            }
          }
        }
      }

      .text {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        line-height: 20px;
        overflow: hidden;

        .name {
          color: #ffffff;
          font-size: 14px;
          margin-bottom: 2px;
          @extend .text-overflow
        }

        .singer {
          color: hsla(0,0%,100%,.3);
          font-size: 12px;
          @extend .text-overflow
        }
      }

      .control {
        flex: 0;
        width: 30px;
        padding: 0 10px;

        .icon-play-mini {
          position: absolute;
          top: 0;
          left: 0;
          color: rgba(255,205,49,.5);
        }

        .ignore {
          font-size: 32px;
        }
      }

      .playlist {
        flex: 0;
        width: 30px;
        height: 30px;
        padding: 0 10px;

        .icon-caidan {
          font-size: 30px;
          color: rgba(255,205,49,.5);
        }
      }
    }
  }

  .normal-enter, .normal-leave-to {
    opacity: 0;
    .top {
      transform: translate3d(0, -100px, 0);
    }
    .bottom {
      transform: translate3d(0, 100px, 0);
    }
  }
  .normal-enter-active, .normal-leave-active {
    transition: all .4s;
    .top, .bottom {
      transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0)
    }

    100% {
      transform: rotate(360deg)
    }
  }
</style>
