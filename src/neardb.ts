import { IConfig, Payload, Cache, PathList, GetOptions } from './types'
import { uuid, buildPath } from './utils'
import CloudStorage from './adapter/cloud'
import axios from 'axios'

const defaultConfig = {
  database: 'testdb'
}

export default class NearDB {
  /** Config that is used to init NearDB */
  config: IConfig

  /** Data path that is used to interact with storage */
  path: PathList

  /** Offline cache of data */
  cache: Cache

  adapter: any

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
    if (!path) path = []
    this.path = path

    // Sets default cache values
    this.cache = { store: {} as Payload, expires: 0 }
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

    let docPath = buildPath(this.path)
    let data: Payload

    try {
      // Get document from the if there is a CDN endpoint

      if (options && options.source === 'origin') {
        // Source as origin
        data = await this.adapter.get(docPath)
        this.setCache(data)
      } else if (this.hasCache()) {
        // Get from in memory storage
        data = this.cache.store
      } else if (
        // Edge and has cdn endpoint
        (options && options.source === 'edge') ||
        this.config.cdnEndpoint
      ) {
        // Get it from cloud storage
        data = await this.getRequest(docPath)
        this.setCache(data)
      } else {
        // Default case get from the origin
        data = await this.adapter.get(docPath)
      }

      return data
    } catch (err) {
      throw err
    }
  }

  /**
   * Gets document data from the path provided in the scope.
   * @param value expects payload to be stored for the document
   * @param options that can be passed on how you want to store the data
   * options.merge will merge the data into existing document instead of overwriting.
   * @returns payload of the document requested
   */
  set(value: Payload): Promise<object> {
    let docPath = buildPath(this.path)

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
        if (value && value[prop] === NearDB.field.deleteValue) {
          delete value[prop]
          if (doc && doc[prop]) {
            delete doc[prop]
          }
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

    let docPath = buildPath(newPath)
    return this.adapter.put(value, docPath)
  }

  /**
   * Removes document store in the path of instance
   * @returns empty object
   */
  delete() {
    let newPath = [...this.path]
    let docPath = buildPath(newPath)
    return this.adapter.delete(docPath)
  }

  /**
   * Makes a get request to the CDN url
   * @param path path to attach to cdn url on the request
   * @returns json object from the request
   */

  private async getRequest(path: string): Promise<Payload> {
    try {
      let http = axios.create({
        baseURL: this.config.cdnEndpoint,
        timeout: 15000
        // headers: {
        //   'Accept-Encoding': 'br'
        // }
      })

      let { data } = await http.get(path)

      return data
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
        : 10000
    this.cache = {
      store: data,
      expires: new Date().getTime() + expiration
    }
  }

  /**
   * Checks if there a valid cached payload
   * @returns boolean
   */
  private hasCache() {
    if (this.cache.store && this.cache.expires > new Date().getTime()) {
      // Checks if there is a stored object, and that has not expired yet
      return true
    } else {
      // Sets cache to default value
      this.cache = {
        store: {} as Payload,
        expires: 0
      }
      return false
    }
  }
}
