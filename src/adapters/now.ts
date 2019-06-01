import { IConfig, IStorageAdapter, Payload, PathList } from '../types'
import { HTTP } from '../lib/http'
import { AxiosInstance } from 'axios'

export class Now implements IStorageAdapter {
  readonly config: IConfig
  readonly client: AxiosInstance

  constructor(config: IConfig) {
    this.config = config
    this.client = HTTP.create({
      baseURL: this.config.instanceUrl,
      timeout: 15000,
      headers: this.config.headers
    })
  }

  static init(config: IConfig) {
    return new Now(config)
  }

  async set(value: object, path: PathList): Promise<object> {
    try {
      let data = await this.client.post('', { params: { path }, data: value })
      return data
    } catch (err) {
      throw err
    }
  }

  async update(value: object, path: PathList): Promise<object> {
    try {
      let data = await this.client.put('', { params: { path }, data: value })
      return data
    } catch (err) {
      throw err
    }
  }

  async get(path: PathList): Promise<Payload> {
    try {
      let data = await this.client.get('', { params: { path } })
      return data
    } catch (err) {
      throw err
    }
  }

  async remove(path: PathList) {
    try {
      let data = await this.client.delete('', { params: { path } })
      return data
    } catch (err) {
      throw err
    }
  }
}
