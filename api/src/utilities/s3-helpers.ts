import { InternalServerErrorException } from '@nestjs/common';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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
 * @param bucket the s3 bucket the object lives inside of
 * @param key the key for the object we want a presigned url for
 * @param region the region the s3 bucket exists in. Specified in AWS
 * @returns the presigned url for downloading a file
 */
export const generatePresignedGetURL = async (
  bucket: string,
  key: string,
  region: string,
  expiresIn?: number,
): Promise<string> => {
  checkArgs({
    bucket,
    region,
  });

  const client = new S3Client({
    region,
  });

  const url = await getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
    {
      expiresIn: expiresIn || 1000 * 60 * 5, // expires 5 minutes after generation
    },
  );

  client.destroy();

  return url;
};

/**
 *
 * @param bucket  the AWS S3 bucket
 * @param fileType  the ContentType for the file we want to upload
 * @param key the "key" for the file that will get uploaded
 * @param pathToFile path to file we want to uplaod
 * @param region the AWS region for the bucket
 */
export const uploadToS3 = async (
  bucket: string,
  key: string,
  pathToFile: string,
  region: string,
): Promise<void> => {
  checkArgs({
    bucket,
    region,
  });
  try {
    const client = new S3Client({
      region,
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
