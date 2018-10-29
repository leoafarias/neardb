import { buildPath } from '../src/utils'

jest.setTimeout(5000)

describe('buildPath', () => {
  const path = [
    { type: 'collection', key: 'colOne' },
    { type: 'document', key: 'docOne' },
    { type: 'collection', key: 'colTwo' },
    { type: 'document', key: 'docTwo' }
  ]

  it('BuidPath adds json to last document', () => {
    expect(buildPath(path)).toBe('test')
  })
})
