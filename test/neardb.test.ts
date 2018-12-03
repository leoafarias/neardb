import NearDB from '../src/neardb'
import { config } from './config'
import { uuid } from '../src/lib/utils'
import { createDummyData, createDoc } from './helpers'
import MockAdapter from 'axios-mock-adapter'
import { getRequestMock } from './mock-data/getRequest'
import HTTP from '../src/lib/http'

const mock = new MockAdapter(HTTP)
// Returns a failed promise with Error('Network Error');
mock.onGet('/networkError').networkError()
mock.onGet().reply(200, getRequestMock)

jest.setTimeout(15000)

let sampleCol: NearDB
let sampleDoc: NearDB

// let instance: any

beforeAll(() => {
  sampleCol = NearDB.database(config).collection('oneCol')
  sampleDoc = sampleCol.doc('oneDoc')
})
/**
 * NearDB
 */
describe('.database', () => {
  it('NearDB is instantiable', () => {
    expect(NearDB.database(config)).toBeInstanceOf(NearDB)
  })
})

describe('.collection', () => {
  let colKey = 'main'
  let colRef = NearDB.database(config).collection(colKey)
  it('Returns NearDB instance', () => {
    expect(colRef).toBeInstanceOf(NearDB)
  })

  it('Cannot call collections on collections', () => {
    const check = () => {
      colRef.collection('subCollection')
    }
    expect(check).toThrowError('Only documents can have sub-collections')
  })

  it('Path was set properly', () => {
    const { path } = colRef
    const lastPathIndex = path[path.length - 1]
    expect(lastPathIndex).toEqual({ type: 'collection', key: colKey })
  })

  it('Cannot create collection wtih reserved key', async () => {
    const check = () => {
      NearDB.database(config).collection('collection')
    }
    expect(check).toThrowError('collection: is a reserved keyword')
  })
})

describe('.doc', async () => {
  let docKey = 'main'
  let doc = createDoc(docKey, {})

  it('Returns NearDB instance', () => {
    expect(doc).toBeInstanceOf(NearDB)
  })

  it('Cannot call documents on document', () => {
    const check = () => {
      doc.doc('newDoc')
    }
    expect(check).toThrowError('Only collections can have documents')
  })

  it('Path was set properly', () => {
    const { path } = doc
    const lastPathIndex = path[path.length - 1]
    expect(lastPathIndex).toEqual({ type: 'doc', key: docKey })
  })

  it('Cannot create doc wtih reserved key', async () => {
    const check = () => {
      doc.doc('doc')
    }
    expect(check).toThrowError('doc: is a reserved keyword')
  })
})

describe('.set', async () => {
  let docKey = uuid()
  let doc = createDoc(docKey, {})
  let indicesDoc = createDoc(docKey, { indices: true })

  it('Value can be set on new document', async () => {
    expect.assertions(1)
    let payload: any = await doc.set(createDummyData())
    expect(payload.ETag).toBeTruthy()
  })

  it('Value can be set on existing document', async () => {
    expect.assertions(1)
    let payload: any
    payload = await doc.set(createDummyData())
    expect(payload.ETag).toBeTruthy()
  })

  it('Update indices', async () => {
    // Use same key not to trigger a new
    expect.assertions(1)
    let payload: any
    payload = await indicesDoc.set(createDummyData())
    expect(payload.ETag).toBeTruthy()
  })

  it('Update indices new doc', async () => {
    // Use same key not to trigger a new
    expect.assertions(1)
    let payload: any
    payload = await indicesDoc.set(createDummyData())
    expect(payload.ETag).toBeTruthy()
  })

  it('Cannot set invalid value', async () => {
    expect.assertions(1)

    let value: any
    value = 2

    try {
      await doc.set(value)
    } catch (err) {
      expect(err).toEqual(new Error('Cannot set invalid value'))
    }
  })

  // it('Creates new indices for new document in collection', async () => {
  //   expect.assertions(1)
  //   let payload: any
  //   await doc.updateCollectionIndices(doc.path, createDummyData())
  //   payload = await doc.set(createDummyData())
  //   expect(payload.ETag).toBeTruthy()
  // })
})

