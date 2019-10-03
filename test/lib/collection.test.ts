import { NearDB, Collection, Document } from '../loader'
import { config } from '../config'

let sampleCol: Collection
let sampleDoc: Document

// let instance: any

beforeAll(() => {
  sampleCol = NearDB.database(config).collection('oneCol')
  sampleDoc = sampleCol.doc('oneDoc')
})

describe('.collection', () => {
  let colKey = 'main'
  let colRef = NearDB.database(config).collection(colKey)
  it('Returns NearDB instance', () => {
    expect(colRef).toBeInstanceOf(Collection)
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
