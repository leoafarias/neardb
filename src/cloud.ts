import { IConfig } from './types'
const S3 = require('aws-sdk/clients/s3')

export default class CloudStorage {
  config: IConfig
  client: any

  constructor(config: IConfig) {
    if (!config) throw new Error('No config was passed to cloudstorage')
    if (!config.database) {
      throw new Error('No config database to cloudstorage')
    }
    if (!config.storage) {
      throw new Error('No options options in the config')
    }

    this.config = config

    this.client = new S3(config.storage)
  }

  static init(config: IConfig) {
    return new CloudStorage(config)
  }

  async put(value: object, path: string): Promise<object> {
    try {
      let params = {
        Body: JSON.stringify(value),
        Bucket: this.config.database,
        Key: path,
        Metadata: {
          ContentType: 'application/json',
          ContentEncoding: 'gzip'
        }
      }
      let data = await this.client.putObject(params).promise()
      return data
    } catch (err) {
      throw err
    }
  }

  async get(path: string) {
    let params = {
      Bucket: this.config.database,
      Key: path
    }

    let data: any

    try {
      data = await this.client.getObject(params).promise()
      return data && data.Body ? JSON.parse(data.Body.toString()) : {}
    } catch (err) {
      throw err
    }
  }

  async delete(path: string) {
    try {
      let params = {
        Bucket: this.config.database,
        Key: path
      }
      let data = await this.client.deleteObject(params).promise()
      return data
    } catch (err) {
      throw err
    }
  }
}
