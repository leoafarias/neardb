import { NearDB } from './lib/core';


// IConfig interface with defaults
export interface DBConfig extends Config {
  cacheExpiration: number;
}

// User passed config interface
export interface Config {
  instanceUrl?: string;
  headers?: JsonObject;
  cacheExpiration?: number;
  storage: {
    bucket: string;
    accessKeyId: string; // these a public minio keys so don't worry
    secretAccessKey: string; // these a public minio secret so don't worry
    endpoint?: string;
    useSSL?: boolean;
    s3ForcePathStyle?: boolean;
    signatureVersion?: string;
  };
}

export interface ICache {
  readonly store: JsonObject;
  readonly cacheExpiration: number;
  readonly expires: number;
  readonly etag: string;
  readonly versionId: string;
  set(data: JsonObject): void;
  get(): JsonObject;
  exists(): boolean;
  clear(): void;
}


export interface IStorageAdapter {
  readonly config: Config;
  readonly client: any;
  get(path: PathItem[]): Promise<JsonObject | null>;
  set(value: JsonObject, path: PathItem[], metadata?: JsonObject): Promise<string>;
  update(value: JsonObject, path: PathItem[], metadata?: JsonObject): Promise<void>;
  remove(path: PathItem[]): Promise<void>;
}

export interface Entity {
  instance: NearDB;
  uri: PathItem[];
}

export type GetOptions = {
  source: string;
};

export type PathItem = {
  type: string;
  key: string;
};

/**
Matches a JSON object.
This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. Don't use this as a direct return type as the user would have to double-cast it: `jsonObject as unknown as CustomResponse`. Instead, you could extend your CustomResponse type from it to ensure your type only uses JSON-compatible types: `interface CustomResponse extends JsonObject { … }`.
*/
export type JsonObject = { [Key in string]?: JsonValue };

/**
Matches a JSON array.
*/
export type JsonArray = Array<JsonValue>;

/**
Matches any valid JSON value.
*/
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
