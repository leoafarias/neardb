// import NearDB from '../src/neardb'
import NearDB from '../src/neardb'
import CloudStorage from '../src/cloud'
import { config } from './config'
import { uuid } from '../src/utils'

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

jest.setTimeout(15000)

let firstColRef: any
let firstDocRef: any

const data = {
  firstValue: 3,
  secondValue: 'String'
}

// let instance: any

beforeAll(() => {
  firstColRef = NearDB.database(config).collection('oneCol')
  firstDocRef = firstColRef.doc('oneDoc')
})
/**
 * NearDB
 */
describe('.database', () => {
  it('NearDB is instantiable', () => {
    expect(NearDB.database(config)).toBeInstanceOf(NearDB)
  })

  it('Config is set properly', () => {
    expect(config).toEqual(NearDB.database(config).config)
  })
})

describe('.collection', () => {
  it('Returns NearDB instance', () => {
    expect(firstColRef).toBeInstanceOf(NearDB)
  })

  it('Cannot call collections on collections', () => {
    const check = () => {
      firstColRef.collection('newCol')
    }
    expect(check).toThrowError('Only documents can have sub-collections')
  })

  it('Path was set properly', () => {
    const { path } = firstColRef
    const lastPathIndex = path[path.length - 1]
    expect(lastPathIndex).toEqual({ type: 'collection', key: 'oneCol' })
  })

  it('Cannot create collection wtih reserved key', async () => {
    const check = () => {
      NearDB.database(config).collection('collection')
    }
    expect(check).toThrowError('collection: is a reserved keyword')
  })
})

describe('.doc', async () => {
  it('Returns NearDB instance', () => {
    expect(firstDocRef).toBeInstanceOf(NearDB)
  })

  it('Cannot call documents on document', () => {
    const check = () => {
      firstDocRef.doc('newDoc')
    }
    expect(check).toThrowError('Only collections can have documents')
  })

  it('Path was set properly', () => {
    const { path } = firstDocRef
    const lastPathIndex = path[path.length - 1]
    expect(lastPathIndex).toEqual({ type: 'doc', key: 'oneDoc' })
  })

  it('Cannot create doc wtih reserved key', async () => {
    const check = () => {
      firstDocRef.doc('doc')
    }
    expect(check).toThrowError('doc: is a reserved keyword')
  })
})

describe('.set', async () => {
  it('Value can be set on new document', async () => {
    expect.assertions(1)
    let payload = await firstDocRef.set(data)
    expect(payload.ETag).toBeTruthy()
  })

  it('Value can be set on existing document', async () => {
    expect.assertions(1)
    let payload: any
    payload = await firstDocRef.set(data)
    expect(payload.ETag).toBeTruthy()
  })
})

describe('.get', async () => {
  it('Can get a document from origin', async () => {
    expect.assertions(1)
    let payload = await firstDocRef.get({ source: 'origin' })
    expect(payload).toEqual(data)
  })

  it('Can only .get a document', async () => {
    try {
      await firstColRef.get({ source: 'origin' })
    } catch (err) {
      expect(err).toEqual(new Error('Can only use get() method for documents'))
    }
  })

  it('Can get document from edge', async () => {
    expect.assertions(1)
    let payload = await firstDocRef.get({ source: 'edge' })
    expect(typeof payload).toBe('object')
  })

  it('Can get a document', async () => {
    expect.assertions(1)
    let payload = await firstDocRef.get()
    expect(payload).toBeTruthy()
  })

  it('Can get a document from origin when there is no cache', async () => {
    expect.assertions(1)
    await firstDocRef._privateMethods().clearCache()
    let payload = await firstDocRef.get()
    expect(payload).toBeTruthy()
  })
})

describe('.add', async () => {
  const data = {
    firstValue: 3,
    secondValue: 'String'
  }

  it('Check if can .add to collection', async () => {
    expect.assertions(1)
    let payload: any
    payload = await firstColRef.add(data)
    expect(payload.ETag).toBeTruthy()
  })

  it('Can only use .add on collections', async () => {
    expect.assertions(1)

    try {
      await firstDocRef.add(data)
    } catch (err) {
      expect(err).toEqual(new Error('Can only add document to collections'))
    }
  })
})

describe('.update', async () => {
  const updateData = {
    firstValue: 2,
    thirdValue: 'Third Value'
  }

  const checkValue = Object.assign(data, updateData)

  it('Updates fields in the document', async () => {
    expect.assertions(1)
    await firstDocRef.update(updateData)
    let payload = await firstDocRef.get({ source: 'origin' })
    expect(payload).toEqual(checkValue)
  })

  it('Deletes values from document', async () => {
    const deleteData = {
      thirdValue: NearDB.field.deleteValue,
      forthValue: NearDB.field.deleteValue
    }
    expect.assertions(3)
    await firstDocRef.set(data)
    await firstDocRef.update(deleteData)
    let payload = await firstDocRef.get({ source: 'origin' })

    expect(payload).toHaveProperty('firstValue')
    expect(payload).toHaveProperty('secondValue')
    expect(payload).not.toHaveProperty('thirdValue')
  })

  it('Can only update existing documents', async () => {
    expect.assertions(1)

    try {
      let data = await firstColRef.doc(uuid()).update(updateData)
      console.log(data)
    } catch (err) {
      expect(err.code).toEqual('NoSuchKey')
    }
  })
})

describe('.delete', async () => {
  it('Can get a document', async () => {
    expect.assertions(1)
    let payload = await firstDocRef.delete()
    expect(payload).toEqual({})
  })
})

describe('.getRequest', async () => {
  // TODO: losing reference to firstDocRef
  firstColRef = NearDB.database(config).collection('oneCol')
  firstDocRef = firstColRef.doc('oneDoc')
  let { getRequest } = firstDocRef._privateMethods()

  it('Makes a valid request', async () => {
    expect.assertions(1)

    let payload = await getRequest('', 'https://www.google.com')
    expect(payload.status).toEqual(200)
  })

  it('Makes a invalid request', async () => {
    expect.assertions(1)

    try {
      await getRequest('neardb404', 'https://google.com')
    } catch (err) {
      expect(err).toEqual(new Error('Request failed with status code 404'))
    }
  })
})

describe('.cache', async () => {
  let cachedData = {
    cached: true
  }

  it('.setCache', async () => {
    expect.assertions(2)
    await firstDocRef._privateMethods().setCache(cachedData)
    expect(firstDocRef.cache.store).toEqual(cachedData)
    expect(firstDocRef.getCache().expires).toBeGreaterThan(new Date().getTime())
  })

  it('.hasCache', async () => {
    expect.assertions(2)
    await firstDocRef._privateMethods().setCache(cachedData)

    expect(firstDocRef._privateMethods().hasCache()).toEqual(true)
    await timeout(55)
    expect(firstDocRef._privateMethods().hasCache()).toEqual(false)
  })
})
