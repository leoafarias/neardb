import { buildPath } from '../src/utils'

jest.setTimeout(5000)

describe('buildPath', () => {
  const docPath = [
    { type: 'collection', key: 'colOne' },
    { type: 'document', key: 'docOne' },
    { type: 'collection', key: 'colTwo' },
    { type: 'document', key: 'docTwo' }
  ]

  const colPath = [
    { type: 'collection', key: 'colOne' },
    { type: 'document', key: 'docOne' },
    { type: 'collection', key: 'colTwo' }
  ]

  it('Adds .json to last document', () => {
    const newPath = buildPath(docPath).split('/')
    const item = newPath[newPath.length - 1].split('.')
    expect(item[0]).toBe(docPath[docPath.length - 1].key)
    expect(item[1]).toBe('json')
  })

  it('Does not add .json to collection', () => {
    const newPath = buildPath(colPath).split('/')
    const item = newPath[newPath.length - 1].split('.')

    expect('collection').toBe(colPath[colPath.length - 1].type)
    expect(item[0]).toBe(colPath[colPath.length - 1].key)
    expect(item[1]).toBeFalsy()
  })
})
