import { NearDB } from './lib/core'

// IConfig interface with defaults
export interface IDBConfig extends IConfig {
  cacheExpiration: number
}

// User passed config interface
export interface IConfig {
  instanceUrl?: string
  headers?: {
    [key: string]: string
  }
  cacheExpiration: number
  storage?: {
    bucket: string
    endpoint?: string
    useSSL: boolean
    s3ForcePathStyle: boolean
    signatureVersion: string
    accessKeyId: string // these a public minio keys so don't worry
    secretAccessKey: string // these a public minio secret so don't worry
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
  get(path: PathList): Promise<object>
  set(
    value: object,
    path: PathList,
    metadata?: { [key: string]: any }
  ): Promise<object>
  update(
    value: object,
    path: PathList,
    metadata?: { [key: string]: any }
  ): Promise<object>
  remove(path: PathList): Payload
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
