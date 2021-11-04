import { Injectable, Scope } from "@nestjs/common"
import { StatusDto } from "../../shared/dto/status.dto"
import { mapTo } from "../../shared/mapTo"
import { SmsDto } from "../dto/sms.dto"
import { TwilioService } from "./twilio.service"

@Injectable({ scope: Scope.REQUEST })
export class SmsService {
  constructor(private readonly twilio: TwilioService) {}

  async send(dto: SmsDto): Promise<StatusDto> {
    await this.twilio.send(dto.body, dto.phoneNumber)
    return mapTo(StatusDto, { status: "ok" })
  }
}
