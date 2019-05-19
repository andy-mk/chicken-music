import { playMode } from 'components/player/config'

const state = {
  playing: false,
  playlist: [],
  sequenceList: [],
  currentSong: {},
  currentIndex: -1,
  fullScreen: false,
  playMode: playMode.sequence
}

export default state
