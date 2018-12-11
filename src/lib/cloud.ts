import { IConfig, IStorageAdapter, Payload } from '../types'
import * as S3 from 'aws-sdk/clients/s3'

export default class CloudStorage implements IStorageAdapter {
  readonly config: IConfig
  readonly client: S3

  constructor(config: IConfig) {
    this.config = config
    this.client = new S3(config.storage)
  }

  static init(config: IConfig) {
    return new CloudStorage(config)
  }

  async head(path: string): Promise<object> {
    try {
      let params = {
        Bucket: this.config.database,
        Key: path
      }
      let data = await this.client.headObject(params).promise()
      return data
    } catch (err) {
      throw err
    }
  }

  async set(
    value: object,
    path: string,
    metadata?: { [key: string]: any }
  ): Promise<object> {
    try {
      let params = {
        Body: JSON.stringify(value),
        Bucket: this.config.database,
        Key: path,
        Metadata: metadata
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
      data.Body = JSON.parse(data.Body.toString('utf8'))
      // if (data.Body && data.Body.byteLength > 1) {
      //   data.Body = JSON.parse(data.Body.toString('utf8'))
      // }

      return data
    } catch (err) {
      throw err
    }
  }

  async remove(path: string) {
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

  async copy(path: string, ETag: string, metadata?: { [key: string]: any }) {
    let params = {
      Bucket: this.config.database,
      Key: path,
      CopySource: this.config.database + '/' + path,
      CopySourceIfMatch: ETag,
      MetadataDirective: 'REPLACE',
      Metadata: metadata
    }

    try {
      let data = await this.client.copyObject(params).promise()
      return data
    } catch (err) {
      throw err
    }
  }
}
