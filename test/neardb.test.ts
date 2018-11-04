import NearDB from '../src/neardb'
import { IConfig, PathList } from '../src/types'
import CloudStorage from '../src/adapter/cloud'
import { config } from './config'
import { uuid } from '../src/utils'

config.database = 'testdb'

jest.setTimeout(5000)

let setDB: any
let firstColRef: any
let firstDocRef: any

const data = {
  firstValue: 3,
  secondValue: 'String'
}

beforeAll(async () => {
  firstColRef = NearDB.database(config).collection('oneCol')
  firstDocRef = firstColRef.doc('oneDoc')
  // try {
  //   let exists = await CloudStorage.init(config).bucketExists()
  //   return
  // } catch (err) {
  //   console.log(err)
  // }

  // try {
  //   await CloudStorage.init(config).createBucket()
  // } catch (err) {
  //   throw new Error(err)
  // }
})

afterAll(async () => {
  // await firstColRef.delete()
  // return CloudStorage.init(config).deleteBucket()
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
})

describe('.doc', () => {
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
  it('Can get a document', async () => {
    expect.assertions(1)
    let payload = await firstDocRef.get({ source: 'origin' })
    expect(payload).toEqual(data)
  })

  it('Can only .get a document', async () => {
    try {
      firstColRef.get({ source: 'origin' })
    } catch (err) {
      expect(err).toEqual(new Error('Can only use get() method for documents'))
    }
  })

  it('Can get a document from CDN', async () => {
    expect.assertions(1)
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
      thirdValue: NearDB.field.deleteValue
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
      await firstColRef.doc('newDoc').update(updateData)
    } catch (err) {
      expect(err).toEqual(
        new Error('NearDB.update: NoSuchKey: The specified key does not exist.')
      )
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
