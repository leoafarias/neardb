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

export interface ICache {}

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
