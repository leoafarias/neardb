import { JsonObject, ICache } from '../types';

export class Cache implements ICache {
  /** Data that is stored in memory */
  store: JsonObject;
  /** Configuration on how long to keep in memory */
  cacheExpiration: number;
  /** Date when cache expires */

  /** ETag of the object cached */
  etag: string;

  /** Document version id if versioning is enabled */
  versionId: string;

  /**
   * Constructor sets empty values and sets config expiration
   * @param cacheExpiration configuration expiration to create expires value
   */
  constructor(cacheExpiration: number) {
    this.store = {};
    this.cacheExpiration = cacheExpiration;
    this.expires = 0;
    this.etag = '';
    this.versionId = '';
  }

  /**
   * Sets data as a local value and creates expires date
   * @param data Payload of the data to store locally
   */
  set(data: JsonObject, etag?: string, versionId?: string): void {
    this.store = data;
    this.expires = new Date().getTime() + this.cacheExpiration;
    this.etag = etag ? etag : '';
    this.versionId = versionId ? versionId : '';
  }

  /**
   * Gets data that is stored in memory
   * @returns locally stored data
   */
  get(): JsonObject {
    return this.store;
  }

  /**
   * Gets etag from data that is stored in memory
   * @returns etag of locally stored data
   */
  getEtag(): string {
    return this.etag;
  }

  /**
   * Checks if there is a valid cache
   * @returns true if cache is valid, false if its not
   */
  exists(): boolean {
    if (this.store && this.expires > new Date().getTime()) {
      // Checks if there is a stored object, and that has not expired yet
      return true;
    } else {
      // Sets store to default value
      this.clear();
      return false;
    }
  }

  /**
   * Clears local cache
   */
  clear(): void {
    this.store = {};
    this.expires = 0;
    this.etag = '';
  }
}
