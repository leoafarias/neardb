import { IConfig, Payload, PathList, GetOptions, IDBConfig } from './types'
import Cache from './lib/cache'

import {
  uuid,
  documentPath,
  collectionIndicesPath,
  collectionsLockPath,
  reservedKey,
  documentPathKey,
  iterationCopy,
  retry
} from './lib/utils'
import CloudStorage from './lib/cloud'
import HTTP from './lib/http'

const defaultConfig = {
  database: '',
  cacheExpiration: 500,
  indices: false,
  retries: 3
}

export default class NearDB {
  /** Config that is used to init NearDB */
  config: IDBConfig

  /** Data path that is used to interact with storage */
  path: PathList

  /** Offline cache of data */
  cache: Cache

  instanceId: string

  // TODO: cache collection data locally
  // collectionData: Payload

  adapter: CloudStorage

  // Constants used for document update
  static field = {
    deleteValue: 'NEARDB.FIELD.DELETE'
  }

  /**
   * Constructor to setup config, and path, and required checks.
   * @param config configuration to initiatlize NearDB instance
   * @param path current path of NearDB, sets to an empty array if nothing is passed
   */
  constructor(config: IConfig, path?: PathList) {
    /** Check if config exists */
    // if (!config) throw new Error('No config passed to NearDB')
    /** Overwrites config param with default configuration */
    let defaultCopy: any = iterationCopy(defaultConfig)
    this.config = Object.assign(defaultCopy, config)

    // TODO: define the type of storage in the config
    this.adapter = new CloudStorage(config)
    // Sets empty path type
    this.path = path ? path : []

    // Creates instanceid
    this.instanceId = uuid()

    // Sets default cache value
    this.cache = new Cache(this.config.cacheExpiration)
  }

  /**
   * Static method to create a new instance of NearDB class.
   * @param config configuration to initiatlize NearDB instance
   * @returns an initialized instance of NearDB with the config
   */

  static database(config: IConfig): NearDB {
    return new NearDB(Object.assign(defaultConfig, config))
  }

  /**
   * Sets a collection within the path
   * @param key expects key for collection
   * @returns an instance of NearDB with the new path and existing config
   */

  collection(key: string): NearDB {
    // Check if this is a reserved keyword
    if (reservedKey(key)) {
      throw new Error(key + ': is a reserved keyword')
    }

    // Copy value of path before passing, to avoid poluting scope
    let newPath = [...this.path]

    const lastPathIndex = newPath[newPath.length - 1]
    // Cannot get a sub-collection of a collection
    if (lastPathIndex && lastPathIndex.type === 'collection') {
      throw new Error('Only documents can have sub-collections')
    }

    newPath.push({
      type: 'collection',
      key
    })

    return new NearDB(this.config, newPath)
  }

  /**
   * Sets a doc within the path
   * @param key expects key for document
   * @returns an instance of NearDB with the new path and existing config
   */

  doc(key: string): NearDB {
    // Check if this is a reserved keyword
    if (reservedKey(key)) {
      throw new Error(key + ': is a reserved keyword')
    }
    // Copy value of path before passing, to avoid poluting this scope
    let newPath = [...this.path]

    const lastPathIndex = newPath[newPath.length - 1]
    // Cannot get a sub-collection of a collection
    if (lastPathIndex && lastPathIndex.type === 'doc') {
      throw new Error('Only collections can have documents')
    }

    newPath.push({
      type: 'doc',
      key
    })

    return new NearDB(this.config, newPath)
  }

  /**
   * Gets document data from the path provided in the scope.
   * @param options sets options on how to get documents
   * @returns payload of the document requested
   */
  async get(options?: GetOptions): Promise<object> {
    const lastPathIndex = this.path[this.path.length - 1]
    // Cannot get a sub-collection of a collection
    if (lastPathIndex && lastPathIndex.type !== 'doc') {
      throw new Error('Can only use get() method for documents')
    }

    let data: Payload
    let source = options && options.source ? options.source : null

    // Conditional if there is a cache
    let isCache = !source && this.cache.exists()
    // Conditional if its an edge
    let isEdge = this.config.cdn!.url && (source === 'edge' || !source)
    // Conditional if its from origin
    // let isOrigin = source === 'origin'

    try {
      if (isCache) return (data = this.cache.get())
      if (isEdge) return (data = await this.getFromEdge())
      return (data = await this.getFromOrigin())
    } catch (err) {
      throw err
    }
  }

  /**
   * Sets document data from the path provided in the scope.
   * @param value expects payload to be stored for the document
   * @returns payload of the document requested
   */
  async set(value: Payload): Promise<object> {
    try {
      let docPath = documentPath(this.path)
      let payload = await this.adapter.set(value, docPath)

      return payload
    } catch (err) {
      throw err
    }
  }

