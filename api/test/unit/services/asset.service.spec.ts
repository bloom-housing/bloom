import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { AssetService } from '../../../src/services/asset.service';
import { randomUUID } from 'crypto';
import {
  CloudinaryService,
  UploadService,
} from '../../../src/services/upload.service';
import { FileServiceProvider } from '../../../src/services/uploads';
import { PrismaService } from '../../../src/services/prisma.service';

describe('Testing asset service', () => {
  let service: AssetService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetService,
        PrismaService,
        ConfigService,
        { provide: FileServiceProvider, useValue: {} },
        { provide: UploadService, useClass: CloudinaryService },
      ],
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
        timestamp: '15',
      },
      process.env.CLOUDINARY_SECRET,
    );
  });
});
