import { Config, StorageAdapter, Payload } from '../types'
import * as S3 from 'aws-sdk/clients/s3'

export class CloudStorage implements StorageAdapter {
  readonly config: Config
  readonly client: S3

  constructor(config: Config) {
    this.config = config
    this.client = new S3(config.storage)
  }

  static init(config: Config) {
    return new CloudStorage(config)
  }

  async head(path: string): Promise<object> {
    try {
      const params = {
        Bucket: this.config.database,
        Key: path
      }
      const data = await this.client.headObject(params).promise()
      return data
    } catch (err) {
      throw err
    }
  }

  async set(
    value: object,
    path: string,
    // tslint:disable-next-line:no-any
    metadata?: { [key: string]: any }
  ): Promise<object> {
    try {
      const params = {
        Body: JSON.stringify(value),
        Bucket: this.config.database,
        Key: path,
        Metadata: metadata
      }
      const data = await this.client.putObject(params).promise()
      return data
    } catch (err) {
      throw err
    }
  }

  async get(path: string): Promise<Payload> {
    const params = {
      Bucket: this.config.database,
      Key: path
    }
    // tslint:disable-next-line:no-any
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
      const params = {
        Bucket: this.config.database,
        Key: path
      }
      const data = await this.client.deleteObject(params).promise()
      return data
    } catch (err) {
      throw err
    }
  }
  // tslint:disable-next-line:no-any
  async copy(path: string, eTag: string, metadata?: { [key: string]: any }) {
    const params = {
      Bucket: this.config.database,
      Key: path,
      CopySource: this.config.database + '/' + path,
      CopySourceIfMatch: eTag,
      MetadataDirective: 'REPLACE',
      Metadata: metadata
    }

    try {
      const data = await this.client.copyObject(params).promise()
      return data
    } catch (err) {
      throw err
    }
  }
}
