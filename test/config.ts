import { IConfig } from '../src/types'

// TODO: AWS S3 Mocking
// These are public minio keys
export const config: IConfig = {
  cdn: {
    url: 'https://d1pgfx9dotquaq.cloudfront.net'
  },
  database: 'testdb',
  cacheExpiration: 50,
  storage: {
    endpoint: 'play.minio.io:9000',
    useSSL: true,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    accessKeyId: 'Q3AM3UQ867SPQQA43P2F', // these a public minio keys so dont worry
    secretAccessKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG' // these a public minio secret so dont worry
  }
}
