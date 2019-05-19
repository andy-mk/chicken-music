class Stroage {
  constructor(key, len) {
    this.key = key
    this.len = len
    this.char = '|'
    this.init()
  }

  init() {
    this.stroage = window.localStorage
  }

  set(val) {
    if (!this.stroage) {
      return false
    }

    if (val instanceof Array) {
      this.stroage[this.key] = val.join(this.char)
    } else {
      this.stroage[this.key] = val
    }
  }

  get() {
    if (!this.stroage) {
      return false
    }

    let str = this.stroage[this.key]
    let arr = []
    if (!str) {
      arr = [0]
    } else {
      arr = str.split('|')
    }
    arr.splice(arr.length - 1, 1)
    return arr
  }

  push(val) {
    if (!this.stroage) {
      return false
    }

    let arr = this.get()
    if (arr.length >= this.len) {
      arr.pop()
    }
    arr.unshift(val)
    arr.push(arr.length)
    this.set(arr)

    return true
  }

  remove(index) {
    if (!this.stroage) {
      return false
    }

    let arr = this.get()
    arr.splice(index, 1)
    arr.push(arr.length)
    this.set(arr)
    return true
  }
}

export default Stroage
