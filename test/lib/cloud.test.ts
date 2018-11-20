import { config } from '../config'
import CloudStorage from '../../src/lib/cloud'
import { uuid } from '../../src/lib/utils'
import { createDummyData } from '../helpers'

jest.setTimeout(10000)

describe('cloudstorage', () => {
  const storage = CloudStorage.init(config)
  let newConfig = Object.assign(config, {
    storage: { endpoint: 'http://fakestorage.storag.net' }
  })
  const brokenStorage = CloudStorage.init(newConfig)

  let value = createDummyData()

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

  it('Throws error if cannot save document', async () => {
    expect.assertions(1)

    try {
      await brokenStorage.put(value, path)
    } catch (err) {
      expect(err.code).toBeTruthy()
    }
  })

  it('Get document', async () => {
    expect.assertions(2)
    await storage.put(value, path)
    const data = await storage.get(path)
    expect(data).toEqual(value)
    expect(typeof data).toBe('object')
  })

  it('Delete document', async () => {
    expect.assertions(2)
    const data = await storage.delete(path)
    expect(data).toEqual({})
    expect(typeof data).toBe('object')
  })

  it('Gets error if deleting document already deleted', async () => {
    expect.assertions(1)

    try {
      let payload = await brokenStorage.delete(path)
      return payload
    } catch (err) {
      expect(err.code).toBeTruthy()
    }
  })
})
