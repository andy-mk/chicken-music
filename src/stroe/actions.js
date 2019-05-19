import type from './mutations-type'

const actions = {
  setFullScreen({ commit }, value) {
    commit(type.SET_FULL_SCREEN, value)
  },
  setPlaylist({ commit }, list) {
    commit(type.SET_PLAYLIST, list)
  },
  setCurrentIndex({ commit }, index) {
    commit(type.SET_CURRENT_INDEX, index)
  },
  setPlaying({ commit }, value) {
    commit(type.SET_PLAYING, value)
  },
  setPlayMode({ commit }, mode) {
    commit(type.SET_PLAYMODE, mode)
  },
  setCurrentSong({ commit }, song) {
    commit(type.SET_CURRENT_SONG, song)
  },
  setSequenceList({ commit }, list) {
    commit(type.SET_SEQUENCE_LIST, list)
  },
  updateSequenceList({ commit }, item) {
    commit(type.UPDATE_SEQUENCE_LIST, item)
  },
  updatePlaylist({ commit }, item) {
    commit(type.UPDATE_PLAYLIST, item)
  }
}

export default actions
