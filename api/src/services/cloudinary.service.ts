import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  /*
    creates a signed signature for upload to cloudinary
    Based on https://cloudinary.com/documentation/upload_images#signed_upload_video_tutorial
  */
  async signUploadParameters(
    parametersToSign: Record<string, string>,
  ): Promise<string> {
    if (!parametersToSign) {
      throw new BadRequestException(
        'parametersToSign is required for Cloudinary uploads',
      );
    }

    const parametersToSignWithTimestamp = {
      ...parametersToSign,
      timestamp: parseInt(parametersToSign.timestamp),
    };

    return cloudinary.utils.api_sign_request(
      parametersToSignWithTimestamp,
      process.env.CLOUDINARY_SECRET,
    );
  }
}
