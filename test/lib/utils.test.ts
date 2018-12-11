import {
  documentPath,
  documentPathKey,
  reservedKey,
  collectionIndicesPath,
  uuid,
  iterationCopy
} from '../../src/lib/utils'
import { isGuid, createDummyData } from '../helpers'

jest.setTimeout(10000)

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

const brokenPath = [
  { type: 'collection', key: 'colOne' },
  { type: 'document', key: 'docOne' },
  { type: 'documentz', key: 'colTwo' }
]

const sampleObject = createDummyData()

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

describe('documentPathKey', () => {
  it('Can get documentPathKey of document', () => {
    expect.assertions(1)
    let docKey = documentPathKey(docPath)

    expect(docKey).toEqual(docPath[docPath.length - 1].key)
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

describe('iterationCopy', () => {
  it('Copies object', () => {
    expect(sampleObject).toEqual(iterationCopy(sampleObject))
    expect(sampleObject).not.toBe(iterationCopy(sampleObject))
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
