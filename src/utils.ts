import { PathList } from './types'

export function documentPath(path: PathList) {
  let pathArray = path.map((item, index) => {
    if (path.length === index + 1) {
      // This is the last item
      if (item.type === 'doc') return item.key + '.json'
      // if (item.type === 'collection') return item.key + '.json'
      return item.key
    } else {
      // not the last item
      return item.key
    }
  })

  return pathArray.join('/')
}

export function reservedKey(keyword: string) {
  const reservedKeyWords: { [key: string]: boolean } = {
    _meta: true,
    collection: true,
    doc: true,
    indices: true
  }

  if (reservedKeyWords[keyword]) {
    return true
  } else {
    return false
  }
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0

    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
