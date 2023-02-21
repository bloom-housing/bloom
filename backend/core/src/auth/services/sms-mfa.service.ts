import { Injectable } from "@nestjs/common"
import { User } from "../entities/user.entity"
import { TwilioService } from "nestjs-twilio"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class SmsMfaService {
  public constructor(
    private readonly client: TwilioService,
    private readonly configService: ConfigService
  ) {}
  public async sendMfaCode(user: User, phoneNumber: string, mfaCode: string): Promise<unknown> {
    return await this.client.client.messages.create({
      body: `Your Partners Portal account access token: ${mfaCode}`,
      from: this.configService.get("TWILIO_PHONE_NUMBER"),
      to: phoneNumber,
    })
  }
}
