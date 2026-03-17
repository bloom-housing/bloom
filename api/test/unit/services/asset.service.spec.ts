import { Test, TestingModule } from '@nestjs/testing';
import { v2 as cloudinary } from 'cloudinary';
import { AssetService } from '../../../src/services/asset.service';
import { CloudinaryService } from '../../../src/services/cloudinary.service';
import { S3Service } from '../../../src/services/s3.service';
import { randomUUID } from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

describe('Testing asset service', () => {
  let service: AssetService;

  beforeAll(async () => {
    process.env.S3_REGION = 'moon-2';
    process.env.S3_PUBLIC_BUCKET = 'fake-public';

    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetService, CloudinaryService, S3Service],
    }).compile();

    service = module.get<AssetService>(AssetService);
  });

  it('should call the createPresignedUploadMetadata() properly', async () => {
    const mockedValue = 'fake';
    cloudinary.utils.api_sign_request = jest
      .fn()
      .mockResolvedValue(mockedValue);

    const publicId = randomUUID();
    const eager = 'eager';
    const timestamp = '15';
    const params = {
      parametersToSign: {
        publicId,
        eager,
        timestamp,
      },
    };

    expect(await service.createPresignedUploadMetadata(params)).toEqual({
      signature: 'fake',
    });

    expect(cloudinary.utils.api_sign_request).toHaveBeenCalledWith(
      {
        eager: 'eager',
        publicId: publicId,
        timestamp: 15,
      },
      process.env.CLOUDINARY_SECRET,
    );
  });

  it('should call the createS3UploadUrl() properly', async () => {
    randomUUID = jest.fn().mockReturnValue('fake-uuid');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getSignedUrl = jest.fn().mockResolvedValue('fake-upload-url');

    expect(await service.createS3UploadUrl()).toEqual({
      fileId: 'fake-uuid',
      uploadUrl: 'fake-upload-url',
      publicUrl: 'https://fake-public.s3.moon-2.amazonaws.com/fake-uuid',
    });
  });
});
