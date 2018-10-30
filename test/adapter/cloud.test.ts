import CloudStorage from '../../src/adapter/cloud'
import { IConfig } from '../../src/types'

const config: IConfig = {
  type: 'cloud',
  database: 'testdb',
  cloudStorage: {
    endpoint: 'http://192.168.86.24:9000',
    useSSL: false,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    accessKeyId: 'LC02CKR2P36U9098AQ98',
    secretAccessKey: 'e9WMdVjn_XtbrjjBEbdGg5kUEphmTIVhNgoBEKpT'
  },
  storage: {}
}

jest.setTimeout(5000)

describe('cloudstorage', () => {
  const storage = CloudStorage.init(config)

  let value = {
    test: true,
    anotherData: 'string'
  }

  let path = 'data.json'

  it('Could not init CloudStorage', () => {
    expect(storage).toBeInstanceOf(CloudStorage)
  })

  it('Save document', async () => {
    expect.assertions(1)
    let payload: any
    payload = await storage.put(value, path)
    const etag = payload.ETag ? true : false

    expect(etag).toBe(true)
  })

  it('Document Stats', () => {
    expect.assertions(1)
    return storage.stat(path).then(data => {
      expect(typeof data).toBe('object')
    })
  })

  it('Get document', () => {
    expect.assertions(2)
    return storage.get(path).then(data => {
      expect(data).toEqual(value)
      expect(typeof data).toBe('object')
    })
  })

  it('Delete document', () => {
    expect.assertions(2)
    return storage.delete(path).then(data => {
      expect(data).toEqual({})
      expect(typeof data).toBe('object')
    })
  })
})
