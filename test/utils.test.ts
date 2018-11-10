import { documentPath } from '../src/utils'

jest.setTimeout(5000)

describe('documentPath', () => {
  const docPath = [
    { type: 'collection', key: 'colOne' },
    { type: 'doc', key: 'docOne' },
    { type: 'collection', key: 'colTwo' },
    { type: 'doc', key: 'docTwo' }
  ]

  const colPath = [
    { type: 'collection', key: 'colOne' },
    { type: 'doc', key: 'docOne' },
    { type: 'collection', key: 'colTwo' }
  ]

  it('Does not add .json to first document', () => {
    const newPath = documentPath(docPath).split('/')
    const item = newPath[newPath.length - 3].split('.')
    expect(item[0]).toBe(docPath[docPath.length - 3].key)
    expect(item[1]).toBe(undefined)
  })

  it('Adds .json to last document', () => {
    const newPath = documentPath(docPath).split('/')
    const item = newPath[newPath.length - 1].split('.')
    expect(item[0]).toBe(docPath[docPath.length - 1].key)
    expect(item[1]).toBe('json')
  })

  it('Does not add .json to collection', () => {
    const newPath = documentPath(colPath).split('/')
    const item = newPath[newPath.length - 1].split('.')

    expect('collection').toBe(colPath[colPath.length - 1].type)
    expect(item[0]).toBe(colPath[colPath.length - 1].key)
    expect(item[1]).toBeFalsy()
  })
})
