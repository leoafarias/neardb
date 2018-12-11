import { IConfig, PathList, IDBConfig } from './types'
import { uuid } from './lib/utils'
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
