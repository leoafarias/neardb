import { Payload, ICache } from '../types'

export default class Cache implements ICache {
  /** Data that is stored in memory */
  store: Payload
  /** Configuration on how long to keep in memory */
  cacheExpiration: number
  /** Date when cache expires */
  expires: number

  /**
   * Constructor sets empty vlaues and sets config expiration
   * @param cacheExpiration configuration expiration to create expires value
   */
  constructor(cacheExpiration: number) {
    this.store = {}
    this.cacheExpiration = cacheExpiration
    this.expires = 0
  }

  /**
   * Sets data as a local value and creates expires date
   * @param data Payload of the data to store locally
   */
  set(data: Payload): void {
    this.store = data
    this.expires = new Date().getTime() + this.cacheExpiration
  }

  /**
   * Gets data that is stored in memory
   * @returns locally stored data
   */
  get(): Payload {
    return this.store
  }

  /**
   * Checks if there is a valid cache
   * @returns true if cache is valid, false if its not
   */
  exists(): boolean {
    if (this.store && this.expires > new Date().getTime()) {
      // Checks if there is a stored object, and that has not expired yet
      return true
    } else {
      // Sets store to default value
      this.clear()
      return false
    }
  }

  /**
   * Clears local cache
   */
  clear(): void {
    this.store = {}
    this.expires = 0
  }
}
