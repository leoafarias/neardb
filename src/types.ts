export interface IConfig {
  database: string
  cdnEndpoint?: string
  options?: {
    endpoint: string
    useSSL?: boolean
    accessKeyId: string
    secretAccessKey: string
    signatureVersion?: string
    s3ForcePathStyle?: boolean
  }
}

export type PathList = PathItem[]

export type PathItem = {
  type: string
  key: string
}

export type Payload = {
  [key: string]: any
}
