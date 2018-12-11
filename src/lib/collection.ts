import NearDB from '../neardb'
import { PathList, BaseEntity, Payload } from '../types'
import { reservedKey, uuid, documentPath, collectionIndicesPath } from './utils'
import Document from './document'

export default class Collection implements BaseEntity {
  readonly path: PathList
  readonly dbPath: string
  readonly instance: NearDB

  constructor(instance: NearDB, key: string, path: PathList) {
    // Check if this is a reserved keyword
    if (reservedKey(key)) {
      throw new Error(key + ': is a reserved keyword')
    }

    this.instance = instance

    // Copy value of path before passing, to avoid poluting scope
    let newPath = [...path]

    newPath.push({
      type: 'collection',
      key
    })

    this.path = newPath
    this.dbPath = documentPath(this.path)
  }

  doc(key: string) {
    return new Document(this.instance, key, this.path)
  }

  /**
   * Adds a document to a collection by generating an id for the doc
   * @param value expects payload to be stored for the document
   * @returns a promise for the payload of the saved doc
   */
  add(value: Payload): Promise<object> {
    return new Document(this.instance, uuid(), this.path).set(value)
  }
}
