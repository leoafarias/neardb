import { IConfig, PathList, IDBConfig, BaseEntity, Payload } from '../types'
import constants from './constants'

import {
  S3Adapter,
  uuid,
  Cache,
  reservedKey,
  checkValidObject
} from '../internal'

const defaultConfig = {
  database: '',
  cacheExpiration: 500
}

export class NearDB {
  /** Config that is used to init NearDB */
  config: IDBConfig

  /** UUID of Instance of NearDB */
  instanceId: string

  adapter: S3Adapter

  // Constants used for document update
  static field = {
    deleteValue: constants.deleteValue
  }

  /**
   * Constructor to setup config, and path, and required checks.
   * @param config configuration to initialize NearDB instance
   */
  constructor(config: IConfig) {
    /** Check if config exists */

    /** Overwrites config param with default configuration */
    this.config = {
      ...defaultConfig,
      ...config
    }

    // TODO: define the type of storage in the config
    this.adapter = new S3Adapter(this.config)

    // Creates instanceid
    this.instanceId = uuid()
  }

  /**
   * Static method to create a new instance of NearDB class.
   * @param config configuration to initialize NearDB instance
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
  readonly instance: NearDB

  constructor(instance: NearDB, key: string, path?: PathList) {
    // Check if this is a reserved keyword
    if (reservedKey(key)) {
      throw new Error(key + ': is a reserved keyword')
    }

    this.instance = instance

    // Copy value of path before passing, to avoid polluting scope
    let newPath = path ? [...path] : []

    newPath.push({
      type: 'collection',
      key
    })

    this.path = newPath
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

  constructor(instance: NearDB, key: string, path: PathList) {
    // Check if this is a reserved keyword
    if (reservedKey(key)) {
      throw new Error(key + ': is a reserved keyword')
    }

    // Copy value of path before passing, to avoid polluting scope
    let newPath = [...path]

    // Push new pathItem into the path array
    newPath.push({
      type: 'document',
      key
    })

    this.path = newPath
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
      let payload = await this.instance.adapter.set(value, this.path)
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
  async get(): Promise<object> {
    try {
      let payload = await this.instance.adapter.get(this.path)
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
      checkValidObject(value)
      let payload = await this.instance.adapter.update(value, this.path)
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
    return this.instance.adapter.remove(this.path)
  }
}
