<template>
  <div class="song-detail" ref="songDetail">
    <ListView :title="title" :bgImage="bgImage" :songlist="songlist"></ListView>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSonglistDetail } from 'api/song'
import { Song, createSong } from 'base/js/song'
import Mixin from 'base/js/mixin'
import ListView from 'components/listview/ListView'

export default {
  mixins: [Mixin],
  data() {
    return {
      title: '',
      bgImage: '',
      songlist: []
    }
  },
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  methods: {
    _getSonglistDetail() {
      let id = this.$route.params.id
      getSonglistDetail(id)
        .then(res => {
          this.title = res.name
          this.bgImage = res.coverImgUrl

          let list = res.tracks
          let ids = ''
          list.forEach((item, index) => {
            ids += (index === list.length - 1 ? item.id : item.id + ',')
          })

          return Song.getDetail(ids)
        })
        .then((res) => {
          let songlist = []
          res.forEach((item, index) => {
            songlist.push(createSong(item))
          })
          this.songlist = songlist
        })
    }
  },
  watch: {
    playlist() {
      this._resetScroll(this.playlist, this.$refs.songDetail)
    }
  },
  components: {
    ListView
  },
  created() {
    this._getSonglistDetail()
  },
  mounted() {
    this._resetScroll(this.playlist, this.$refs.songDetail)
  }
}
</script>

<style lang="scss" scoped>
  .song-detail {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: #333;
  }
</style>
