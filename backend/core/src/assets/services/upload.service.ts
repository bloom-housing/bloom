import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { v2 as cloudinary } from "cloudinary"

export abstract class UploadService {
  abstract getPresignedUploadUrl(publicId: string, eager?: string): string
}

@Injectable()
export class CloudinaryService implements UploadService {
  constructor(private readonly configService: ConfigService) {}

  getPresignedUploadUrl(publicId: string, eager?: string): string {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        ...(eager && { eager }),
        public_id: publicId,
      },
      this.configService.get<string>("CLOUDINARY_SECRET")
    )
    const url = new URL("https://api.cloudinary.com/v1_1/carl/image/upload")
    url.searchParams.append("api_key", this.configService.get<string>("CLOUDINARY_KEY"))
    if (eager) {
      url.searchParams.append("eager", eager)
    }
    url.searchParams.append("public_id", publicId)
    url.searchParams.append("timestamp", timestamp.toString())
    url.searchParams.append("signature", signature)
    return url.toString()
  }
}
