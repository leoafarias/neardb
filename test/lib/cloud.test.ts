import { NearDB, CloudStorage } from '../loader'
import { config } from '../config'
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
  let newPath = 'asdfasfd.json'

  it('Could not init CloudStorage', () => {
    expect(storage).toBeInstanceOf(CloudStorage)
  })

  it('Save document', async () => {
    expect.assertions(1)
    let payload: any
    payload = await storage.set(value, path)
    const etag = payload.ETag ? true : false

    expect(etag).toBe(true)
  })

  it('Throws error if cannot save document', async () => {
    expect.assertions(1)

    try {
      await brokenStorage.set(value, path)
    } catch (err) {
      expect(err.code).toBeTruthy()
    }
  })

  it('Get document', async () => {
    expect.assertions(2)
    await storage.set(value, path)
    const data = await storage.get(path)
    expect(data.Body).toEqual(value)
    expect(typeof data).toBe('object')
  })

  it('Get file info', async () => {
    expect.assertions(3)
    await storage.set(value, path)
    const data = await storage.head(path)
    expect(data).toHaveProperty('ETag')
    expect(data).toHaveProperty('LastModified')
    expect(typeof data).toBe('object')
  })

  it('Get info from file that doesnt exist', async () => {
    expect.assertions(1)

    try {
      await storage.head(newPath)
    } catch (err) {
      expect(err.code).toBe('NotFound')
    }
  })

  it('Delete document', async () => {
    expect.assertions(2)
    const data = await storage.remove(path)
    expect(data).toEqual({})
    expect(typeof data).toBe('object')
  })

  it('Gets error if deleting document already deleted', async () => {
    expect.assertions(1)

    try {
      let payload = await brokenStorage.remove(path)
      return payload
    } catch (err) {
      expect(err.code).toBeTruthy()
    }
  })

  it('Copy document', async () => {
    expect.assertions(2)
    await storage.set(value, path)
    let doc: any = await storage.head(path)
    const data = await storage.copy(path, doc.ETag)
    expect(data.CopyObjectResult).toHaveProperty('ETag')
    expect(typeof data).toBe('object')
  })

  it('Cannot copy document that does not exist', async () => {
    expect.assertions(1)

    try {
      await storage.copy(newPath, 'dummyEtag')
    } catch (err) {
      expect(err.code).toBeTruthy()
    }
  })
})
