export interface IConfig {
  storage?: any
}

export type PathList = PathItem[]

export type PathItem = {
  type: string
  key: string
}

export interface ISetOptions {
  merge: boolean
}
