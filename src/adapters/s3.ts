import * as S3 from 'aws-sdk/clients/s3'
import { documentPath } from '../lib/utils'
import { IConfig, IStorageAdapter, Payload, PathList } from '../types'
import constants from '../lib/constants'

export class S3Adapter implements IStorageAdapter {
  readonly config: IConfig
  readonly client: S3

  constructor(config: IConfig) {
    this.config = config
    this.client = new S3(this.config.storage)
  }

  static init(config: IConfig) {
    return new S3Adapter(config)
  }

  async set(value: object, path: PathList): Promise<object> {
    let fileKey = documentPath(path)
    let params = {
      Body: JSON.stringify(value),
      Bucket: this.config.storage!.bucket,
      Key: fileKey
    }
    try {
      let data = await this.client.putObject(params).promise()
      return data
    } catch (err) {
      throw err
    }
  }

  async update(value: object, path: PathList): Promise<object> {
    let doc: Payload
    try {
      doc = await this.get(path)

      // Loop through all property for custom object actions
      for (let prop in value) {
        if (value[prop] === constants.deleteValue) {
          // If has deleteValue action, delete the prop
          delete value[prop]
          delete doc[prop]
        }
      }

      let updatedValue = {
        ...doc,
        ...value
      }

      return await this.set(updatedValue, path)
    } catch (err) {
      throw err
    }
  }

  async get(path: PathList): Promise<Payload> {
    let fileKey = documentPath(path)
    let params = {
      Bucket: this.config.storage!.bucket,
      Key: fileKey
    }

    let data: any
    try {
      data = await this.client.getObject(params).promise()
      // Convert Buffer to object
      data.Body = data.Body.toString('utf8')
      data.Body = JSON.parse(data.Body)

      return data.Body
    } catch (err) {
      throw err
    }
  }

  async remove(path: PathList) {
    let fileKey = documentPath(path)
    let params = {
      Bucket: this.config.storage!.bucket,
      Key: fileKey
    }
    try {
      let data: any
      data = await this.client.deleteObject(params).promise()
      return data
    } catch (err) {
      throw err
    }
  }
}
