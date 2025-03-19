import { formatUrl } from '@aws-sdk/util-format-url';
import { Hash } from '@smithy/hash-node';
import { HttpRequest } from '@smithy/protocol-http';
import { InternalServerErrorException } from '@nestjs/common';
import { parseUrl } from '@smithy/url-parser';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';

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
  console.log('37:', formatUrl(signedUrlObject));
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
  fileType: string,
  key: string,
  pathToFile: string,
  region: string,
  secretAccessKey: string,
): Promise<void> => {
  try {
    const client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    const file = readFileSync(pathToFile);
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentLength: file.length,
      ContentType: fileType,
    });
    await client.send(command);
  } catch (e) {
    throw new InternalServerErrorException(e);
  }
};
