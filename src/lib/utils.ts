import { PathList } from '../types'

/**
 * Builds a document url out of the array of path item
 * @param path an array of the path, to build final url
 * @returns string of the final path with extension of the document
 */
export function documentPath(path: PathList): string {
  let pathArray = path.map((item, index) => {
    if (path.length === index + 1) {
      // This is the last item
      if (item.type === 'doc') {
        return item.key + '.json'
      } else {
        // if (item.type === 'collection') return item.key + '.json'
        return item.key
      }
    } else {
      // not the last item
      return item.key
    }
  })

  return pathArray.join('/')
}

/**
 * Check if key that is used for document or collection is reserved
 * @param keyword to check
 * @returns true if its a reserved key
 */
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

/**
 * Creates a random uuid
 * @returns an uuid
 */
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0

    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
