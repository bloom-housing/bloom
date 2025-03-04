import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { parseUrl } from '@smithy/url-parser';
import { formatUrl } from '@aws-sdk/util-format-url';
import { Hash } from '@smithy/hash-node';
import { HttpRequest } from '@smithy/protocol-http';
import { readFileSync } from 'fs';
import { InternalServerErrorException } from '@nestjs/common';

/**
 *
 * @param bucket the s3 bucket the object lives inside of
 * @param region the region the s3 bucket exists in. Specified in AWS
 * @param key the key for the object we want a presigned url for
 * @returns the presigned url for downloading a file
 */
export const generatePresignedGetURL = async (
  bucket: string,
  region: string,
  key: string,
  accessKeyId: string,
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
 * @param pathToFile path to file we want to uplaod
 * @param fileType  the ContentType for the file we want to upload
 * @param region the AWS region for the bucket
 * @param bucket  the AWS S3 bucket
 * @param key the "key" for the file that will get uploaded
 * @param accessKeyId the AWS service account access key
 * @param secretAccessKey the AWS service account secret key
 */
export const uploadToS3Again = async (
  pathToFile: string,
  fileType: string,
  region: string,
  bucket: string,
  key: string,
  accessKeyId: string,
  secretAccessKey: string,
) => {
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

  await generatePresignedGetURL(
    bucket,
    region,
    key,
    accessKeyId,
    secretAccessKey,
  );
};
