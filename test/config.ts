import { IConfig } from '../src/types'

// These are public minio keys
export const cloudConfig: IConfig = {
  cdn: {
    url: 'https://d1pgfx9dotquaq.cloudfront.net'
  },
  database: 'bucket',
  cacheExpiration: 5,
  storage: {
    endpoint: 'play.minio.io:9000',
    useSSL: true,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    accessKeyId: 'Q3AM3UQ867SPQQA43P2F', // these a public minio keys so dont worry
    secretAccessKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG' // these a public minio secret so dont worry
  }
}

// These are public minio keys
export const googleConfig: IConfig = {
  cdn: {
    url: 'https://storage.googleapis.com/neardb'
  },
  database: 'neardb',
  cacheExpiration: 5,
  storage: {
    endpoint: 'https://storage.googleapis.com',
    useSSL: true,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    accessKeyId: 'GOOGBU74SSPE754NCD4WCFVZ', // these a public minio keys so dont worry
    secretAccessKey: 'ivCfmiGGQu3UbA65Vhs4PTNXMRAD5aUi6d3ikJDw' // these a public minio secret so dont worry
  }
}

export const localConfig: IConfig = {
  cdn: {
    url: 'https://d1pgfx9dotquaq.cloudfront.net'
  },
  database: 'bucket',
  cacheExpiration: 5,
  storage: {
    endpoint: 'http://localhost:4569',
    useSSL: false,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    accessKeyId: 'Q3AM3UQ867SPQQA43P2F', // these a public minio keys so dont worry
    secretAccessKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG' // these a public minio secret so dont worry
  }
}

export const config = cloudConfig
