import { IConfig } from '../src/types'

// These are public minio keys
export const cloudConfig: IConfig = {
  cacheExpiration: 5,
  instanceUrl: 'http://localhost:3000',
  storage: {
    bucket: 'bucket',
    endpoint: 'play.minio.io:9000',
    useSSL: true,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    accessKeyId: 'Q3AM3UQ867SPQQA43P2F', // these a public minio keys so dont worry
    secretAccessKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG' // these a public minio secret so dont worry
  }
}

export const localConfig: IConfig = {
  cacheExpiration: 5,
  storage: {
    bucket: 'bucket',
    endpoint: 'http://localhost:4569',
    useSSL: false,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    accessKeyId: 'Q3AM3UQ867SPQQA43P2F', // these a public minio keys so dont worry
    secretAccessKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG' // these a public minio secret so dont worry
  }
}

export const config = cloudConfig

// accessKeyId: 'AKIAX3GEC3TMCEK34NUO',
//       secretAccessKey: 'GJQq3LVBFlpV9a8fy2WN9q17I'
