import { PathItem } from '../types';

/**
 * Builds a document url out of the array of path item
 * @param path an array of the path, to build final url
 * @returns string of the final path with extension of the document
 */
export const documentPath = (path: PathItem[]): string => {
  // Needs to be a valid array
  if (!Array.isArray(path)) {
    throw Error('Not a valid path');
  }
  const pathArray = path.map((item, index) => {
    if (path.length === index + 1 && item.type === 'document') {
      // This is the last item
      return item.key + '.json';
    } else {
      // not the last item
      return item.key;
    }
  });

  return pathArray.join('/');
};

export const documentPathKey = (path: PathItem[]): string => {
  const lastItem = path[path.length - 1];
  if (lastItem.type === 'document') {
    return lastItem.key;
  } else {
    throw Error('last Item in path is not a document');
  }
};

export const checkValidObject = (obj: any) => {
  if (typeof obj === 'object' && obj instanceof Object && !(obj instanceof Array)) {
    return true;
  } else {
    throw Error('Not a valid object');
  }
};

const reservedKeyWords: { [key: string]: boolean } = {
  _meta: true,
  collection: true,
  doc: true,
  indices: true,
};

/**
 * Check if key that is used for document or collection is reserved
 * @param keyword to check
 * @returns true if its a reserved key
 */
export function isReservedKey(keyword: string): boolean {
  return reservedKeyWords[keyword];
}

/**
 * Creates a random uuid
 * @returns an uuid
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;

    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
