export function findSongIndex(id, list) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return i
    }
  }
  return -1
}

export function createRandomList(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    const random = parseInt(Math.random() * (_arr.length - 1))
    let temp = _arr[i]
    _arr[i] = _arr[random]
    _arr[random] = temp
  }

  return _arr
}

export function formatLyric(lyric) {
  let lyric_arr = lyric.split('\n')
  let lyric_format = []
  lyric_arr.forEach(item => {
    let t = item.substring(item.indexOf('[') + 1, item.indexOf(']'))
    let m = t.split(':')[0] * 60
    let s = parseFloat(t.split(':')[1])
    let count_s = (m + s).toFixed(3)
    let lyric_line = item.substring(item.indexOf(']') + 1, item.length)
    if (lyric_line === '') {
      return
    }

    lyric_format.push({
      t: count_s,
      c: lyric_line
    })
  })

  return lyric_format
}

export function formatSingerName(arr) {
  let singer = ''
  arr.forEach((item, index) => {
    index === arr.length - 1 ? singer += item.name : singer += item.name + ' / '
  })
  return singer
}
