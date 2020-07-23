import { config } from '../config';
import { NearDB, Collection } from '../loader';

describe('.collection', () => {
  const colKey = 'main';
  const colRef = NearDB.database(config).collection(colKey);
  it('Returns NearDB instance', () => {
    expect(colRef).toBeInstanceOf(Collection);
  });

  it('Path was set properly', () => {
    const { uri: path } = colRef;
    const lastPathIndex = path[path.length - 1];
    expect(lastPathIndex).toEqual({ type: 'collection', key: colKey });
  });

  it('Cannot create collection wtih reserved key', async () => {
    const check = () => {
      NearDB.database(config).collection('collection');
    };
    expect(check).toThrowError('collection: is a reserved keyword');
  });
});
