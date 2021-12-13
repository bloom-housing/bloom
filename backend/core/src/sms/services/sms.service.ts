import { HttpException, HttpStatus, Injectable, Scope } from "@nestjs/common"
import { Listing } from "../../listings/entities/listing.entity"
import { StatusDto } from "../../shared/dto/status.dto"
import { mapTo } from "../../shared/mapTo"
import { SmsDto } from "../dto/sms.dto"
import { TwilioService } from "./twilio.service"

@Injectable({ scope: Scope.REQUEST })
export class SmsService {
  constructor(private readonly twilio: TwilioService) {}

  sendNewListingNotification(listing: Listing): StatusDto {
    // TODO(https://github.com/CityOfDetroit/bloom/issues/705): implement this. It'll probably be:
    //   - Construct the body of the sms (using fields from the listing)
    //   - Retrieve a list of all users opted-in to sms updates
    //   - Construct an SmsDto for each user
    //   - (in parallel?) send all the SmsDto's using the send method below
    console.log(
      `This is where we would send SMS updates notifying users that ${listing.name} ` +
        `was just created (this is yet to be implemented).`
    )
    return { status: "ok" }
  }

  async send(dto: SmsDto): Promise<StatusDto> {
    const messageInstance = await this.twilio.send(dto.body, dto.phoneNumber)
    if (messageInstance.errorCode) {
      console.error("Error sending SMS: " + messageInstance.errorMessage)
      throw new HttpException(messageInstance.errorMessage, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return mapTo(StatusDto, { status: "ok" })
  }
}
