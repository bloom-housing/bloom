import { Readable } from 'stream';

export interface FileService {
  isConfigured: boolean;
  config: FileServiceConfig;
  configure(config: FileServiceConfig): void;
  putFile(
    prefix: string,
    key: string,
    file: FileUpload,
  ): Promise<FileUploadResult>;
  generateDownloadUrl(id: string): Promise<string>;
}

export interface FileUpload {
  name: string;
  contentType: string;
  size: number;
  contents: Readable;
}

export type FileServiceConfig = Record<string, string>;

export interface FileUploadResult {
  id: string;
  url: string;
}
