export interface IConfig {
  type: string
  cloudStorage?: {
    endpoint: string
    useSSL: boolean
    accessKeyId: string
    secretAccessKey: string
    signatureVersion?: string
    s3ForcePathStyle?: boolean
  }

  database: string
  storage: any
}

export type PathList = PathItem[]

export type PathItem = {
  type: string
  key: string
}

export interface ISetOptions {
  merge: boolean
}

export interface IStorage {
  // get(): object
  // set(): object
  // add(): object
}
