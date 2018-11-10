import { documentPath, reservedKey, uuid } from '../src/utils'

jest.setTimeout(5000)

function isGuid(uuid: string) {
  if (uuid[0] === '{') {
    uuid = uuid.substring(1, uuid.length - 1)
  }
  const regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi
  return regexGuid.test(uuid)
}

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
