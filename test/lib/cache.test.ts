import { uuid } from '../loader'
import { config } from '../config'
import { createDummyData, createDoc, timeout } from '../helpers'

jest.setTimeout(10000)

describe('.cache', async () => {
  const cachedData = createDummyData()
  const doc = createDoc(uuid(), {})
  const etag = 'asdfaf2331fsd'
  const versionId = 'asdfaf2331fsd'

  it('.setCache', async () => {
    expect.assertions(2)
    doc.cache.set(cachedData, etag, versionId)
    expect(doc.cache.expires).toBeGreaterThan(new Date().getTime())
    expect(doc.cache.get()).toEqual(cachedData)
  })

  it('.getCache', async () => {
    expect.assertions(1)
    doc.cache.set(cachedData, etag)
    expect(doc.cache.get()).toEqual(cachedData)
  })

  it('.getEtag', async () => {
    expect.assertions(1)
    doc.cache.set(cachedData, etag)
    expect(doc.cache.getEtag()).toEqual(etag)
  })

  it('.setCache without ETag', async () => {
    expect.assertions(2)
    doc.cache.set(cachedData)
    expect(doc.cache.expires).toBeGreaterThan(new Date().getTime())
    expect(doc.cache.get()).toEqual(cachedData)
  })

  it('Cache Exists', async () => {
    const expiration = config.cacheExpiration ? config.cacheExpiration : 0
    expect.assertions(2)
    await doc.cache.set(cachedData)
    expect(doc.cache.exists()).toEqual(true)
    await timeout(expiration + 1)
    expect(doc.cache.exists()).toEqual(false)
  })
})
