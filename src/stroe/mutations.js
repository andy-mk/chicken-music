import type from './mutations-type'

const mutations = {
  [type.SET_FULL_SCREEN](state, value) {
    state.fullScreen = value
  },
  [type.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [type.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [type.SET_PLAYING](state, value) {
    state.playing = value
  },
  [type.SET_PLAYMODE](state, mode) {
    state.playMode = mode
  },
  [type.SET_CURRENT_SONG](state, song) {
    state.currentSong = song
  },
  [type.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [type.UPDATE_PLAYLIST](state, item) {

  }
}

export default mutations
