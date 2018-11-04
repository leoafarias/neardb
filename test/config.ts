import { IConfig } from '../src/types'

export const config: IConfig = {
  cdnEndpoint: 'http://cdn.bitwild.com',
  database: 'testdb',
  options: {
    endpoint: 'play.minio.io:9000',
    useSSL: true,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    accessKeyId: 'Q3AM3UQ867SPQQA43P2F',
    secretAccessKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
  }
}

// export const config: IConfig = {
//   cdnEndpoint: 'http://cdn.bitwild.com',
//   database: 'testdb',
//   options: {
//     endpoint: 'neardb-test-sao-paulo.s3.amazonaws.com',
//     useSSL: true,
//     s3ForcePathStyle: true,
//     signatureVersion: 'v4'
//     // accessKeyId: 'Q3AM3UQ867SPQQA43P2F',
//     // secretAccessKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
//   }
// }

// export const config: IConfig = {
//   cdnEndpoint: 'http://cdn.bitwild.com',
//   database: 'testdb',
//   options: {
//     endpoint: 'http://192.168.86.24:9000',
//     useSSL: false,
//     s3ForcePathStyle: true,
//     signatureVersion: 'v4',
//     accessKeyId: 'LC02CKR2P36U9098AQ98',
//     secretAccessKey: 'e9WMdVjn_XtbrjjBEbdGg5kUEphmTIVhNgoBEKpT'
//   }
// }
