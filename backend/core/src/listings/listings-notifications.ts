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
  sendListingNotifications(job: Job<ListingNotificationInfo>): StatusDto {
    const listing: Listing = job.data.listing
    let status: StatusDto
    if (job.data.updateType === ListingUpdateType.CREATE) {
      status = this.smsService.sendNewListingNotification(listing)

      // TODO(https://github.com/CityOfDetroit/bloom/issues/698): call out to the
      // emailService to send email notifications.
    } else if (job.data.updateType === ListingUpdateType.MODIFY) {
      // TODO(#698 and #705): send sms and email notifications for modified listings
    }
    return status
  }
}
