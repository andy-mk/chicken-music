<template>
  <transition name="slide" @after-enter="afterEnter">
    <div class="playlist">
      <div class="list-wrapper">
        <div class="list-header">
          <i class="iconfont mode" :class="modeIcon" @click="changeMode"></i>
          <span class="text">
            <span @click="changeMode">{{ modeText }}</span>
          </span>
          <span class="clear" @click="confirm">
            <i class="iconfont icon-lajitong"></i>
          </span>
        </div>
        <div class="list-content">
          <Scroll :data="sequenceList" ref="scroll">
            <ul ref="itemWrapper">
              <li class="item"
                :key="item.id"
                v-for="(item, index) of sequenceList"
                @click="selectItem(item, index)">
                <i class="current iconfont" :class="playing(item)"></i>
                <span class="text">{{ item.name }}</span>
                <span class="like" @click.stop="selectLike(item)">
                  <i class="iconfont" :class="likeIcon(item, index)"></i>
                </span>
                <span class="delete" @click.stop="deleteSong(item,index)">
                  <i class="iconfont icon-cha"></i>
                </span>
              </li>
            </ul>
          </Scroll>
        </div>
        <div class="list-operate" v-show="false">
          <div class="add">
            <i class="iconfont icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="close">
          <span>关闭</span>
        </div>
      </div>

      <Confirm :hint="'播放列表'" @cancel="cancel" @clear="clear" v-show="tabWin"></Confirm>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { playMode } from '../player/config'
import { findSongIndex } from 'base/js/util'
import Stroage from 'base/js/stroage'
import Scroll from 'components/scroll/Scroll'
import Confirm from 'components/confirm/Confirm'

const stroage = new Stroage('like')

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    modeIcon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tabWin: false
    }
  },
  computed: {
    ...mapGetters([
      'playlist',
      'playMode',
      'currentSong',
      'currentIndex',
      'sequenceList'
    ]),
    modeText() {
      if (this.playMode === playMode.loop) {
        return '单曲循环'
      }
      if (this.playMode === playMode.sequence) {
        return '顺序播放'
      }
      if (this.playMode === playMode.random) {
        return '随机播放'
      }
      return false
    }
  },
  methods: {
    ...mapActions([
      'setPlaylist',
      'setCurrentSong',
      'setPlaying',
      'setCurrentIndex'
    ]),
    close() {
      this.$emit('close')
    },
    changeMode() {
      this.$emit('changeMode')
    },
    confirm() {
      this.tabWin = true
    },
    cancel() {
      this.tabWin = false
    },
    clear() {
      this.setPlaylist([])
      this.setCurrentSong({})
      this.setPlaying(false)
      this.tabWin = false
      this.close()
    },
    playing(song) {
      return this.currentSong.id === song.id ? 'icon-yinliang' : ''
    },
    deleteSong(item, index) {
      if (this.playMode === playMode.sequence) {
        // 找到当前播放歌曲的索引
        let c_index = findSongIndex(this.currentSong.id, this.playlist)
        // 从顺序列表中删除
        this.sequenceList.splice(index, 1)
        // 如果被删除的歌曲在当前播放歌曲之前,则currentIndex减一
        if (c_index >= index) {
          this.setCurrentIndex(this.currentIndex - 1)
        }
      } else if (this.playMode === playMode.random) {
        // 第一步: 找到被叉歌曲在 playlist 中的位置 (s_index) 和 当前正在播放歌曲的位置(c_index)
        // 第二步: 如果 s_index 小于了 当前正在播放歌曲的位置(c_index), 则currentIndex减1
        // 第三步: 如果 s_index 等于了 当前正在播放歌曲的位置(c_index), 则currentIndex不变
        // 第四步: 从随机列表和顺序列表中 删除被叉的歌曲
        let s_index = findSongIndex(item.id, this.playlist)
        let c_index = findSongIndex(this.currentSong.id, this.playlist)
        if (s_index < c_index) {
          this.setCurrentIndex(this.currentIndex - 1)
        }
        this.$store.state.playlist.splice(s_index, 1)
        this.sequenceList.splice(index, 1)
      }

      if (this.playlist.length === 0) {
        this.setPlaying(false)
        this.setCurrentSong({})
        this.close()
        return
      }

      // 如果删除的是正在播放的歌曲
      if (item.id === this.currentSong.id) {
        this.$emit('next')
      }
    },
    selectItem(item, index) {
      if (this.playMode === playMode.sequence) {
        this.setCurrentIndex(index)
        this.setCurrentSong(this.sequenceList[this.currentIndex])
      } else if (this.playMode === playMode.random) {
        this.setCurrentSong(this.sequenceList[index])
      }
    },
    likeIcon(item, index) {
      return item.like ? 'icon-xihuan' : 'icon-xihuan-xianxing'
    },
    selectLike(item) {
      let song = item
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
    afterEnter() {
      this.$refs.scroll.refresh()
    }
  },
  components: {
    Scroll,
    Confirm
  },
  watch: {
    show(val) {
      if (val) {
        let index = findSongIndex(this.currentSong.id, this.sequenceList)
        let items = this.$refs.itemWrapper.children
        let el = items[index]
        setTimeout(() => {
          this.$refs.scroll.scrollToElement(el, 300, true, true)
        }, 300)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'base/styles/variable.scss';

  .playlist {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0,0,0,.3);

    .list-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: #333;

      .list-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 20px 30px 10px 20px;

        .mode {
          position: relative;
          top: -1px;
          display: block;
          width: 34px;
          font-size: 26px;
          color: $theme-color;
        }

        .text {
          flex: 1;
          font-size: 14px;
          color: hsla(0,0%,100%,.5);
        }

        .clear {
          @extend .zoom-touch;

          > .iconfont {
            color: hsla(0,0%,100%,.5);
          }
        }
      }

      .list-content {
        width: 100%;
        height: 330px;
        max-height: 330px;

        .item {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;

          .current {
            display: inline-block;
            width: 20px;
            color: rgba(255,205,49,.5);
            font-size: 12px;
          }

          .text {
            flex: 1;
            color: hsla(0,0%,100%,.3);
            font-size: 14px;
            @extend .text-overflow;
          }

          .like {
            margin-right: 15px;
            color: $theme-color;
            @extend .zoom-touch;
            > .iconfont {
              font-size: 18px;
            }

            .icon-xihuan {
              color: #f0746b;
            }
          }

          .delete {
            color: $theme-color;
            @extend .zoom-touch;
            > .iconfont {
              font-size: 22px;
            }
          }
        }
      }

      .list-operate {
        width: 140px;
        margin: 20px auto 20px;

        .add {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 8px 16px;
          color: hsla(0,0%,100%,.5);
          border: 1px solid hsla(0,0%,100%,.5);
          border-radius: 100px;
          font-size: 12px;

          > .iconfont {
            position: relative;
            top: -1px;
            margin-right: 2px;
          }
        }
      }

      .list-close {
        width: 100%;
        color: hsla(0,0%,100%,.5);
        text-align: center;
        line-height: 50px;
        background-color: $theme-back-color;
      }
    }
  }

  .slide-enter, .slide-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translateY(100%)
    }
  }
  .slide-enter-active, .slide-leave-active {
    transition: all .3s;

    .list-wrapper {
      transition: all .3s
    }
  }
</style>
