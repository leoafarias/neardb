import { NearDB } from './lib/core'

// IConfig interface with defaults
export interface IDBConfig extends Config {
  database: string
  indices: boolean
  cacheExpiration: number
  retries: number
}

// User passed config interface
export interface Config {
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

export interface Cache {
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

export interface StorageAdapter {
  readonly config: Config
  // tslint:disable-next-line:no-any
  readonly client: any
  get(path: string): Promise<object>
  set(
    value: object,
    path: string,
    // tslint:disable-next-line:no-any
    metadata?: { [key: string]: any }
  ): Promise<object>
  remove(path: string): Payload
}

export interface BaseEntity {
  instance: NearDB
  path: PathList
}

export interface GetOptions {
  source: string
}

export type PathList = PathItem[]

export interface PathItem {
  type: string
  key: string
}

export interface Payload {
  // tslint:disable-next-line:no-any
  [key: string]: any
}
