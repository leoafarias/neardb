import { IStorage, IConfig } from '../types'

import * as S3 from 'aws-sdk/clients/s3'

export default class CloudStorage implements IStorage {
  config: IConfig
  client: S3

  constructor(config: IConfig) {
    if (!config) throw new Error('No config was passed to cloudstorage')
    if (!config.database) {
      throw new Error('No config database to cloudstorage')
    }
    if (!config.options) {
      throw new Error('No options options in the config')
    }
    this.config = config

    this.client = new S3(config.options)
  }

  static init(config: IConfig) {
    return new CloudStorage(config)
  }

  put(value: object, path: string) {
    return new Promise((resolve, reject) => {
      let params = {
        Body: JSON.stringify(value),
        Bucket: this.config.database,
        Key: path,
        Metadata: {
          ContentType: 'application/json'
          // ContentEncoding: 'gzip'
        }
      }
      this.client.putObject(params, function(err, data) {
        if (err) reject(err)

        resolve(data)
      })
    })
  }

  get(path: string) {
    return new Promise((resolve, reject) => {
      let params = {
        Bucket: this.config.database,
        Key: path
      }
      this.client.getObject(params, function(err, data) {
        if (err) reject(err)
        let payload = data && data.Body ? JSON.parse(data.Body.toString()) : {}

        resolve(payload)
      })
    })
  }

  delete(path: string) {
    return new Promise((resolve, reject) => {
      let params = {
        Bucket: this.config.database,
        Key: path
      }
      this.client.deleteObject(params, function(err, data) {
        if (err) reject(err)
        resolve(data)
      })
    })
  }

  stat(path: string) {
    return new Promise((resolve, reject) => {
      let params = {
        Bucket: this.config.database,
        Key: path
      }
      this.client.headObject(params, function(err, data) {
        if (err) reject(err)
        resolve(data)
      })
    })
  }

  async setupBucket() {
    try {
      await this.bucketExists()
      return true
    } catch (err) {
      console.error(err)
    }

    try {
      await this.createBucket()
    } catch (err) {
      throw new Error(err)
    }
  }

  bucketExists() {
    return new Promise((resolve, reject) => {
      let params = {
        Bucket: this.config.database
      }
      this.client.headBucket(params, function(err, data) {
        if (err) reject(err)
        resolve(data)
      })
    })
  }

  createBucket() {
    return new Promise((resolve, reject) => {
      let params = {
        Bucket: this.config.database
      }
      this.client.createBucket(params, function(err, data) {
        if (err) reject(err)
        resolve(data)
      })
    })
  }

  deleteBucket() {
    return new Promise((resolve, reject) => {
      let params = {
        Bucket: this.config.database
      }
      this.client.deleteBucket(params, function(err, data) {
        if (err) reject(err)
        resolve(data)
      })
    })
  }
}
