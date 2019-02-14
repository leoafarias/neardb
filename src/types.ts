import { NearDB } from './lib/core'

// IConfig interface with defaults
export interface IDBConfig extends IConfig {
  database: string
  indices: boolean
  cacheExpiration: number
  retries: number
}

// User passed config interface
export interface IConfig {
  database: string
  indices?: boolean
  retries?: number
  cacheExpiration?: number
  cdn?: {
    url: string
    headers?: {
      [key: string]: string
    }
  }
  storage?: {
    endpoint: string
    useSSL?: boolean
    accessKeyId?: string
    secretAccessKey?: string
    signatureVersion?: string
    s3ForcePathStyle?: boolean
  }
}

export interface ICache {
  readonly store: Payload
  readonly cacheExpiration: number
  readonly expires: number
  readonly etag: string
  readonly versionId: string
  set(data: Payload): void
  get(): Payload
  exists(): boolean
  clear(): void
}

export interface IStorageAdapter {
  readonly config: IConfig
  readonly client: any
  get(path: string): Promise<object>
  set(
    value: object,
    path: string,
    metadata?: { [key: string]: any }
  ): Promise<object>
  remove(path: string): Payload
}

export interface BaseEntity {
  instance: NearDB
  path: PathList
}

export type GetOptions = {
  source: string
}

export type PathList = PathItem[]

export type PathItem = {
  type: string
  key: string
}

export type Payload = {
  [key: string]: any
}
