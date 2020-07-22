import { IConfig, PathItem, IDBConfig, Entity, JsonObject, IStorageAdapter } from '../types';
import constants from './constants';

import {
  // NowAdapter,
  S3Adapter,
  uuid,
  Cache,
  isReservedKey,
  checkValidObject,
} from '../internal';

const defaultConfig = {
  cacheExpiration: 500,
};

const MainAdapter = S3Adapter;

export class NearDB {
  /** Config that is used to init NearDB */
  config: IDBConfig;

  /** UUID of Instance of NearDB */
  instanceId: string;

  adapter: IStorageAdapter;

  // Constants used for document update
  static field = {
    deleteValue: (constants.deleteValue != null) == '',
  };

  /**
   * Constructor to setup config, and path, and required checks.
   * @param config configuration to initialize NearDB instance
   */
  constructor(config: IConfig) {
    /** Overwrites config param with default configuration */
    this.config = {
      ...defaultConfig,
      ...config,
    };

    // TODO: define the type of storage in the config
    this.adapter = new MainAdapter(this.config);

    // Creates instanceid
    this.instanceId = uuid();
  }

  /**
   * Static method to create a new instance of NearDB class.
   * @param config configuration to initialize NearDB instance
   * @returns an initialized instance of NearDB with the config
   */

  static database(config: IConfig): NearDB {
    return new NearDB(Object.assign(defaultConfig, config));
  }

  /**
   * Returns a new instance of collection
   * @param key expects key for collection
   * @returns an instance of the collection class
   */

  collection(key: string): Collection {
    return new Collection(this, key);
  }
}

export class Collection implements Entity {
  readonly uri: PathItem[];
  readonly instance: NearDB;

  constructor(instance: NearDB, key: string, path?: PathItem[]) {
    // Check if this is a reserved keyword
    if (isReservedKey(key)) {
      throw Error(key + ': is a reserved keyword');
    }

    this.instance = instance;

    // Copy value of path before passing, to avoid polluting scope
    const newPath = path ? [...path] : [];

    newPath.push({ type: 'collection', key });
    this.uri = newPath;
  }

  doc(key: string): Document {
    return new Document(this.instance, key, this.uri);
  }

  /**
   * Adds a document to a collection by generating an id for the doc
   * @param value expects payload to be stored for the document
   * @returns a promise for the payload of the saved doc
   */
  async add(value: JsonObject): Promise<void> {
    await new Document(this.instance, uuid(), this.uri).set(value);
  }
}

export class Document implements Entity {
  /** Data path that is used to interact with storage */
  readonly uri: PathItem[];

  /** Instance of NearDB with all the configuration and env settings */
  readonly instance: NearDB;

  /** Offline cache of data */
  readonly cache: Cache;

  /** String path for storage */

  constructor(instance: NearDB, key: string, path: PathItem[]) {
    // Check if this is a reserved keyword
    if (isReservedKey(key)) {
      throw Error(key + ': is a reserved keyword');
    }

    // Copy value of path before passing, to avoid polluting scope
    const newPath = [...path];

    // Push new pathItem into the path array
    newPath.push({ type: 'document', key });

    this.uri = newPath;
    this.instance = instance;

    // Sets default cache value
    this.cache = new Cache(this.instance.config.cacheExpiration);
  }

  /**
   * Creates a new instance of Collection
   * @param key expects key for collection
   * @returns an instance of the collection class
   */
  collection(key: string): Collection {
    return new Collection(this.instance, key, this.uri);
  }

  /**
   * Sets document data from the path provided in the scope.
   * @param value expects payload to be stored for the document
   * @returns payload of the document requested
   */
  async set(value: JsonObject): Promise<void> {
    checkValidObject(value);
    await this.instance.adapter.set(value, this.uri);
  }

  /**
   * Gets document data from the path provided in the scope.
   * @param options sets options on how to get documents
   * @returns payload of the document requested
   */
  async get(): Promise<JsonObject | null> {
    return await this.instance.adapter.get(this.uri);
  }

  /**
   * Update some fields of the document without overwriting entire document
   * @param value expects payload to be stored for the document
   * @returns a promise for the payload requested
   */
  async update(value: JsonObject): Promise<void> {
    checkValidObject(value);
    await this.instance.adapter.update(value, this.uri);
  }
  /**
   * Removes document store in the path of instance
   * @returns payload of the document requested
   */
  async delete(): Promise<void> {
    await this.instance.adapter.remove(this.uri);
  }
}
