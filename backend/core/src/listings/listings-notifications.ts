import { Process, Processor } from "@nestjs/bull"
import { Job } from "bull"
import { Listing } from "./entities/listing.entity"
import { SmsService } from "../sms/services/sms.service"
import { StatusDto } from "../shared/dto/status.dto"

export enum ListingUpdateType {
  CREATE,
  MODIFY,
}

export class ListingNotificationInfo {
  listing: Listing
  updateType: ListingUpdateType
}

// This class defines the processor for the "listings-notifications" queue. It is responsible
// for sending email and SMS notifications when listings are created or updated.
@Processor("listings-notifications")
export class ListingsNotificationsConsumer {
  constructor(private readonly smsService: SmsService) {}
  @Process()
  async sendListingNotifications(job: Job<ListingNotificationInfo>): Promise<StatusDto> {
    const listing: Listing = job.data.listing
    const status: StatusDto = await this.smsService.sendNewListingNotification(listing)

    // TODO(https://github.com/CityOfDetroit/bloom/issues/698): call out to the
    // emailService to send email notifications.

    return status
  }
}
