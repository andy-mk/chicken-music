<template>
  <div class="singer">
    <div class="scroll-container" ref="scrollCon">
      <Loading :fixed="true" v-show="!singer.length"></Loading>
      <Scroll :data="singer" :probeType="3" ref="scroll" @scroll="scroll">
        <ul class="content" ref="singerContent">
          <li class="list-item" :key="index" v-for="(item, index) in singer">
            <h2 class="title">{{ item.title }}</h2>
            <ul>
              <li class="singer-item" v-for="(s, index) in item.items" :key="index" @click="selectItem(s.id)">
                <img class="img" :src="s.image" />
                <span class="singer-name">{{ s.name }}</span>
              </li>
            </ul>
          </li>
        </ul>
      </Scroll>
    </div>

    <div class="list-fixed" ref="fixedTitle" v-show="singer.length">
      <div class="fixed-title">{{ title }}</div>
    </div>

    <div class="list-shortcut" v-show="singer.length">
      <ul class="content-wrapper" ref="shortcut">
        <li
          class="item"
          :class="i ===index  ? 'active': ''"
          :key="item.id"
          @click="keyClick(i)"
          @touchstart.stop.prevent="start(i)"
          @touchmove.stop.prevent="move"
          @touchend.prevent="end"
          v-for="(item, i) in singer">{{ item.title.substr(0, 1) }}</li>
      </ul>
    </div>

    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import pinyin from 'pinyin'
import { prefixStyle } from 'base/js/dom'
import { getSingerList } from 'api/singer'
import { playlistMixin } from 'base/js/mixin'

import Singer from 'base/js/singer'
import Scroll from 'components/scroll/Scroll'
import Loading from 'components/loading/Loading'

const HOT_NAME = '热门'
const transform = prefixStyle('transform')

export default {
  mixins: [playlistMixin],
  data() {
    return {
      index: 0,
      singer: [],
      loading: true
    }
  },
  methods: {
    start(index) {
      this.touch.initialize = true
      this.touch.top = this.$refs.shortcut.getBoundingClientRect().y
      this.touch.itemH = this.$refs.shortcut.clientHeight / this.singer.length
    },
    move(e) {
      let pageY = e.touches[0].pageY
      let currentPos = parseInt((pageY - this.touch.top) / this.touch.itemH)
      if (currentPos >= this.singer.length) {
        return
      }
      this.scrollTo(currentPos)
    },
    end() {
      this.touch.initialize = false
    },
    keyClick(index) {
      this.scrollTo(index)
    },
    scroll({ y }) {
      let pos = this.position
      let no_abs_y = y
      y = Math.abs(y)

      for (let i = 0; i < pos.length; i++) {
        if (y >= pos[i].top && y < pos[i].bottom) {
          this.index = i
          break
        }
      }

      let fixed_title = this.$refs.fixedTitle
      let top = pos[this.index].bottom - 30
      let bottom = pos[this.index].bottom
      if (y >= top && y <= bottom) {
        let p = y - top
        fixed_title.style[transform] = `translateY(${-p}px)`
      } else if (no_abs_y > 0) {
        fixed_title.style[transform] = `translateY(${no_abs_y}px)`
      } else {
        fixed_title.style[transform] = `translateY(0)`
      }
    },
    scrollTo(index) {
      let scroll = this.$refs.scroll
      let current = this.position[index]
      scroll.scrollTo(0, -current.top)
    },
    selectItem(id) {
      this.$router.push(`/singer/${id}`)
    },
    handlePlaylist(playlist) {
      let bottom = playlist.length > 0 ? '60px' : '0'
      this.$refs.scrollCon.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getSingerList() {
      getSingerList().then(res => {
        this.singer = this._normalizeSinger(res)
      })
    },
    _normalizeSinger(list) {
      // 所有的首字母
      let keys = []
      // 热门歌手
      let hotSinger = list.splice(0, 10)
      let hot = [
        {
          title: HOT_NAME,
          items: []
        }
      ]
      hotSinger.forEach(item => {
        hot[0].items.push(new Singer({
          id: item.id,
          name: item.name,
          image: item.img1v1Url
        }))
      })

      // 无序
      let map = {}
      list.forEach((item, index) => {
        // 取出歌手首字母
        let key = pinyin(item.name.substr(0, 1), { style: pinyin.STYLE_FIRST_LETTER })[0][0].toUpperCase()

        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
          keys.push(key)
        }

        map[key].items.push(new Singer({
          id: item.id,
          name: item.name,
          image: item.img1v1Url
        }))
      })
      // 对key进行排序
      keys.sort()
      keys.unshift('热门')

      // 对歌手排序
      let ret = []
      keys.forEach(item => {
        for (let key in map) {
          if (item === key) {
            ret.push(map[key])
            return
          }
        }
      })

      return hot.concat(ret)
    }
  },
  computed: {
    title() {
      return this.singer[this.index] ? this.singer[this.index].title : ''
    }
  },
  watch: {
    singer() {
      setTimeout(() => {
        let pos = this.position
        let singer_con = this.$refs.singerContent
        let singer_item = [...singer_con.children]
        singer_item.forEach((item, index) => {
          let top = item.offsetTop
          let bottom = 0
          if (index + 1 < singer_item.length) {
            bottom = singer_item[index + 1].offsetTop
          }

          pos.push({
            top,
            bottom
          })
        })
        pos[pos.length - 1].bottom = singer_con.clientHeight
      }, 20)
    }
  },
  components: {
    Scroll,
    Loading
  },
  created() {
    this._getSingerList()
    this.touch = {}
    this.position = []
  }
}
</script>

<style lang="scss" scoped>
  @import 'base/styles/variable.scss';

  .singer {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
    overflow: hidden;

    .scroll-container {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;

      .content {

        .list-item {
          padding-bottom: 30px;

          .title {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            font-size: 12px;
            color: hsla(0,0%,100%,.5);
            background-color: #333;
          }

          .singer-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 20px 0 0 30px;

            .img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
            }

            .singer-name {
              color: hsla(0,0%,100%,.5);
              font-size: 14px;
              margin-left: 20px;
            }
          }
        }
      }
    }

    .list-fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;

      .fixed-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: 12px;
        color: hsla(0,0%,100%,.5);
        background-color: #333;
      }
    }

    .list-shortcut {
      position: absolute;
      top: 50%;
      right: 0;
      width: 20px;
      padding: 20px 0;
      background-color: rgba(0,0,0,.3);
      transform: translateY(-50%);

      .content-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;

        .item {
          padding: 3px;
          font-size: 12px;
          color: hsla(0,0%,100%,.5);

          &.active {
            color: $theme-color;
          }
        }
      }
    }
  }

  .slide-enter, .slide-leave-to {
    opacity: 0;
    transform: translate3d(50%, 0, 0)
  }
  .slide-enter-active, .slide-leave-active {
    transition: all .4s;
  }
</style>
