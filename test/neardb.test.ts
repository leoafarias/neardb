import NearDB from '../src/neardb'
import { IConfig, PathList } from '../src/types'

const config: IConfig = {
  storage: {}
}
const setDB = () => {
  return NearDB.database(config)
}

const handleError = (err: any) => {
  console.error(err)
  throw new Error(err)
}
/**
 * NearDB
 */
describe('NearDB Init', () => {
  const newInstance = setDB()
  it('NearDB is instantiable', () => {
    expect(newInstance).toBeInstanceOf(NearDB)
  })

  it('Config is set properly', () => {
    expect(config.storage).toBe(newInstance.config.storage)
  })
})

describe('.collection', () => {
  const firstCollection = 'firstCol'
  const secondCollection = 'secondCol'
  const colRef = setDB().collection(firstCollection)

  it('Check collection reference is instantiable', () => {
    expect(colRef).toBeInstanceOf(NearDB)
  })

  it('Collection path is set properly', () => {
    const lastPathItem = colRef.path[colRef.path.length - 1]

    expect(lastPathItem.key).toBe(firstCollection)
    expect(lastPathItem.type).toBe('collection')
  })

  it('Cannot set collection of a collection', async () => {
    async function check() {
      colRef.collection(secondCollection)
    }
    await expect(check()).rejects.toThrow(Error)
  })

  it('Set a sub-collection', () => {
    const subCol = colRef.doc('docID').collection(secondCollection)
    const lastPathItem = subCol.path[subCol.path.length - 1]

    expect(lastPathItem.key).toBe(secondCollection)
    expect(lastPathItem.type).toBe('collection')
  })
})

describe('.doc', () => {
  const firstCollection = 'firstCol'
  const secondCollection = 'secondCol'
  const firstDoc = 'firstDoc'
  const secondDoc = 'secondDoc'

  const docRef = setDB()
    .collection(firstCollection)
    .doc(firstDoc)

  it('Check document reference is instantiable', () => {
    expect(docRef).toBeInstanceOf(NearDB)
  })

  it('Document path is set properly', () => {
    const lastPathItem = docRef.path[docRef.path.length - 1]

    expect(lastPathItem.key).toBe(firstDoc)
    expect(lastPathItem.type).toBe('doc')
  })

  it('Cannot set a document of a document', async () => {
    async function check() {
      docRef.doc(secondDoc)
    }
    await expect(check()).rejects.toThrow(Error)
  })

  it('Set a document in a sub-collection', () => {
    const subCol = docRef.collection(secondCollection).doc(secondDoc)
    const lastPathItem = subCol.path[subCol.path.length - 1]

    expect(lastPathItem.key).toBe(secondDoc)
    expect(lastPathItem.type).toBe('doc')
  })
})

describe('.set', () => {
  const firstColRef = setDB().collection('firstLevelCol')

  let data = {
    firstValue: 3,
    secondValue: 'String'
  }

  it('Value can be set on new document', () => {
    firstColRef
      .doc('newDoc')
      .set(data)
      .then(result => {
        expect(result).toBe(data)
      })
  })

  it('Value can be set on existing document', () => {
    let newData = {
      firstValue: 4,
      secondValue: 'Another String'
    }
    firstColRef
      .doc('newDoc')
      .set(newData)
      .then(result => {
        expect(result).toBe(newData)
      })
  })

  it('Value can be set on new nested documents', () => {
    firstColRef
      .doc('newDoc')
      .collection('secondLevelCol')
      .doc('secondLevelDoc')
      .set(data)
      .then(result => {
        expect(result).toBe(data)
      })
  })

  it('Value can be set on new nested documents', () => {
    let newData = {
      firstValue: 4,
      secondValue: 'Another String'
    }

    firstColRef
      .doc('newDoc')
      .collection('secondLevelCol')
      .doc('secondLevelDoc')
      .set(newData)
      .then(result => {
        expect(result).toBe(newData)
      })
  })

  it('Does not duplicate path items', () => {
    const firstColRef = setDB().collection('firstLevelCol')
    firstColRef.doc('newDoc')
    firstColRef.doc('newDoc')
    expect(firstColRef.path[0].key).toBe('firstLevelCol')
  })
})

describe('.get', () => {
  const firstDocRef = setDB()
    .collection('firstLevelCol')
    .doc('firstLevelDoc')

  let data = {
    firstValue: 3,
    secondValue: 'String'
  }

  it('Can get a document', () => {
    firstDocRef
      .set(data)
      .then(result => {
        firstDocRef
          .get()
          .then(payload => {
            expect(payload).toBe(data)
          })
          .catch(err => {
            handleError(err)
          })
      })
      .catch(err => {
        handleError(err)
      })
  })

  // it('Cannot .get on collection', () => {
  //   expect(true).toBe(false)
  // })
})

describe('.add', () => {
  const colRef = setDB().collection('firstLevelCol')

  const data = {
    firstValue: 3,
    secondValue: 'String'
  }

  it('Check if value is added to the collection', () => {
    colRef.add(data)
    expect(colRef).toBeInstanceOf(NearDB)
  })

  it('Cannot use add method on doc', async () => {
    await expect(colRef.doc('docID').add(data)).rejects.toThrow(Error)
  })
})
