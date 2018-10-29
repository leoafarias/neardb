import CloudStorage from '../../src/adapter/cloud'
import { IConfig } from '../../src/types'

const config: IConfig = {
  type: 'cloud',
  database: 'testdb',
  cloudStorage: {
    endPoint: '192.168.1.110',
    port: 9000,
    useSSL: false,
    accessKey: 'LC02CKR2P36U9098AQ98',
    secretKey: 'e9WMdVjn_XtbrjjBEbdGg5kUEphmTIVhNgoBEKpT'
  },
  storage: {}
}

jest.setTimeout(5000)

describe('cloudstorage', () => {
  const storage = CloudStorage.init(config)
  let savedData: any
  it('Could not init CloudStorage', () => {
    expect(storage).toBeInstanceOf(CloudStorage)
  })

  it('Could save json file', async () => {
    expect.assertions(1)
    const data = await storage.put()
    savedData = data
    expect(data).toBe('peanut butter')
  })

  it('Can get file as json object', () => {
    expect.assertions(1)
    return storage.get().then(data => {
      expect(data).toEqual(savedData)
      expect(typeof data).toBe('object')
    })
  })
})
