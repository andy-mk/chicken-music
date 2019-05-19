<template>
  <div class="rank" ref="rank">
    <Scroll :data="ranklist" ref="scroll">
      <Loading v-show="reqCount <= 6"></Loading>
      <ul class="item-wrapper">
        <li :key="item.id" v-for="item of ranklist" class="rank-item" @click="selectItem(item.id)">
          <div class="img-wrapper">
            <img class="img" :src="_getSmallImage(item.coverImgUrl)" />
          </div>
          <ul class="songlist-wrapper">
            <li class="songlist" :key="index" v-for="(songItem, index) of item.tracks">
              <span>{{ index + 1 + '.'}}</span>
              <span>{{ songItem.name + ' - ' + formatSingName(songItem.ar) }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </Scroll>

    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import rank from 'api/rank'
import { playlistMixin } from 'base/js/mixin'

import Scroll from 'components/scroll/Scroll'
import Loading from 'components/loading/Loading'

export default {
  mixins: [playlistMixin],
  data() {
    return {
      reqCount: 0,
      ranklist: []
    }
  },
  methods: {
    request(req) {
      req().then(res => {
        this.ranklist.push({
          id: res.id,
          coverImgUrl: res.coverImgUrl,
          tracks: res.tracks.splice(0, 3)
        })
        this.reqCount += 1
      })
    },
    selectItem(id) {
      this.$router.push(`/rank/${id}`)
    },
    formatSingName(arr) {
      let singer = ''
      arr.forEach((item, index) => {
        index === arr.length - 1 ? singer += item.name : singer += item.name + ' / '
      })
      return singer
    },
    handlePlaylist(playlist) {
      let bottom = playlist.length > 0 ? '60px' : '0'
      this.$refs.rank.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getData() {
      this.request(rank.getHot)
      this.request(rank.getOriginal)
      this.request(rank.getNewsong)
      this.request(rank.getSoaring)
      this.request(rank.getMusic)
      this.request(rank.getTalksing)
      this.request(rank.getElectric)
    },
    _getSmallImage(url) {
      return url + '?param=140y140&type=webp'
    }
  },
  components: {
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

  .rank {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;

    .loading {
      padding-top: 20px;
    }

    .item-wrapper {
      padding-bottom: 20px;
    }

    .rank-item {
      display: flex;
      flex-direction: row;
      height: 100px;
      padding-top: 20px;
      margin: 0 20px;

      .img-wrapper {
        width: 100px;

        .img {
          width: 100%;
          height: 100%;
        }
      }

      .songlist-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        height: 100px;
        padding: 0 20px;
        background-color: #333;
        overflow: hidden;

        .songlist {
          line-height: 26px;
          font-size: 12px;
          color: hsla(0,0%,100%,.3);
          @extend .text-overflow
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
