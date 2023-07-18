import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CreatePresignedUploadMetadata } from '../dtos/assets/create-presigned-upload-meta.dto';
import { CreatePresignedUploadMetadataResponse } from '../dtos/assets/create-presign-upload-meta-response.dto';

/*
  this is the service for unit types
  it handles all the backend's business logic for reading/writing/deleting unit type data
*/

@Injectable()
export class AssetService {
  /*
    this will get a set of unit types given the params passed in
  */
  async createPresignedUploadMetadata(
    createPresignedUploadMetadata: CreatePresignedUploadMetadata,
  ): Promise<CreatePresignedUploadMetadataResponse> {
    // Based on https://cloudinary.com/documentation/upload_images#signed_upload_video_tutorial

    const parametersToSignWithTimestamp = {
      timestamp: parseInt(
        createPresignedUploadMetadata.parametersToSign.timestamp,
      ),
      ...createPresignedUploadMetadata.parametersToSign,
    };

    const signature = await cloudinary.utils.api_sign_request(
      parametersToSignWithTimestamp,
      process.env.CLOUDINARY_SECRET,
    );

    return {
      signature,
    };
  }
}
