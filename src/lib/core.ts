import {
  IConfig,
  PathList,
  IDBConfig,
  BaseEntity,
  GetOptions,
  Payload
} from '../types'

import {
  CloudStorage,
  uuid,
  HTTP,
  Cache,
  reservedKey,
  documentPath,
  checkValidObject
} from '../internal'

const defaultConfig = {
  database: '',
  cacheExpiration: 500,
  indices: false,
  retries: 3
}

export class NearDB {
  /** Config that is used to init NearDB */
  config: IDBConfig

  /** UUID of Instance of NearDB */
  instanceId: string

  adapter: CloudStorage

  // Constants used for document update
  static field = {
    deleteValue: 'NEARDB.FIELD.DELETE'
  }

  /**
   * Constructor to setup config, and path, and required checks.
   * @param config configuration to initiatlize NearDB instance
   */
  constructor(config: IConfig) {
    /** Check if config exists */

    /** Overwrites config param with default configuration */
    this.config = {
      ...defaultConfig,
      ...config
    }

    // TODO: define the type of storage in the config
    this.adapter = new CloudStorage(this.config)

    // Creates instanceid
    this.instanceId = uuid()
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
   * Returns a new instance of collection
   * @param key expects key for collection
   * @returns an instance of the collection class
   */

  collection(key: string): Collection {
    return new Collection(this, key)
  }
}

export class Collection implements BaseEntity {
  readonly path: PathList
  readonly dbPath: string
  readonly instance: NearDB

  constructor(instance: NearDB, key: string, path?: PathList) {
    // Check if this is a reserved keyword
    if (reservedKey(key)) {
      throw new Error(key + ': is a reserved keyword')
    }

    this.instance = instance

    // Copy value of path before passing, to avoid poluting scope
    let newPath = path ? [...path] : []

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

export class Document implements BaseEntity {
  /** Data path that is used to interact with storage */
  readonly path: PathList

  /** Instance of NearDB with all the configuration and env settings */
  readonly instance: NearDB

  /** Offline cache of data */
  readonly cache: Cache

  /** String path for storage */
  readonly dbPath: string

  constructor(instance: NearDB, key: string, path: PathList) {
    // Check if this is a reserved keyword
    if (reservedKey(key)) {
      throw new Error(key + ': is a reserved keyword')
    }

    // Copy value of path before passing, to avoid poluting scope
    let newPath = [...path]

    // Push new pathItem into the path array
    newPath.push({
      type: 'document',
      key
    })

    this.path = newPath
    this.dbPath = documentPath(this.path)
    this.instance = instance

    // Sets default cache value
    this.cache = new Cache(this.instance.config.cacheExpiration)
  }

  /**
   * Creates a new instance of Collection
   * @param key expects key for collection
   * @returns an instance of the collection class
   */
  collection(key: string) {
    return new Collection(this.instance, key, this.path)
  }

  /**
   * Sets document data from the path provided in the scope.
   * @param value expects payload to be stored for the document
   * @returns payload of the document requested
   */
  async set(value: Payload): Promise<object> {
    try {
      checkValidObject(value)
      let payload = await this.instance.adapter.set(value, this.dbPath)
      return payload
    } catch (err) {
      throw err
    }
  }

  /**
   * Gets document data from the path provided in the scope.
   * @param options sets options on how to get documents
   * @returns payload of the document requested
   */
  async get(options?: GetOptions): Promise<object> {
    let data: Payload
    let config = this.instance.config
    let source = options && options.source ? options.source : null
    let cdnUrl = config && config.cdn && config.cdn.url

    // Conditional if there is a cache
    let isCache = source === null && this.cache.exists()
    // Conditional if its an edge
    let isEdge = cdnUrl && (source === 'edge' || source === null)
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
      let payload = await this.set({
        ...doc,
        ...value
      })

      // Stores payload in local cache
      this.cache.set(payload)
      return payload
    } catch (err) {
      throw err
    }
  }

  /**
   * Removes document store in the path of instance
   * @returns empty object
   */
  delete() {
    return this.instance.adapter.remove(this.dbPath)
  }

  /**
   * Makes a get request to the CDN url
   * @param path path to attach to cdn url on the request
   * @returns json object from the request
   */

  private async getFromEdge(): Promise<Payload> {
    try {
      let http = HTTP.create({
        baseURL: this.instance.config.cdn!.url,
        timeout: 15000,
        headers: this.instance.config.cdn!.headers
      })

      let payload = await http.get(this.dbPath)

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
      let payload = await this.instance.adapter.get(this.dbPath)

      this.cache.set(payload.Body, payload.ETag, payload.VersionId)
      return payload.Body
    } catch (err) {
      throw err
    }
  }

  _privateMethods() {
    return {
      getFromEdge: this.getFromEdge.bind(this),
      getFromOrigin: this.getFromOrigin.bind(this)
    }
  }
}
