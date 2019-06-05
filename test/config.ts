import { IConfig } from '../src/types'
import { config as envConfig } from 'dotenv'
envConfig()

// These are public minio keys
export const cloudConfig: IConfig = {
  cacheExpiration: 5,
  instanceUrl: process.env.NEARDB_INSTANCE_URL || '',
  storage: {
    bucket: process.env.NEARDB_BUCKET_NAME || '',
    endpoint: process.env.NEARDB_ENDPOINT || '',
    useSSL: true,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    accessKeyId: process.env.NEARDB_ACCESS_KEY_ID || '', // these a public minio keys so dont worry
    secretAccessKey: process.env.NEARDB_SECRET_ACCESS_KEY || ''
  }
}

export const localConfig: IConfig = {
  cacheExpiration: 5,
  instanceUrl: process.env.NEARDB_INSTANCE_URL || '',
  storage: {
    bucket: process.env.NEARDB_BUCKET_NAME || '',
    endpoint: process.env.NEARDB_ENDPOINT || '',
    useSSL: true,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    accessKeyId: process.env.NEARDB_ACCESS_KEY_ID || '', // these a public minio keys so dont worry
    secretAccessKey: process.env.NEARDB_SECRET_ACCESS_KEY || ''
  }
}

export const config = cloudConfig
