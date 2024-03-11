import { BaseFileService } from '../base-file-service';
import { ConfigInvalidEnumError, ConfigItemMissingError } from '../errors';
import { FileUpload, FileServiceConfig, FileService } from '../types';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  StorageClass,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

enum UrlFormats {
  public = 'public',
  private = 'private',
}

export class AmazonS3FileService
  extends BaseFileService
  implements FileService
{
  client: S3Client;
  region: string;
  bucket: string;
  urlFormat: string;

  validateConfig(config: FileServiceConfig) {
    if (!config.region) {
      throw new ConfigItemMissingError('region');
    }

    if (!config.bucket) {
      throw new ConfigItemMissingError('bucket');
    }

    // enums enumerate values weirdly, so do it by key
    const validUrlFormats = Object.keys(UrlFormats).map(
      (key) => UrlFormats[key],
    );

    if (!validUrlFormats.includes(config.url_format)) {
      throw new ConfigInvalidEnumError('url_format', validUrlFormats);
    }
  }

  configure(config: FileServiceConfig) {
    super.configure(config);

    // set local props based on validated config items
    this.client = new S3Client({
      region: config.region,
    });

    this.region = config.region;
    this.bucket = config.bucket;
    this.urlFormat = config.url_format;
  }

  private async _generateUrl(region: string, bucket: string, key: string) {
    // if it's supposed to be private, return a signed url
    if (this.urlFormat == UrlFormats.private) {
      return getSignedUrl(
        this.client,
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );
    }

    // otherwise treat it as public
    return Promise.resolve(
      `https://${bucket}.s3.${region}.amazonaws.com/${key}`,
    );
  }

  private _generateId(path: string) {
    return ['s3', this.region, this.bucket, path].join(':');
  }

  async putFile(prefix: string, key: string, file: FileUpload) {
    const bucket = this.bucket;
    const rand = Math.round(Math.random() * 1000000);
    const path = `${prefix}/${rand}/${key}/${file.name}`;

    const request: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: path,
      Body: file.contents,
      ContentLength: file.size,
      ContentType: file.contentType,

      // The storage class to use
      // Could be an option later, but hardcode as STANDARD for now
      StorageClass: StorageClass.STANDARD,
    };

    // We don't need the response
    await this.client.send(new PutObjectCommand(request));

    const url = await this._generateUrl(this.region, bucket, path);

    return {
      id: this._generateId(path),
      url: url,
    };
  }

  async generateDownloadUrl(id: string) {
    // id is in format s3:<region>:<bucket>:<path>
    const parts = id.split(':');

    const region = parts[1];
    const bucket = parts[2];
    const path = parts[3];

    return this._generateUrl(region, bucket, path);
  }
}
