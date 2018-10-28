import { IStorage, IConfig } from '../types'

import * as Minio from 'minio'

export default class CloudStorage {
  config: IConfig
  client: Minio.Client

  constructor(config: IConfig) {
    if (!config) throw new Error('No config was passed to cloudstorage')
    if (!config.database) {
      throw new Error('No config was passed to cloudstorage')
    }
    if (!config.cloudStorage) {
      throw new Error('No cloudstorage options in the config')
    }
    this.config = config

    this.client = new Minio.Client(config.cloudStorage)
  }

  static init(config: IConfig) {
    return new CloudStorage(config)
  }

  async setup() {
    try {
      console.log('its in')
      let exists = await this.dbExists()
      if (!exists) await this.dbCreate()
    } catch (err) {
      throw new Error(err)
    }
  }

  put() {
    return new Promise((resolve, reject) => {
      let data = {
        test: true,
        anotherData: 'string'
      }
      let metaData = {
        'Content-Type': 'application/json'
      }
      console.log(Object.keys(data).length)
      this.client.putObject(
        this.config.database,
        'data.json',
        JSON.stringify(data),
        Object.keys(data).length,
        metaData,
        function(err, etag) {
          if (err) reject(err)
          resolve(etag)
        }
      )
    })
  }

  get() {
    return new Promise((resolve, reject) => {
      let size = 0
      let data = ''

      this.client.getObject(this.config.database, 'data.json', function(
        err,
        dataStream
      ) {
        if (err) {
          return console.log(err)
        }
        dataStream.on('data', function(chunk) {
          size += chunk.length
          data += chunk
        })
        dataStream.on('end', function() {
          resolve(JSON.parse(data))
        })
        dataStream.on('error', function(err) {
          reject(err)
        })
      })
    })
  }

  remove() {
    return new Promise((resolve, reject) => {
      this.client.removeObject(this.config.database, 'data.json', function(
        err
      ) {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  stat() {
    return new Promise((resolve, reject) => {
      this.client.statObject(this.config.database, 'data.json', function(
        err,
        stat
      ) {
        if (err) {
          reject(err)
        }
        resolve(stat)
      })
    })
  }

  dbExists() {
    return new Promise((resolve, reject) => {
      this.client
        .bucketExists(this.config.database)
        .then(exists => {
          console.log(exists)
          resolve(exists)
        })
        .catch(err => {
          console.error(err)
          reject(err)
        })
    })
  }

  dbCreate() {
    return new Promise((resolve, reject) => {
      this.client
        .makeBucket(this.config.database, 'us-east-1')
        .then(result => {
          console.log('Bucket created successfully in "us-east-1".')
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
