import { Injectable } from '@nestjs/common';
import { CreatePresignedUploadMetadata } from '../dtos/assets/create-presigned-upload-meta.dto';
import { CreatePresignedUploadMetadataResponse } from '../dtos/assets/create-presign-upload-meta-response.dto';
import { CreateS3UploadUrl } from '../dtos/assets/create-s3-upload-url.dto';
import { CloudinaryService } from './cloudinary.service';
import { S3Service } from './s3.service';
import { randomUUID } from 'crypto';

/*
  this is the service for assets
  it handles all the backend's business logic for signing meta data for asset upload
*/

@Injectable()
export class AssetService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly s3Service: S3Service,
  ) {}

  /*
    this will create a signed signature for upload to cloudinary
  */
  async createPresignedUploadMetadata(
    createPresignedUploadMetadata: CreatePresignedUploadMetadata,
  ): Promise<CreatePresignedUploadMetadataResponse> {
    const signature = await this.cloudinaryService.signUploadParameters(
      createPresignedUploadMetadata.parametersToSign,
    );
    return {
      signature,
    };
  }

  async createS3UploadUrl(): Promise<CreateS3UploadUrl> {
    const fileId = randomUUID();
    const uploadUrl = await this.s3Service.uploadURLForPublic(fileId);
    const publicUrl = this.s3Service.urlForPublic(fileId);
    return {
      fileId,
      uploadUrl,
      publicUrl,
    };
  }
}