  /**
   * Update some fields of the document without overwriting entire document
   * @param value expects payload to be stored for the document
   * @returns a promise for the payload requested
   */
  async update(value: Payload): Promise<Payload> {
    try {
      let doc: Payload
      // Get the latest document from the origin
      doc = await this.get({ source: 'origin' })

      // Loop through all property for custom object actions
      for (let prop in value) {
        if (value[prop] === NearDB.field.deleteValue) {
          // If has deleteValue action, delete the prop
          delete value[prop]
          delete doc[prop]
        }
      }

      // Updates document
      let payload = await this.set(Object.assign(doc, value))

      // Stores payload in local cache
      this.cache.set(payload)
      return payload
    } catch (err) {
      throw err
    }
  }

  /**
   * Adds a document to a collection by generating an id for the doc
   * @param value expects payload to be stored for the document
   * @returns a promise for the payload of the saved doc
   */
  add(value: Payload): Promise<object> {
    let newPath = [...this.path]
    const lastPathIndex = newPath[newPath.length - 1]
    if (lastPathIndex && lastPathIndex.type !== 'collection') {
      throw new Error('Can only add document to collections')
    }

    newPath.push({ type: 'doc', key: uuid() })

    let docPath = documentPath(newPath)
    return this.adapter.set(value, docPath)
  }

  /**
   * Removes document store in the path of instance
   * @returns empty object
   */
  delete() {
    let newPath = [...this.path]
    let docPath = documentPath(newPath)
    return this.adapter.remove(docPath)
  }

  _privateMethods() {
    return {
      getFromEdge: this.getFromEdge.bind(this),
      collectionLock: this.collectionLock.bind(this)
    }
  }

  /**
   * Makes a get request to the CDN url
   * @param path path to attach to cdn url on the request
   * @returns json object from the request
   */

  private async getFromEdge(): Promise<Payload> {
    try {
      let http = HTTP.create({
        baseURL: this.config.cdn!.url,
        timeout: 15000,
        headers: this.config.cdn!.headers
      })

      let docPath = documentPath(this.path)
      let payload = await http.get(docPath)
      let ETag =
        payload.headers && payload.headers.ETag ? payload.headers.ETag : null
      let VersionId =
        payload.headers && payload.headers.VersionId
          ? payload.headers.VersionId
          : null
      this.cache.set(payload.data, ETag, VersionId)
      return payload.data
    } catch (err) {
      throw err
    }
  }

  private async getFromOrigin(): Promise<Payload> {
    try {
      let docPath = documentPath(this.path)
      let payload = await this.adapter.get(docPath)
      this.cache.set(payload.Body, payload.ETag, payload.VersionId)
      return payload.Body
    } catch (err) {
      throw err
    }
  }

  private async collectionLock() {
    let colPath = collectionsLockPath(this.path)
    let colLock: Payload
    let isOwner: boolean
    let lockExpired: boolean
    try {
      colLock = await this.adapter.head(colPath)
      lockExpired = colLock.LastModified + 3000 < new Date().getTime()
      if (lockExpired === true) {
        await this.adapter.copy(colPath, colLock.ETag, this.instanceId)
      }

      colLock = await this.adapter.head(colPath)
      isOwner = colLock.Metadata.instance === this.instanceId
      lockExpired = colLock.LastModified + 3000 < new Date().getTime()

      if (isOwner && lockExpired === false) {
        return true
      }

      if (lockExpired === true) {
        colLock = await this.adapter.head(colPath)
      }
    } catch (err) {
      // Could not get existing lock create it
      console.log('Creating collection lock!')
    }

    // if (isOwner && lockExpired) {
    // }

    try {
      colLock = await this.adapter.setLock(colPath, this.instanceId)
      let checkLock: Payload = await this.adapter.head(colPath)

      if (
        colLock.ETag === checkLock.ETag &&
        checkLock.Metadata.instance === this.instanceId
      ) {
        return true
      }
    } catch (err) {
      throw err
    }
  }

  /**
   * Updates indices of collection from a new document
   * @param path PathList, used to get document key and collection indices path
   * @param value value that needs to be added to indices
   * @returns a promise for the adapter put
   */
  // async updateCollectionIndices(
  //   path: PathList,
  //   value: Payload
  // ): Promise<Payload> {
  //   let collectionIndices: any
  //   // Get path where to store collection indices
  //   let indicesPath = collectionIndicesPath(path)

  //   try {
  //     // Get current collection indices
  //     collectionIndices = await this.adapter.get(indicesPath)
  //   } catch (err) {
  //     // If there are no collection indices, create one
  //     collectionIndices = {}
  //   }

  //   try {
  //     // Use document key as key in the object, and store value
  //     collectionIndices[documentPathKey(path)] = value
  //     // Save object into collection indices document
  //     return this.adapter.set(collectionIndices, indicesPath)
  //   } catch (err) {
  //     throw err
  //   }
  // }
}
