import NearDB from '../src/neardb'
import { config } from './config'

/**
 * NearDB
 */
describe('.database', () => {
  it('NearDB is instantiable', () => {
    expect(NearDB.database(config)).toBeInstanceOf(NearDB)
  })
})
