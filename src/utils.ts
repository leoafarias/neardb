import { PathItem } from './types'

// export function traversePath(key: string) {
//   const list = path.key.split('/')
//   if (!list[0]) list.shift()
//   if (!list[list.length - 1]) list.pop()
//   return list
// }

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0

    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
