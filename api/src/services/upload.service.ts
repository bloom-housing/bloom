import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export abstract class UploadService {
  abstract createPresignedUploadMetadata(
    parametersToSign: Record<string, string>,
  ): Promise<{
    signature: string;
  }>;
}

@Injectable()
export class CloudinaryService implements UploadService {
  constructor(private readonly configService: ConfigService) {}

  async createPresignedUploadMetadata(
    parametersToSign: Record<string, string>,
  ): Promise<{
    signature: string;
  }> {
    // Based on https://cloudinary.com/documentation/upload_images#signed_upload_video_tutorial

    const parametersToSignWithTimestamp = {
      timestamp: parseInt(parametersToSign.timestamp),
      ...parametersToSign,
    };

    const signature = await cloudinary.utils.api_sign_request(
      parametersToSignWithTimestamp,
      this.configService.get<string>('CLOUDINARY_SECRET'),
    );

    return {
      signature,
    };
  }
}
