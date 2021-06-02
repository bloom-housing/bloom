import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

export abstract class UploadService {
  abstract getPresignedUploadUrl(key: string): Promise<string>
}

@Injectable()
export class CloudinaryService implements UploadService {
  constructor(private readonly configService: ConfigService) {}

  async getPresignedUploadUrl(key: string): Promise<string> {
    return Promise.resolve("fake_upload_url")
  }
}
