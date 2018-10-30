import NearDB from '../src/neardb'
import { IConfig, PathList } from '../src/types'
import CloudStorage from '../src/adapter/cloud'

const config: IConfig = {
  type: 'cloud',
  database: 'testdb',
  storage: CloudStorage,
  options: {
    endpoint: 'http://192.168.86.24:9000',
    useSSL: false,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    accessKeyId: 'LC02CKR2P36U9098AQ98',
    secretAccessKey: 'e9WMdVjn_XtbrjjBEbdGg5kUEphmTIVhNgoBEKpT'
  }
}

const setDB = () => {
  return NearDB.database(config)
}

const firstColRef = setDB().collection('oneCol')
const firstDocRef = firstColRef.doc('oneDoc')

const data = {
  firstValue: 3,
  secondValue: 'String'
}
/**
 * NearDB
 */
describe('NearDB Init', () => {
  const newInstance = setDB()
  it('NearDB is instantiable', () => {
    expect(newInstance).toBeInstanceOf(NearDB)
  })

  it('Config is set properly', () => {
    expect(config).toEqual(newInstance.config)
  })
})

describe('.collection', () => {
  return true
})

describe('.doc', () => {
  return true
})

describe('.set', async () => {
  it('Value can be set on new document', async () => {
    expect.assertions(1)
    let payload: any
    payload = await firstDocRef.set(data)
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
    let payload = await firstDocRef.get()
    expect(payload).toEqual(data)
  })
})

describe('.add', async () => {
  const data = {
    firstValue: 3,
    secondValue: 'String'
  }

  it('Check if value is added to the collection', async () => {
    expect.assertions(1)
    let payload: any
    payload = await firstColRef.add(data)
    expect(payload.ETag).toBeTruthy()
  })

  it('Cannot use add method on doc', async () => {
    return true
  })
})
