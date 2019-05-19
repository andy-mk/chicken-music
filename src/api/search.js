import axios from 'axios'
import { domain } from './config'

export function getSearchHot() {
  return axios.get(`${domain}/search/hot`).then(res => {
    return res.data.result
  })
}

export function getSearchData(keyword) {
  return axios.get(`${domain}/search?keywords=${keyword}`).then(res => {
    return res.data.result.songs
  })
}

export function getSearchRecommend(keyword) {
  return axios.get(`${domain}/search/suggest?keywords=${keyword}`).then(res => {
    return res.data.result
  })
}
