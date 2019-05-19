import axios from 'axios'
import { domain } from './config'

export function getSonglistDetail(id) {
  return axios.get(domain + `/playlist/detail?id=${id}`).then(res => {
    return res.data.playlist
  })
}
