const getters = {
  fullScreen(state) {
    return state.fullScreen
  },
  currentIndex(state) {
    return state.currentIndex
  },
  playlist(state) {
    return state.playlist
  },
  playing(state) {
    return state.playing
  },
  playMode(state) {
    return state.playMode
  },
  randomList(state) {
    return state.randomList
  },
  currentSong(state) {
    return state.currentSong
  },
  sequenceList(state) {
    return state.sequenceList
  }
}

export default getters