describe('.get', async () => {
  // TODO: Make this dynamic with axios mocks
  let doc = NearDB.database(config)
    .collection('oneCol')
    .doc('oneDoc')
  let data = createDummyData()

  it('Can get a document from origin', async () => {
    expect.assertions(1)
    await doc.set(data)
    let payload = await doc.get({ source: 'origin' })
    expect(payload).toEqual(data)
  })

  it('Can only .get a document', async () => {
    try {
      await sampleCol.get({ source: 'origin' })
    } catch (err) {
      expect(err).toEqual(new Error('Can only use get() method for documents'))
    }
  })

  it('Can get document from edge', async () => {
    expect.assertions(1)
    let payload = await doc.get({ source: 'edge' })
    expect(typeof payload).toBe('object')
  })

  it('Can get a document', async () => {
    expect.assertions(1)
    let payload = await doc.get()
    expect(payload).toBeTruthy()
  })

  it('Can get a document from origin when there is no cache', async () => {
    expect.assertions(1)
    await doc.cache.clear()
    let payload = await doc.get()
    expect(payload).toBeTruthy()
  })
})

describe('.add', async () => {
  let data = createDummyData()

  it('Check if can .add to collection', async () => {
    expect.assertions(1)
    let payload: any
    payload = await sampleCol.add(data)
    expect(payload.ETag).toBeTruthy()
  })

  it('Can only use .add on collections', async () => {
    expect.assertions(1)

    try {
      await sampleDoc.add(data)
    } catch (err) {
      expect(err).toEqual(new Error('Can only add document to collections'))
    }
  })
})

describe('.update', async () => {
  let doc = createDoc(uuid(), {})
  let data = createDummyData()
  const updateData = createDummyData()

  const checkValue = Object.assign(data, updateData)

  it('Updates fields in the document', async () => {
    expect.assertions(1)
    await doc.set(data)
    await doc.update(updateData)
    let payload = await doc.get({ source: 'origin' })
    expect(payload).toEqual(checkValue)
  })

  it('Deletes values from document', async () => {
    let firstKey = Object.keys(updateData)[0]
    let secondKey = Object.keys(updateData)[1]
    let thirdKey = Object.keys(updateData)[2]
    let forthKey = Object.keys(updateData)[3]

    let deleteData = {}
    deleteData[thirdKey] = NearDB.field.deleteValue
    deleteData[forthKey] = NearDB.field.deleteValue

    expect.assertions(4)
    await doc.set(updateData)
    await doc.update(deleteData)
    let payload = await doc.get({ source: 'origin' })

    expect(payload).toHaveProperty(firstKey)
    expect(payload).toHaveProperty(secondKey)
    expect(payload).not.toHaveProperty(thirdKey)
    expect(payload).not.toHaveProperty(forthKey)
  })

  it('Can only update existing documents', async () => {
    expect.assertions(1)

    try {
      // Creates a random document and try to update it
      await createDoc(uuid(), {}).update(updateData)
    } catch (err) {
      expect(err.code).toEqual('NoSuchKey')
    }
  })
})

describe('.delete', async () => {
  let doc = createDoc(uuid(), {})
  let data = createDummyData()

  it('Can delete document', async () => {
    expect.assertions(2)
    await doc.set(data)
    let payload = await doc.get({ source: 'origin' })
    let deletedPayload = await doc.delete()
    // TODO: check error on get
    expect(payload).toEqual(data)
    expect(deletedPayload).toEqual({})
  })
})

describe('.getRequest', async () => {
  let doc = createDoc(uuid(), {})

  let { getFromEdge } = doc._privateMethods()

  it('Makes a valid request', async () => {
    expect.assertions(1)

    let payload = await getFromEdge('/200')
    expect(typeof payload).toEqual('object')
  })

  it('Makes a invalid request', async () => {
    expect.assertions(1)

    try {
      let payload = await getFromEdge('/networkError')
      console.log(payload)
    } catch (err) {
      expect(err).toEqual(new Error('Network Error'))
    }
  })
})
