import CloudStorage from '../src/adapter/cloud'
import { IConfig } from '../src/types'

export const config: IConfig = {
  type: 'cloud',
  database: 'testdb',
  storage: CloudStorage,
  options: {
    endpoint: 'https://play.minio.io:9000',
    useSSL: true,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    accessKeyId: 'Q3AM3UQ867SPQQA43P2F',
    secretAccessKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
  }
}
