import { domain } from 'api/config'
import Stroage from './stroage'
import axios from 'axios'

// eslint-disable-next-line
const stroage = new Stroage('like')

class Song {
  constructor({ id, name, singer, image, duration, like }) {
    this.id = id
    this.name = name
    this.singer = singer
    this.image = image
    this.duration = duration
    this.like = like
  }

  getUrl() {
    return axios.get(`${domain}/song/url?id=${this.id}`).then(res => {
      let url = res.data.data[0].url
      return url
    })
  }

  getLyric() {
    return axios.get(`${domain}/lyric?id=${this.id}`).then(res => {
      if (res.data.nolyric) {
        return ''
      }
      let lyric = res.data.lrc.lyric
      return lyric
    })
  }
}

Song.getDetail = function(id) {
  return axios.get(`${domain}/song/detail?ids=${id}`).then(res => {
    return res.data.songs
  })
}

function filterName(arr) {
  let singer = ''
  arr.forEach((item, index) => {
    index === arr.length - 1 ? singer += item.name : singer += item.name + ' / '
  })
  return singer
}

function like(id) {
  let arr = stroage.get()
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === id.toString()) {
      return true
    }
  }
  return false
}

function createSong(data) {
  return new Song({
    id: data.id,
    name: data.name,
    singer: filterName(data.ar),
    image: data.al.picUrl,
    duration: data.dt / 1000,
    like: like(data.id)
  })
}

export {
  Song,
  createSong
}
