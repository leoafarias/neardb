export interface IConfig {
  database: string
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

export type Cache = {
  store: Payload
  expires: number
}
