import { Config, IStorageAdapter, JsonObject, PathItem } from '../types';
import { HTTP } from '../lib/http';
import { AxiosInstance } from 'axios';

export class NowAdapter implements IStorageAdapter {
  readonly config: Config;
  readonly client: AxiosInstance;

  constructor(config: Config) {
    this.config = config;
    this.client = HTTP.create({
      baseURL: this.config.instanceUrl,
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static init(config: Config): NowAdapter {
    return new NowAdapter(config);
  }

  async set(value: JsonObject, path: PathItem[]): Promise<string> {
    const payload = await this.client.post('/', value, {
      params: { path: JSON.stringify(path) },
    });
    return payload.data;
  }

  async update(value: JsonObject, path: PathItem[]): Promise<void> {
    const payload = await this.client.put('', value, {
      params: { path: JSON.stringify(path) },
    });
    return payload.data;
  }

  async get(path: PathItem[]): Promise<JsonObject> {
    const payload = await this.client.get('', {
      params: { path: JSON.stringify(path) },
    });
    return payload.data;
  }

  async remove(path: PathItem[]): Promise<void> {
    const payload = await this.client.delete('', {
      params: { path: JSON.stringify(path) },
    });
    return payload.data;
  }
}
