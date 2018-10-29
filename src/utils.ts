import { PathItem, PathList } from './types'

// export function traversePath(key: string) {
//   const list = path.key.split('/')
//   if (!list[0]) list.shift()
//   if (!list[list.length - 1]) list.pop()
//   return list
// }

export function buildPath(path: PathList) {
  let pathArray = path.map((item, index) => {
    if (path.length === index + 1) {
      // This is the last item
      if (item.type === 'document') return item.key + '.json'
      return item.key
    } else {
      // not the last item
      return item.key
    }
  })

  return pathArray.join('/')
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0

    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
