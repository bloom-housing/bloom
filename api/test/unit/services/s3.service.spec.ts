import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { Upload } from '@aws-sdk/lib-storage';
import { S3Service } from '../../../src/services/s3.service';

jest.mock('@aws-sdk/lib-storage');

describe('S3Service', () => {
  let service: S3Service;
  const done = jest.fn();

  beforeAll(async () => {
    process.env.S3_REGION = 'moon-2';
    process.env.S3_PUBLIC_BUCKET = 'fake-public';
    process.env.S3_PRIVATE_BUCKET = 'fake-private';

    const module: TestingModule = await Test.createTestingModule({
      providers: [S3Service],
    }).compile();

    service = module.get<S3Service>(S3Service);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (Upload as unknown as jest.Mock).mockImplementation(() => ({ done }));
    done.mockResolvedValue(undefined);
  });

  describe('uploadToPublic', () => {
    const paramsOf = () =>
      (Upload as unknown as jest.Mock).mock.calls[0][0].params;

    it('writes the key it was given, without rewriting it', async () => {
      await service.uploadToPublic(
        'brand/bloomington/logo.png',
        Buffer.from('bytes'),
        'image/png',
      );

      expect(paramsOf().Key).toEqual('brand/bloomington/logo.png');
    });

    // The private bucket is not web readable, so a brand asset written there would render nothing.
    it('writes to the public bucket, not the private one', async () => {
      await service.uploadToPublic('key', Buffer.from('bytes'), 'image/png');

      expect(paramsOf().Bucket).toEqual('fake-public');
    });

    // Without it S3 serves application/octet-stream and a browser downloads the logo rather than
    // rendering it.
    it('sets the content type', async () => {
      await service.uploadToPublic(
        'key',
        Buffer.from('bytes'),
        'image/svg+xml',
      );

      expect(paramsOf().ContentType).toEqual('image/svg+xml');
    });

    it('sends the bytes it was given', async () => {
      const body = Buffer.from('bytes');
      await service.uploadToPublic('key', body, 'image/png');

      expect(paramsOf().Body).toBe(body);
    });

    it('raises rather than reporting a failed upload as success', async () => {
      done.mockRejectedValue(new Error('no such bucket'));

      await expect(
        service.uploadToPublic('key', Buffer.from('bytes'), 'image/png'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
