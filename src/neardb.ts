import { IConfig, Payload, Cache, PathList, GetOptions } from './types'
import { uuid, documentPath, reservedKey } from './utils'
import CloudStorage from './cloud'
import axios from 'axios'

const defaultConfig = {
  database: '',
  cacheExpiration: 500
}

export default class NearDB {
  /** Config that is used to init NearDB */
  config: IConfig

  /** Data path that is used to interact with storage */
  path: PathList

  /** Offline cache of data */
  cache: Cache | null

  adapter: any

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
    if (!config) throw new Error('No config passed to NearDB')

    /** Overwrites config param with default configuration */
    this.config = Object.assign(defaultConfig, config)

    // TODO: define the type of storage in the config
    this.adapter = new CloudStorage(config)
    // Sets empty path type
    this.path = path ? path : []

    // Sets default cache value
    this.cache = null
  }

  /**
   * Static method to create a new instance of NearDB class.
   * @param config configuration to initiatlize NearDB instance
   * @returns an initialized instance of NearDB with the config
   */

  static database(config: IConfig): NearDB {
    return new NearDB(config)
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

    let docPath = documentPath(this.path)
    let data: Payload
    let source = options && options.source ? options.source : null

    try {
      // Get document from the if there is a CDN endpoint
      if (!source && this.hasCache()) {
        // Get from in memory storage if no cahce get from origin
        data = this.getStore()
      } else if (source === 'origin') {
        // Source as origin
        data = await this.adapter.get(docPath)
        this.setCache(data)
      } else if (
        // Edge and has cdn endpoint
        source === 'edge' &&
        this.config.cdn!.url
      ) {
        // Get it from cloud storage
        let payload = await this.getRequest(docPath)
        data = payload.data
        this.setCache(data)
      } else {
        data = await this.adapter.get(docPath)
        this.setCache(data)
      }

      return data
    } catch (err) {
      throw err
    }
  }

  /**
   * Sets document data from the path provided in the scope.
   * @param value expects payload to be stored for the document
   * @returns payload of the document requested
   */
  set(value: Payload): Promise<object> {
    let docPath = documentPath(this.path)

    return this.adapter.put(value, docPath)
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
      this.setCache(payload)
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
    return this.adapter.put(value, docPath)
  }

  /**
   * Removes document store in the path of instance
   * @returns empty object
   */
  delete() {
    let newPath = [...this.path]
    let docPath = documentPath(newPath)
    return this.adapter.delete(docPath)
  }

  _privateMethods(): object {
    return {
      setCache: this.setCache.bind(this),
      hasCache: this.hasCache.bind(this),
      getRequest: this.getRequest.bind(this),
      clearCache: this.clearCache.bind(this),
      getCache: this.getCache.bind(this)
    }
  }

  /**
   * Makes a get request to the CDN url
   * @param path path to attach to cdn url on the request
   * @returns json object from the request
   */

  private async getRequest(path: string, baseURL?: string): Promise<Payload> {
    try {
      let http = axios.create({
        baseURL: baseURL ? baseURL : this.config.cdn!.url,
        timeout: 15000,
        headers: baseURL ? {} : this.config.cdn!.headers
      })

      let payload = await http.get(path)

      return payload
    } catch (err) {
      throw err
    }
  }

  /**
   * Stores payload in NearDB instance
   * @param data payload to store in memory
   */
  private setCache(data: Payload): void {
    let expiration =
      this.config && this.config.cacheExpiration
        ? this.config.cacheExpiration
        : 1000

    this.cache = {
      store: data,
      expires: new Date().getTime() + expiration
    }
  }

  /**
   * Gets cached data
   * @returns payload of the cached data if it exists
   */
  private getCache(): Cache | null {
    return this.cache
  }

  private clearCache(): void {
    this.cache = null
  }

  private getStore(): Payload {
    return this.cache && this.cache.store ? this.cache.store : {}
  }

  /**
   * Checks if there a valid cached payload
   * @returns boolean
   */
  private hasCache(): boolean {
    let cache = this.getCache()
    if (cache && cache.store && cache.expires > new Date().getTime()) {
      // Checks if there is a stored object, and that has not expired yet
      return true
    } else {
      // Sets cache to default value
      this.clearCache()
      return false
    }
  }
}
