import { HttpException, HttpStatus, Injectable, Scope } from "@nestjs/common"
import { StatusDto } from "../../shared/dto/status.dto"
import { mapTo } from "../../shared/mapTo"
import { SmsDto } from "../dto/sms.dto"
import { TwilioService } from "./twilio.service"

@Injectable({ scope: Scope.REQUEST })
export class SmsService {
  constructor(private readonly twilio: TwilioService) {}

  async send(dto: SmsDto): Promise<StatusDto> {
    const messageInstance = await this.twilio.send(dto.body, dto.phoneNumber)
    if (messageInstance.errorCode) {
      console.error("Error sending SMS: " + messageInstance.errorMessage)
      throw new HttpException(messageInstance.errorMessage, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return mapTo(StatusDto, { status: "ok" })
  }
}
