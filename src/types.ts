export interface IConfig {
  storage?: any
  database: string
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
