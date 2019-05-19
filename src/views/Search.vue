<template>
  <transition name="slide">
    <div class="search">
      <!-- 头部 -->
      <div class="header">
        <h2 class="title">搜 索</h2>
        <div class="back" @click="back">
          <i class="iconfont icon-fanhui"></i>
        </div>
      </div>
      <!-- 搜索框区域 -->
      <div class="search-box-wrapper">
        <div class="search-box">
          <i class="iconfont icon-chaxun"></i>
          <input class="box" v-model="keyword" placeholder=" 搜索歌曲、歌手" type="text" />
          <i class="iconfont icon-cha" v-show="keyword.length" @click="clearContent"></i>
        </div>
      </div>
      <!-- 滚动区域 -->
      <div class="scroll-container" ref="scrollCon">
        <!-- 搜索关键字快捷 -->
        <div class="search-shortcut">
          <Scroll :data="this.hots" ref="scroll_one">
            <div class="search-hot" v-show="this.hots.length">
              <h2 class="title">热门搜索</h2>
              <ul class="list">
                <li class="item" v-for="(item, index) in hots" :key="index" @click="selectHotShortcut(index)">
                  <span>{{ item.first }}</span>
                </li>
              </ul>
            </div>
            <div class="search-history" v-show="this.history.length">
              <h2 class="title">
                <span class="text">搜索历史</span>
                <span class="clear" @click="confirm"><i class="iconfont icon-lajitong"></i></span>
              </h2>
              <ul class="list">
                <li class="item" v-for="(item, index) in history" :key="index" @click="selectHistoryShortcut(index)">
                  <span class="name">{{ item }}</span>
                  <span class="remove" @click.stop="remove(index)">
                    <i class="iconfont icon-cha"></i>
                  </span>
                </li>
              </ul>
            </div>
          </Scroll>
        </div>
        <!-- 搜索出来的内容 -->
        <div class="search-content" v-show="keyword.length">
          <Scroll :data="searchData" ref="scroll_two">
            <Loading v-show="searching"></Loading>
            <div class="recommend" v-show="recommendSinger.id || recommendPlaylist.id">
              <p class="title">最佳匹配</p>
              <div class="singer" v-show="recommendSinger.id" @click="selectSinger">
                <img class="image" :src="recommendSinger.image" />
                <span class="name">歌手：{{ recommendSinger.name }}</span>
              </div>
              <div class="playlist" v-show="recommendPlaylist.id" @click="selectPlaylist">
                <img class="image" :src="recommendPlaylist.image" />
                <span class="name">歌单：{{ recommendPlaylist.name }}</span>
              </div>
            </div>
            <ul class="songlist">
              <li class="item" v-for="(item, index) in this.searchData" :key="item.id" @click="selectSong(index)">
                <p class="name">{{ item.name }}</p>
                <p class="singer">{{ _formatSingerName(item.artists) }}</p>
              </li>
            </ul>
          </Scroll>
        </div>
      </div>

      <!-- 弹窗 -->
      <Confirm :hint="'所有搜索历史'" v-show="tabWin" @clear="clear" @cancel="cancel"></Confirm>

      <transition name="router">
        <router-view class="router-view"></router-view>
      </transition>
    </div>
  </transition>
</template>

<script>
import Singer from 'base/js/singer'
import Stroage from 'base/js/stroage'
import { playlistMixin } from 'base/js/mixin'
import { mapGetters, mapActions } from 'vuex'
import { Song, createSong } from 'base/js/song'
import { formatSingerName } from 'base/js/util'
import { getSearchHot, getSearchData, getSearchRecommend } from 'api/search'

import Scroll from 'components/scroll/Scroll'
import Confirm from 'components/confirm/Confirm'
import Loading from 'components/loading/Loading'

const stroage = new Stroage('history', 15)

