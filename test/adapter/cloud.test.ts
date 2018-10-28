import CloudStorage from '../../src/adapter/cloud'
import { IConfig } from '../../src/types'

const config: IConfig = {
  type: 'cloud',
  database: 'testdb',
  cloudStorage: {
    endPoint: '192.168.86.24',
    port: 9000,
    useSSL: false,
    accessKey: 'LC02CKR2P36U9098AQ98',
    secretKey: 'e9WMdVjn_XtbrjjBEbdGg5kUEphmTIVhNgoBEKpT'
  },
  storage: {}
}

jest.setTimeout(30000)

describe('cloudstorage', () => {
  const cs = CloudStorage.init(config)

  let savedData: any

  it('Could not init CloudStorage', () => {
    expect(cs).toBeInstanceOf(CloudStorage)
  })

  it('Could save json file', () => {
    expect.assertions(1)
    return cs.put().then(data => {
      savedData = data
      expect(data).toBe('peanut butter')
    })
  })

  it('Can get file as json object', () => {
    expect.assertions(1)
    return cs.get().then(data => {
      expect(data).toEqual(savedData)
      expect(typeof data).toBe('object')
    })
  })
})
