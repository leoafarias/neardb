import { documentPath, documentPathKey, isReservedKey, uuid, checkValidObject } from '../../src/internal';
import { isGuid } from '../helpers';

jest.setTimeout(10000);

const docPath = [
  { type: 'collection', key: 'colOne' },
  { type: 'document', key: 'docOne' },
  { type: 'collection', key: 'colTwo' },
  { type: 'document', key: 'docTwo' },
];

const colPath = [
  { type: 'collection', key: 'colOne' },
  { type: 'document', key: 'docOne' },
  { type: 'collection', key: 'colTwo' },
];

describe('documentPath', () => {
  it('Does not add .json to first document', () => {
    const newPath = documentPath(docPath).split('/');
    const item = newPath[newPath.length - 3].split('.');
    expect(item[0]).toBe(docPath[docPath.length - 3].key);
    expect(item[1]).toBe(undefined);
  });

  it('Adds .json to last document', () => {
    const newPath = documentPath(docPath).split('/');
    const item = newPath[newPath.length - 1].split('.');
    expect(item[0]).toBe(docPath[docPath.length - 1].key);
    expect(item[1]).toBe('json');
  });

  it('Does not add .json to collection', () => {
    const newPath = documentPath(colPath).split('/');
    const item = newPath[newPath.length - 1].split('.');

    expect('collection').toBe(colPath[colPath.length - 1].type);
    expect(item[0]).toBe(colPath[colPath.length - 1].key);
    expect(item[1]).toBeFalsy();
  });
});

describe('reservedKey', () => {
  it('the following keys are served', () => {
    const reservedWords = ['_meta', 'collection', 'doc', 'indices'];
    expect.assertions(reservedWords.length);
    reservedWords.forEach((item) => {
      if (isReservedKey(item)) {
        expect(true).toBe(true);
      } else {
        throw Error(item + ': should be a reserved word');
      }
    });
  });
});

describe('checkValidObject', () => {
  it('Detects valid objects', () => {
    expect(checkValidObject({})).toEqual(true);
  });

  it('Detects invalid objects', () => {
    const check = () => {
      checkValidObject(0);
    };
    expect(check).toThrowError('Not a valid object');
  });
});

describe('documentPathKey', () => {
  it('Can get documentPathKey of document', () => {
    expect.assertions(1);
    const docKey = documentPathKey(docPath);

    expect(docKey).toEqual(docPath[docPath.length - 1].key);
  });

  it('Cannot get documentPathKey of collection', () => {
    expect.assertions(1);
    try {
      const result = documentPathKey(colPath);
      console.log(result);
    } catch (err) {
      expect(err).toEqual(Error('last Item in path is not a document'));
    }
  });
});

describe('uuid', () => {
  it('valid uuid', () => {
    const uuidValue = uuid();
    if (isGuid(uuidValue)) {
      expect(uuidValue).toBeTruthy();
    } else {
      throw Error('Not a valid UUID');
    }
  });
});
