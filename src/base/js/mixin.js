import { mapGetters } from 'vuex'

export default {
  methods: {
    _resetScroll(list, scroll) {
      if (!scroll) {
        return
      }
      if (list.length > 0) {
        scroll.style.bottom = '60px'
      } else {
        scroll.style.bottom = 0
      }
    }
  }
}

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('未实现handlePlaylist方法')
    }
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  }
}
