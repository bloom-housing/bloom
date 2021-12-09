import { Injectable } from "@nestjs/common"
import { User } from "../entities/user.entity"
import { InjectTwilio, TwilioClient } from "nestjs-twilio"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class SmsMfaService {
  public constructor(
    @InjectTwilio() private readonly client: TwilioClient,
    private readonly configService: ConfigService
  ) {}
  public async sendMfaCode(user: User, phoneNumber: string, mfaCode: string) {
    return await this.client.messages.create({
      body: `Your bloom account access token: ${mfaCode}`,
      from: this.configService.get("TWILIO_PHONE_NUMBER"),
      to: phoneNumber,
    })
  }
}
