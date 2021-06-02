import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { v2 as cloudinary } from "cloudinary"
import { CreatePresignedUploadMetadataResponseDto } from "../dto/asset.dto"
import { mapTo } from "../../shared/mapTo"

export abstract class UploadService {
  abstract createPresignedUploadMetadata(
    publicId: string,
    eager?: string
  ): { timestamp: string; signature: string }
}

@Injectable()
export class CloudinaryService implements UploadService {
  constructor(private readonly configService: ConfigService) {}

  createPresignedUploadMetadata(
    publicId: string,
    eager?: string
  ): CreatePresignedUploadMetadataResponseDto {
    // Based on https://cloudinary.com/documentation/upload_images#signed_upload_video_tutorial
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        ...(eager && { eager }),
        public_id: publicId,
      },
      this.configService.get<string>("CLOUDINARY_SECRET")
    )
    return mapTo(CreatePresignedUploadMetadataResponseDto, {
      timestamp: timestamp.toString(),
      signature,
    })
  }
}
