<template>
  <div class="recommend">
    <div class="scroll-container" ref="scrollContainer">
      <Scroll :data="hotSong" ref="scroll">
        <div class="slider-container" ref="sliderContainer">
          <Slider :data="banners" ref="slider">
            <div
              class="slider-item"
              :key="index"
              v-for="(item, index) of banners">
                <img class="item-img" :src="item.imageUrl" />
              </div>
          </Slider>
        </div>
        <div class="hot-playlist">
          <h2 class="title">热门歌单推荐</h2>
          <ul class="list-wrapper">
            <li class="item" :key="item.id" v-for="item of hotMenu" @click="selectPlaylistItem(item)">
              <img class="item-img" v-lazy="_getSmallImage(item.picUrl)" />
              <h3 class="item-title">{{ item.name }}</h3>
              <span class="play-count">
                {{ playCount(item.playCount) }}
              </span>
            </li>
          </ul>
          <Loading v-show="!hotMenu.length"></Loading>
        </div>
        <div class="hot-song">
          <h2 class="title">热门歌曲推荐</h2>
          <ul class="list-wrapper">
            <li class="item" :key="item.id" v-for="(item,index) of hotSong" @click="selectSongItem(index)">
              <img class="item-img" v-lazy="_getSmallImage(item.song.album.picUrl)" />
              <span class="song-name">{{ item.name }}</span>
              <span class="singer">{{ item.song.artists[0].name }}</span>
            </li>
          </ul>
          <Loading v-show="!hotSong.length"></Loading>
        </div>
      </Scroll>
    </div>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Slider from 'components/slider/Slider'
import Scroll from 'components/scroll/Scroll'
import Loading from 'components/loading/Loading'

import { createSong, Song } from 'base/js/song'
import { mapActions } from 'vuex'
import { getBanner, getHotMenu, getHotSong } from 'api/recommend'
import { playlistMixin } from 'base/js/mixin'

export default {
  mixins: [playlistMixin],
  data() {
    return {
      banners: [],
      hotMenu: [],
      hotSong: []
    }
  },
  methods: {
    ...mapActions([
      'setFullScreen',
      'setPlaylist',
      'setCurrentIndex',
      'setCurrentSong',
      'setSequenceList'
    ]),
    playCount(count) {
      return parseInt(count / 1000) + '万'
    },
    selectSongItem(index) {
      let ids = ''
      this.hotSong.forEach((item, index) => {
        if (index === this.hotSong.length - 1) {
          ids += item.id
        } else {
          ids += item.id + ','
        }
      })

      this.setFullScreen(true)
      Song.getDetail(ids).then(res => {
        if (!res) return
        let playlist = []
        res.forEach(item => {
          playlist.push(createSong(item))
        })
        return playlist
      }).then(playlist => {
        this.setPlaylist(playlist)
        this.setSequenceList(playlist)
        this.setCurrentIndex(index)
        this.setCurrentSong(playlist[index])
      })
    },
    selectPlaylistItem(item) {
      this.$router.push(`/recommend/${item.id}`)
    },
    handlePlaylist(playlist) {
      let bottom = this.playlist.length > 0 ? '60px' : '0'
      this.$refs.scrollContainer.style.bottom = bottom
      this.$refs.slider.refresh()
      this.$refs.scroll.refresh()
    },
    _getData() {
      const promise = [getBanner(), getHotMenu(), getHotSong()]
      Promise.all(promise).then((arr) => {
        this.banners = arr[0].banners.splice(0, 5)
        this.hotMenu = arr[1]
        this.hotSong = arr[2].splice(0, 9)
      })
    },
    _getSmallImage(url) {
      return url + '?param=140y140&type=webp'
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created() {
    this._getData()
  }
}
</script>

<style lang="scss" scoped>
  @import 'base/styles/variable.scss';

  .recommend {
    color: $theme-color;

    .slider-container {
      position: relative;
      width: 100%;
      overflow: hidden;

      .slider-item {
        display: inline-block;

        .item-img {
          width: 100%;
        }
      }
    }

    .hot-playlist, .hot-song {
      .title {
        height: 65px;
        line-height: 65px;
        font-size: 14px;
        text-align: center;
      }

      .list-wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        box-sizing: padding-box;
        justify-content: space-evenly;
        margin-bottom: -10px;

        .item {
          position: relative;
          width: 100px;
          height: 150px;
          margin-left: 1%;
          margin-right: 1%;
          margin-bottom: 10px;
          color: hsla(0,0%,100%,.9);

          .item-img {
            width: 100%;
            border-radius: 4px;
          }

          .item-title {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            overflow: hidden;
            font-size: 12px;
            line-height: 14px;
            text-overflow: ellipsis;
          }

          .play-count {
            position: absolute;
            top: 4px;
            right: 4px;
            display: block;
            font-size: 12px;
          }

          .song-name {
            display: block;
            font-size: 14px;
            line-height: 22px;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .singer {
            display: block;
            font-size: 12px;
            line-height: 18px;
            color: hsla(0,0%,100%,.3);
          }
        }
      }
    }
  }

  .scroll-container {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }

  .slide-enter, .slide-leave-to {
    opacity: 0;
    transform: translate3d(50%, 0, 0)
  }
  .slide-enter-active, .slide-leave-active {
    transition: all .4s;
  }
</style>
