import axios from 'axios'
import { domain } from './config'

export function getSingerList() {
  return axios.get(`${domain}/top/artists?limit=100`).then(res => {
    return res.data.artists
  })
}

export function getSingerDetail(id) {
  return axios.get(`${domain}/artists?id=${id}`).then(res => {
    return res.data
  })
}
