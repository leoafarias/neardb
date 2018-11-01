export interface IConfig {
  type: string
  database: string
  storage: any
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

export interface ISetOptions {
  merge: boolean
}

export interface IStorage {
  // get(): object
  // set(): object
  // add(): object
}
