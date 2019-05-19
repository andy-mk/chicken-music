import axios from 'axios'
import { domain } from './config'

export function getBanner() {
  return axios.get(domain + '/banner').then((res) => {
    return res.data
  })
}

export function getHotMenu() {
  return axios.get(domain + '/personalized').then((res) => {
    return res.data.result
  })
}

export function getHotSong() {
  return axios.get(domain + '/personalized/newsong').then((res) => {
    return res.data.result
  })
}

export function getPlaylistDetail(id) {
  return axios.get(domain + `/playlist/detail?id=${id}`).then(res => {
    return res.data.playlist
  })
}
