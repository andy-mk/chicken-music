import axios from 'axios'
import { domain } from './config'

function getRank(id) {
  return function() {
    return axios.get(`${domain}/top/list?idx=${id}`).then(res => {
      return res.data.playlist
    })
  }
}

const rank = {
  getHot: getRank(1),
  getOriginal: getRank(2),
  getNewsong: getRank(0),
  getSoaring: getRank(3),
  getMusic: getRank(22),
  getTalksing: getRank(23),
  getElectric: getRank(4)
}

export default rank
