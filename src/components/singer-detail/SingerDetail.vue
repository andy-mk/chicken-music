<template>
  <div class="singer-detail">
    <ListView :title="title" :bgImage="bgImage" :songlist="songlist"></ListView>
  </div>
</template>

<script>
import { getSingerDetail } from 'api/singer'
import { Song, createSong } from 'base/js/song'
import ListView from 'components/listview/ListView'

export default {
  data() {
    return {
      title: '',
      bgImage: '',
      songlist: []
    }
  },
  methods: {
    _getSingerDetail() {
      let id = this.$route.params.id
      getSingerDetail(id)
        .then(res => {
          this.title = res.artist.name
          this.bgImage = res.artist.picUrl
          let ids = ''
          res.hotSongs.forEach((item, index) => {
            ids += (index === res.hotSongs.length - 1 ? item.id : item.id + ',')
          })
          return Song.getDetail(ids)
        })
        .then(res => {
          let songlist = []
          res.forEach((item, index) => {
            songlist.push(createSong(item))
          })
          this.songlist = songlist
        })
    }
  },
  components: {
    ListView
  },
  created() {
    this._getSingerDetail()
  }
}
</script>

<style lang="scss" scoped>
  .singer-detail {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: #333;
  }
</style>
