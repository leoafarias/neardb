import { NearDB, Collection, Document, uuid, HTTP } from '../loader'

import { config } from '../config'
import { createDummyData, createDoc } from '../helpers'

import MockAdapter from 'axios-mock-adapter'
import { getRequestMock } from '../mock-data/getRequest'

// const mock = new MockAdapter(HTTP)
// mock
//   .onGet()
//   .reply(200, getRequestMock, { ETag: '12371812982', VersionId: '123214123' })

jest.setTimeout(15000)

let sampleCol: Collection
let sampleDoc: Document
beforeAll(() => {
  sampleCol = NearDB.database(config).collection('oneCol')
  sampleDoc = sampleCol.doc('oneDoc')
})

describe('.doc', async () => {
  let docKey = 'main'
  let doc = createDoc(docKey)

  it('Returns NearDB instance', () => {
    expect(doc).toBeInstanceOf(Document)
  })
  it('Path was set properly', () => {
    const { path } = doc
    const lastPathIndex = path[path.length - 1]
    expect(lastPathIndex).toEqual({ type: 'document', key: docKey })
  })

  it('Cannot create doc with reserved key', async () => {
    const check = () => {
      createDoc('doc')
    }
    expect(check).toThrowError('doc: is a reserved keyword')
  })
})

describe('.collection', async () => {
  let col = createDoc(uuid()).collection('sampleCol')

  it('Create sub-collection', () => {
    expect(col).toBeInstanceOf(Collection)
  })
})

describe('.set', async () => {
  let docKey = uuid()
  let doc = createDoc(docKey)

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

  it('Cannot set invalid object', async () => {
    expect.assertions(1)
    try {
      let payload: any = 0
      await doc.set(payload)
    } catch (err) {
      expect(err).toEqual(Error('Not a valid object'))
    }
  })
})

describe('.get', async () => {
  let doc = NearDB.database(config)
    .collection('oneCol')
    .doc('oneDoc')
  let data = createDummyData()

  it('Can get a document', async () => {
    await doc.set(data)
    expect.assertions(1)
    let payload = await doc.get()

    expect(typeof payload).toBe('object')
  })

  it('Can get a document from origin when there is no cache', async () => {
    expect.assertions(1)
    doc.cache.clear()
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
})

describe('.update', async () => {
  let doc = createDoc(uuid())
  let data = createDummyData()
  const updateData = createDummyData()

  const checkValue = Object.assign(data, updateData)

  it('Updates fields in the document', async () => {
    expect.assertions(1)
    await doc.set(data)
    await doc.update(updateData)
    let payload = await doc.get()
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
    let payload = await doc.get()

    expect(payload).toHaveProperty(firstKey)
    expect(payload).toHaveProperty(secondKey)
    expect(payload).not.toHaveProperty(thirdKey)
    expect(payload).not.toHaveProperty(forthKey)
  })

  it('Can only update existing documents', async () => {
    expect.assertions(1)

    try {
      // Creates a random document and try to update it
      await createDoc(uuid()).update(updateData)
    } catch (err) {
      expect(err.code).toEqual('NoSuchKey')
    }
  })
})

describe('.delete', async () => {
  let doc = createDoc(uuid())
  let data = createDummyData()

  it('Can delete document', async () => {
    expect.assertions(2)
    await doc.set(data)
    let payload = await doc.get()
    let deletedPayload = await doc.delete()
    // TODO: check error on get
    expect(payload).toEqual(data)
    expect(deletedPayload).toEqual({})
  })
})
