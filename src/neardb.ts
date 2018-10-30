import { IConfig, PathItem, PathList, ISetOptions, IStorage } from './types'
import { uuid, buildPath } from './utils'

const defaultConfig = {
  type: 'cloud',
  database: 'testdb'
}

export default class NearDB {
  /** Config that is used to init NearDB */
  config: IConfig

  /** Data path that is used to interact with storage */
  path: PathList

  adapter: any
  /**
   * Constructor to setup config, and path, and required checks.
   * @param config configuration to initiatlize NearDB instance
   * @param path current path of NearDB, sets to an empty array if nothing is passed
   */
  constructor(config: IConfig, path?: PathList) {
    /** Check if config exists */
    if (!config) throw new Error('No config passed to NearDB')
    /** Check if there is a storage set up */
    if (!config.storage) {
      throw new Error('No Storage adapter')
    }

    /** Overwrites config param with default configuration */
    this.config = Object.assign(defaultConfig, config)

    // TODO: define the type of storage in the config
    this.adapter = new config.storage(config)
    // Sets empty path type
    if (!path) path = []
    this.path = path
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
      throw new Error('Cannot add documents to documents')
    }

    newPath.push({
      type: 'doc',
      key
    })

    return new NearDB(this.config, newPath)
  }

  /**
   * Gets document data from the path provided in the scope.
   * @returns payload of the document requested
   */
  get(): Promise<object> {
    const lastPathIndex = this.path[this.path.length - 1]
    // Cannot get a sub-collection of a collection
    if (lastPathIndex && lastPathIndex.type !== 'doc') {
      throw new Error('Can only use get() method for documents')
    }

    let docPath = buildPath(this.path)
    return this.adapter.get(docPath)
  }

  /**
   * Gets document data from the path provided in the scope.
   * @param value expects payload to be stored for the document
   * @param options that can be passed on how you want to store the data
   * options.merge will merge the data into existing document instead of overwriting.
   * @returns payload of the document requested
   */
  set(value: object, options?: ISetOptions): Promise<object> {
    let docPath = buildPath(this.path)
    console.log(docPath)
    return this.adapter.put(value, docPath)
  }

  /**
   * Update some fields of the document without overwriting entire document
   * @param value expects payload to be stored for the document
   * @returns a promise for the payload requested
   */
  update(value: object): Promise<object> {
    // TODO: add ability to delete specific fields
    return this.set(value, { merge: true })
  }

  /**
   * Adds a document to a collection by generating an id for the doc
   * @param value expects payload to be stored for the document
   * @returns a promise for the payload of the saved doc
   */
  add(value: object): Promise<object> {
    let newPath = [...this.path]
    const lastPathIndex = this.path[this.path.length - 1]
    if (lastPathIndex && lastPathIndex.type !== 'collection') {
      throw new Error('Can only add document to collections')
    }

    newPath.push({ type: 'doc', key: uuid() })

    let docPath = buildPath(newPath)
    return this.adapter.put(value, docPath)
  }

  delete() {
    let newPath = [...this.path]
    let docPath = buildPath(newPath)
    return this.adapter.delete(docPath)
  }
}
