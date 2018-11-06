export interface IConfig {
  database: string
  cdnEndpoint?: string
  cacheExpiration?: number
  options?: {
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
