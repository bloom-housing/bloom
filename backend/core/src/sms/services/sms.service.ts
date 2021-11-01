import { HttpException, HttpStatus, Injectable, Scope } from "@nestjs/common"
import { UserService } from "../../auth/services/user.service"
import { StatusDto } from "../../shared/dto/status.dto"
import { mapTo } from "../../shared/mapTo"
import { SmsDto } from "../dto/sms.dto"
import { TwilioService } from "./twilio.service"

@Injectable({ scope: Scope.REQUEST })
export class SmsService {
  constructor(private readonly userService: UserService, private readonly twilio: TwilioService) {}

  async send(dto: SmsDto): Promise<StatusDto> {
    const user = await this.userService.findByEmail(dto.userEmail)
    if (!user.phoneNumber) {
      throw new HttpException("User does not have a phone number set.", HttpStatus.BAD_REQUEST)
    }
    await this.twilio.send(dto.body, user.phoneNumber)
    return mapTo(StatusDto, { status: "ok" })
  }
}
