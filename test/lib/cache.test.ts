import Cache from '../../src/lib/cache'
import { uuid } from '../../src/lib/utils'
import { config } from '../config'
import { createDummyData, createDoc, timeout } from '../helpers'

jest.setTimeout(5000)

describe('.cache', async () => {
  let cachedData = createDummyData()
  let doc = createDoc(uuid(), {})

  it('.setCache', async () => {
    expect.assertions(2)
    doc.cache.set(cachedData)
    expect(doc.cache.expires).toBeGreaterThan(new Date().getTime())
    expect(doc.cache.get()).toEqual(cachedData)
  })

  it('.hasCache', async () => {
    let expiration = config.cacheExpiration ? config.cacheExpiration : 0
    expect.assertions(2)
    await doc.cache.set(cachedData)
    expect(doc.cache.exists()).toEqual(true)
    await timeout(expiration + 1)
    expect(doc.cache.exists()).toEqual(false)
  })
})
