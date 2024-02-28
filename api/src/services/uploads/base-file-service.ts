import { FileServiceConfig } from './types';

export abstract class BaseFileService {
  private _isConfigured: boolean;
  private _config: FileServiceConfig;

  configure(config: FileServiceConfig) {
    this._isConfigured = true;
    this.validateConfig(config);
    this._config = config;
  }

  abstract validateConfig(config: FileServiceConfig): void;

  get isConfigured() {
    return this._isConfigured;
  }

  get config() {
    return this._config;
  }
}
