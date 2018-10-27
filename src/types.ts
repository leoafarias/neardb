export interface IConfig {
  type: string
  cloudStorage?: {
    endPoint: string
    useSSL: boolean
    port: number
    accessKey: string
    secretKey: string
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
