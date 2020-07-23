import S3 from 'aws-sdk/clients/s3';
import { documentPath } from '../lib/utils';
import { Config, IStorageAdapter, JsonObject, PathItem } from '../types';
import constants from '../lib/constants';

export class S3Adapter implements IStorageAdapter {
  readonly config: Config;
  readonly client: S3;

  constructor(config: Config) {
    this.config = config;
    this.client = new S3(this.config.storage);
  }

  static init(config: Config): S3Adapter {
    return new S3Adapter(config);
  }

  async set(value: JsonObject, path: PathItem[]): Promise<string> {
    const fileKey = documentPath(path);
    const params = {
      Body: JSON.stringify(value),
      Bucket: this.config.storage.bucket,
      Key: fileKey,
    };

    await this.client.putObject(params).promise();
    return fileKey;
  }

  async update(value: JsonObject, path: PathItem[]): Promise<void> {
    const doc = (await this.get(path)) || {};

    // Loop through all property for custom object actions
    for (const prop in value) {
      if (value[prop] === constants.deleteValue) {
        // If has deleteValue action, delete the prop
        delete value[prop];
        delete doc[prop];
      }
    }

    const updatedValue = {
      ...doc,
      ...value,
    };

    await this.set(updatedValue, path);
  }

  async get(path: PathItem[]): Promise<JsonObject | null> {
    const fileKey = documentPath(path);
    const params = {
      Bucket: this.config.storage.bucket,
      Key: fileKey,
    };

    const data = await this.client.getObject(params).promise();
    // Convert Buffer to object
    if (!data.Body) return null;
    return JSON.parse(data.Body.toString('utf8'));
  }

  async remove(path: PathItem[]): Promise<void> {
    const fileKey = documentPath(path);
    const params = {
      Bucket: this.config.storage.bucket,
      Key: fileKey,
    };

    await this.client.deleteObject(params).promise();
  }
}
