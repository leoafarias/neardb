import { NearDB, Collection } from './loader'
import { config } from './config'

/**
 * NearDB
 */
describe('.database', () => {
  it('NearDB is instantiable', () => {
    expect(NearDB.database(config)).toBeInstanceOf(NearDB)
  })
})

describe('.collection', () => {
  it('Can call collection from NearDB instance', () => {
    const collectionRef = NearDB.database(config).collection('main')
    expect(collectionRef).toBeInstanceOf(Collection)
  })
})
