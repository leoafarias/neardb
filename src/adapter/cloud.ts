import { IStorage, IConfig } from '../types'

import * as Minio from 'minio'

const client = new Minio.Client({
  endPoint: '192.168.86.24',
  port: 9000,
  useSSL: false,
  accessKey: 'LC02CKR2P36U9098AQ98',
  secretKey: 'e9WMdVjn_XtbrjjBEbdGg5kUEphmTIVhNgoBEKpT'
})

export default class CloudStorage {
  config: IConfig

  constructor(config: IConfig) {
    if (!config) throw new Error('No config was passed to cloudstorage')
    if (!config.database) {
      throw new Error('No config was passed to cloudstorage')
    }
    this.config = config
  }

  static init(config: IConfig) {
    return new CloudStorage(config)
  }

  async setup() {
    try {
      console.log('its in')
      let exists = await this.dbExists()
      console.log(exists)
      if (!exists) await this.dbCreate()
    } catch (err) {
      throw new Error(err)
    }
  }

  dbExists() {
    return new Promise((resolve, reject) => {
      client
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
      client
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
