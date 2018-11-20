import {
  documentPath,
  documentPathKey,
  reservedKey,
  collectionIndicesPath,
  uuid
} from '../../src/lib/utils'
import { isGuid } from '../helpers'
jest.setTimeout(10000)

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

const brokenPath = [
  { type: 'collection', key: 'colOne' },
  { type: 'doc', key: 'docOne' },
  { type: 'documentz', key: 'colTwo' }
]

describe('documentPath', () => {
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

  it('Cannot get documentPathKey of collection', () => {
    expect.assertions(1)
    try {
      let result = documentPathKey(colPath)
      console.log(result)
    } catch (err) {
      expect(err).toEqual(Error('last Item in path is not a document'))
    }
  })
})

describe('reservedKey', () => {
  it('the following keys are served', () => {
    const reservedWords = ['_meta', 'collection', 'doc', 'indices']
    expect.assertions(reservedWords.length)
    reservedWords.forEach(item => {
      if (reservedKey(item)) {
        expect(true).toBe(true)
      } else {
        throw new Error(item + ': should be a reserved word')
      }
    })
  })
})

describe('uuid', () => {
  it('valid uuid', () => {
    let uuidValue = uuid()
    if (isGuid(uuidValue)) {
      expect(uuidValue).toBeTruthy()
    } else {
      throw new Error('Not a valid UUID')
    }
  })
})

describe('collectionIndicesPath', () => {
  let matchString = 'colOne/docOne/colTwo/_meta/indices.json'
  it('Returns if path is a doc', () => {
    let newDocPath = collectionIndicesPath(docPath)
    expect(newDocPath).toBe(matchString)
  })

  it('Returns if path is a collection', () => {
    let newColPath = collectionIndicesPath(colPath)
    expect(newColPath).toBe(matchString)
  })

  it('Cannot get collectionIndices of invalid collection', () => {
    try {
      let newColPath = collectionIndicesPath(brokenPath)
    } catch (err) {
      expect(err).toEqual(
        Error('Cannot create indices with invalid collection')
      )
    }
  })
})
