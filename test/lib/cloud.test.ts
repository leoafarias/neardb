import { config } from '../config'
import CloudStorage from '../../src/lib/cloud'

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

  it('Document Stats', async () => {
    expect.assertions(1)
    const data = await storage.stat(path)
    expect(typeof data).toBe('object')
  })

  it('Get document', async () => {
    expect.assertions(2)
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
})
