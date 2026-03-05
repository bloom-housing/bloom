import { AwsCredentialIdentity } from '@aws-sdk/types';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import { createReadStream } from 'fs';

@Injectable()
export class S3Service {
  s3Client: S3Client;
  region: string;
  privateBucket: string;
  publicBucket: string;

  constructor() {
    this.region = process.env.S3_REGION;
    if (!this.region) {
      console.error('S3_REGION is not set.');
    }
    this.privateBucket = process.env.S3_BUCKET || process.env.S3_PRIVATE_BUCKET; // keep backwards compatibility with the S3_BUCKET env var.
    if (!this.privateBucket) {
      console.error('S3_PRIVATE_BUCKET is not set.');
    }
    this.publicBucket = process.env.S3_PUBLIC_BUCKET;
    if (!this.publicBucket) {
      console.error('S3_PUBLIC_BUCKET is not set.');
    }

    let credentials: undefined | AwsCredentialIdentity;
    const keyId = process.env.S3_ACCESS_TOKEN;
    const secret = process.env.S3_SECRET_TOKEN;
    if (keyId || secret) {
      if (!keyId) {
        console.error('S3_ACCESS_TOKEN is not set.');
      }
      if (!secret) {
        console.error('S3_SECRET_TOKEN is not set.');
      }
      console.log(
        'Using S3_ACCESS_TOKEN and S3_SECRET_TOKEN to authenticate to S3.',
      );
      credentials = {
        accessKeyId: keyId,
        secretAccessKey: secret,
      };
    }

    this.s3Client = new S3Client({ credentials, region: this.region });
  }

  async uploadToPrivate(key: string, pathToFile: string): Promise<void> {
    try {
      const file = createReadStream(pathToFile);

      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.privateBucket,
          Key: key,
          Body: file,
        },
      });

      await upload.done();
      file.destroy();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async urlForPrivate(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.privateBucket,
      Key: key,
    });
    return getSignedUrl(this.s3Client, command, {
      expiresIn: 60 * 5, // seconds. Expires 5 minutes after generation
    });
  }

  async uploadURLForPublic(key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.publicBucket,
      Key: key,
    });
    return getSignedUrl(this.s3Client, command);
  }

  urlForPublic(key: string): string {
    return `https://${this.publicBucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
