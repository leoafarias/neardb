import { IConfig, PathList, IDBConfig } from './types'
import { uuid, iterationCopy } from './lib/utils'
import CloudStorage from './lib/cloud'
import Collection from './lib/collection'

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
    return new Collection(this, key, this.path)
  }
}
