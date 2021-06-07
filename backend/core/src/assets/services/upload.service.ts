import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { v2 as cloudinary } from "cloudinary"

export abstract class UploadService {
  abstract createPresignedUploadMetadata(
    parametersToSign: Record<string, string>
  ): { signature: string }
}

@Injectable()
export class CloudinaryService implements UploadService {
  constructor(private readonly configService: ConfigService) {}

  createPresignedUploadMetadata(parametersToSign: Record<string, string>): { signature: string } {
    // Based on https://cloudinary.com/documentation/upload_images#signed_upload_video_tutorial
    const signature = cloudinary.utils.api_sign_request(
      parametersToSign,
      this.configService.get<string>("CLOUDINARY_SECRET")
    )
    return {
      signature,
    }
  }
}
