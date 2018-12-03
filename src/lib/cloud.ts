import { IConfig, ICloudStorage, Payload } from '../types'
import * as S3 from 'aws-sdk/clients/s3'

export default class CloudStorage implements ICloudStorage {
  readonly config: IConfig
  readonly client: S3

  constructor(config: IConfig) {
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

  async get(path: string): Promise<Payload> {
    let params = {
      Bucket: this.config.database,
      Key: path
    }

    let data: any

    try {
      data = await this.client.getObject(params).promise()
      data.Body = JSON.parse(data.Body.toString())
      return data
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
