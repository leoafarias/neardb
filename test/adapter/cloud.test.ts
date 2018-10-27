import CloudStorage from '../../src/adapter/cloud'
import { IConfig } from '../../src/types'

const config: IConfig = {
  storage: {},
  database: 'testdb'
}

describe('cloudstorage', () => {
  const cs = CloudStorage.init(config)
  it('Could not init CloudStorage', () => {
    expect(cs).toBeInstanceOf(CloudStorage)
  })
})
