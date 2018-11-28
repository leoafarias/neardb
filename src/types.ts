// IConfig interface with defaults
export interface IDBConfig extends IConfig {
  database: string
  indices: boolean
  cacheExpiration: number
}

// User passed config interface
export interface IConfig {
  database: string
  indices?: boolean
  cdn?: {
    url: string
    headers?: {
      [key: string]: string
    }
  }
  cacheExpiration?: number
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
  set(data: Payload): void
  get(): Payload
  exists(): boolean
  clear(): void
}

export interface ICloudStorage {
  readonly config: IConfig
  readonly client: any
  get(path: string): Promise<object>
  put(value: object, path: string): Promise<object>
  delete(path: string): Payload
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
