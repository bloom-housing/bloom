import { formatUrl } from '@aws-sdk/util-format-url';
import { Hash } from '@smithy/hash-node';
import { HttpRequest } from '@smithy/protocol-http';
import { InternalServerErrorException } from '@nestjs/common';
import { parseUrl } from '@smithy/url-parser';
import { S3Client } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';

export const checkArgs = (args: Record<string, string>): void => {
  Object.keys(args).forEach((key) => {
    if (!args[key]) {
      throw new InternalServerErrorException(
        `S3 env variable ${key} is missing`,
      );
    }
  });
};

/**
 * @param accessKeyId the AWS service account access key
 * @param bucket the s3 bucket the object lives inside of
 * @param key the key for the object we want a presigned url for
 * @param region the region the s3 bucket exists in. Specified in AWS
 * @param secretAccessKey the AWS service account secret key
 * @returns the presigned url for downloading a file
 */
export const generatePresignedGetURL = async (
  accessKeyId: string,
  bucket: string,
  key: string,
  region: string,
  secretAccessKey: string,
): Promise<string> => {
  checkArgs({
    accessKeyId,
    bucket,
    region,
    secretAccessKey,
  });
  const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`);
  const presigner = new S3RequestPresigner({
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    region,
    sha256: Hash.bind(null, 'sha256'),
  });

  const signedUrlObject = await presigner.presign(new HttpRequest(url), {
    expiresIn: 1000 * 60 * 5, // expires 5 minutes after generation
  });

  return formatUrl(signedUrlObject);
};

/**
 *
 * @param accessKeyId the AWS service account access key
 * @param bucket  the AWS S3 bucket
 * @param fileType  the ContentType for the file we want to upload
 * @param key the "key" for the file that will get uploaded
 * @param pathToFile path to file we want to uplaod
 * @param region the AWS region for the bucket
 * @param secretAccessKey the AWS service account secret key
 */
export const uploadToS3 = async (
  accessKeyId: string,
  bucket: string,
  key: string,
  pathToFile: string,
  region: string,
  secretAccessKey: string,
): Promise<void> => {
  checkArgs({
    accessKeyId,
    bucket,
    region,
    secretAccessKey,
  });
  try {
    const client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    const file = createReadStream(pathToFile);

    const upload = new Upload({
      params: {
        Bucket: bucket,
        Key: key,
        Body: file,
      },
      client,
    });

    await upload.done();
    file.destroy();
    client.destroy();
  } catch (e) {
    throw new InternalServerErrorException(e);
  }
};