export default {
  mixins: [playlistMixin],
  data() {
    return {
      keyword: '',
      tabWin: false,
      searching: false,
      hots: [],
      history: [],
      searchData: [],
      recommendSinger: {},
      recommendPlaylist: {},
      empty: false
    }
  },
  computed: {
    ...mapGetters([
      'playlist',
      'currentIndex',
      'sequenceList'
    ])
  },
  methods: {
    ...mapActions([
      'setFullScreen',
      'setCurrentSong',
      'setPlaylist',
      'setSequenceList',
      'setCurrentIndex'
    ]),
    back() {
      this.$router.back()
      this.keyword = ''
    },
    clear() {
      this.history = []
      this.tabWin = false
    },
    cancel() {
      this.tabWin = false
    },
    confirm() {
      this.tabWin = true
    },
    remove(index) {
      this._removeHistory(index)
      this.history = stroage.get()
    },
    clearContent() {
      this.keyword = ''
      this.searchData = []
    },
    selectHotShortcut(index) {
      this.keyword = this.hots[index].first
    },
    selectHistoryShortcut(index) {
      this.keyword = this.history[index]
    },
    selectSong(index) {
      let id = this.searchData[index].id
      this._getSongDetail(id)
      this._pushHistory()
    },
    selectSinger() {
      this.$router.push(`/search/singer/${this.recommendSinger.id}`)
      this._pushHistory()
    },
    selectPlaylist() {
      this.$router.push(`/search/playlist/${this.recommendPlaylist.id}`)
      this._pushHistory()
    },
    handlePlaylist(playlist) {
      let bottom = this.playlist.length > 0 ? '60px' : '0'
      this.$refs.scrollCon.style.bottom = bottom
      this.$refs.scroll_one.refresh()
      this.$refs.scroll_two.refresh()
    },
    _formatSingerName(list) {
      return formatSingerName(list)
    },
    _getData() {
      getSearchHot().then(res => {
        this.hots = res.hots
      })
      this.history = stroage.get()
    },
    _searchData(keyword) {
      Promise.all([getSearchData(keyword), getSearchRecommend(keyword)]).then(res => {
        if (this.empty) {
          return
        }

        this.searchData = res[0]

        let singer = {}
        if (res[1].artists) {
          singer = res[1].artists[0]
        }
        let playlist = {}
        if (res[1].playlists) {
          playlist = res[1].playlists[0]
        }
        this.recommendSinger = new Singer({
          id: singer.id,
          name: singer.name,
          image: singer.picUrl + '?param=140y140&type=webp'
        })
        this.recommendPlaylist = {
          id: playlist.id,
          name: playlist.name,
          image: playlist.coverImgUrl + '?param=140y140&type=webp'
        }

        this.searching = false
      })
    },
    _getSongDetail(id) {
      Song.getDetail(id).then(res => {
        let song = createSong(res[0])
        this._setSong(song)
      })
    },
    _setSong(song) {
      this.setSequenceList([song])
      this.setPlaylist(this.sequenceList)
      this.setCurrentIndex(0)
      this.setCurrentSong(this.playlist[this.currentIndex])
      this.setFullScreen(true)
    },
    _clearData() {
      this.searchData = []
      this.recommendSinger = {}
      this.recommendPlaylist = {}
      this.empty = true
      clearTimeout(this.timer)
    },
    _pushHistory() {
      let arr = stroage.get()
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === this.keyword) {
          stroage.remove(i)
          break
        }
      }
      stroage.push(this.keyword)
      this.history = stroage.get()
    },
    _removeHistory(index) {
      stroage.remove(index)
    }
  },
  watch: {
    keyword(val) {
      if (val.length === 0 || val === '' || val === ' ') {
        this.searching = false
        this._clearData()
        return
      }

      this.empty = false
      this.searching = true
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this._searchData(val)
      }, 500)
    }
  },
  components: {
    Scroll,
    Confirm,
    Loading
  },
  created() {
    this._getData()
  }
}
</script>

<style lang="scss" scoped>
  @import 'base/styles/variable.scss';

  .search {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: $theme-back-color;

    .header {
      height: 40px;

      .title {
        width: 70%;
        height: 40px;
        margin: 0 auto;
        color: #ffffff;
        line-height: 40px;
        text-align: center;
        @extend .text-overflow
      }

      .back {
        position: absolute;
        top: 0;
        left: 0;
        width: 40px;
        line-height: 40px;
        text-align: center;

        .iconfont {
          color: $theme-color;
          font-size: 20px;
          font-weight: bold;
        }
      }
    }

    .search-box-wrapper {
      margin: 20px;

      .search-box {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        height: 40px;
        padding: 0 6px;
        background-color: #333;
        border-radius: 6px;
        box-sizing: border-box;

        .icon-chaxun {
          position: relative;
          top: 2px;
          font-size: 20px;
          color: black;
          margin-left: 5px;
        }

        .box {
          flex: 1;
          font-size: 14px;
          line-height: 18px;
          border: none;
          outline: none;
          margin: 0 5px;
          color: #ffffff;
          background-color: #333;
        }

        .icon-cha {
          font-size: 24px;
          color: black;
        }
      }
    }

    .scroll-container {
      position: absolute;
      top: 120px;
      bottom: 0;
      width: 100%;
    }

    .search-shortcut {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 100%;

      .search-hot {
        margin: 0 20px;

        .title {
          height: 44px;
          line-height: 44px;
          font-size: 14px;
          color: hsla(0,0%,100%,.5);
        }

        .list {

          .item {
            display: inline-block;
            padding: 5px 10px;
            font-size: 14px;
            color: hsla(0,0%,100%,.3);
            background-color: #333;
            border-radius: 6px;
            margin: 0 10px 10px 0;
          }
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;
        flex: 1;

        .title {
          display: flex;
          align-items: center;
          height: 44px;
          font-size: 14px;
          color: hsla(0,0%,100%,.5);

          .text {
            flex: 1;
          }

          .clear {
            font-size: 20px;
            margin-right: 10px;
            @extend .zoom-touch
          }
        }

        .list {
          padding-bottom: 16px;

          .item {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 35px;
            color: hsla(0,0%,100%,.5);
          }

          .name {
            flex: 1;
            font-size: 14px;
          }

          .remove {
            font-size: 20px;
            margin-right: 10px;
            @extend .zoom-touch
          }
        }
      }
    }

    .search-content {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 1;
      background-color: $theme-back-color;

      .recommend {
        padding: 0 20px;

        .title {
          padding-bottom: 6px;
          font-size: 12px;
          color: $theme-color;
        }

        .singer, .playlist {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 10px 0;

          .image {
            width: 50px;
            height: 50px;
            margin-right: 15px;
          }

          .name {
            font-size: 14px;
            color: hsla(0,0%,100%,.5);
          }
        }
      }

      .songlist {
        padding: 0 20px 20px 20px;

        .item {
          padding: 10px 0;
          overflow: hidden;

          .name {
            padding-bottom: 10px;
            font-size: 14px;
            color: #fff;
            @extend .text-overflow;
          }

          .singer {
            font-size: 12px;
            color: hsla(0,0%,100%,.3);
            @extend .text-overflow;
          }
        }
      }
    }

    .router-view {
      z-index: 2;
    }
  }

  .slide-enter, .slide-leave-to {
    opacity: 0;
    transform: translateX(50%)
  }
  .slide-enter-active, .slide-leave-active {
    transition: all .4s;
  }

  .router-enter, .router-leave-to {
    opacity: 0;
    transform: translate3d(50%, 0, 0)
  }
  .router-enter-active, .router-leave-active {
    transition: all .4s;
  }
</style>
