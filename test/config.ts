import CloudStorage from '../src/adapter/cloud'
import { IConfig } from '../src/types'

export const config: IConfig = {
  type: 'cloud',
  database: 'testdb',
  storage: CloudStorage,
  options: {
    endpoint: 'http://192.168.86.24:9000',
    useSSL: false,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    accessKeyId: 'LC02CKR2P36U9098AQ98',
    secretAccessKey: 'e9WMdVjn_XtbrjjBEbdGg5kUEphmTIVhNgoBEKpT'
  }
}
