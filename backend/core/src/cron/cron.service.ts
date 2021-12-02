import { Injectable } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { ListingsQueryParams } from "src/listings/dto/listings-query-params";
import { Listing } from "src/listings/entities/listing.entity";
import { EmailService } from "src/shared/email/email.service";

@Injectable()
export class CronService {

  constructor(
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
  handleCron() {
    // TODO: add a cron task here.
     // Check if the flag to send alerts is enabled.
     if (!process.env.SEND_NOTIFICATIONS_FOR_UPDATE_LISTINGS_REMINDER) {
      return;
    }

    // Retrieve all listings and respective users
    // Select listing, user where emailNotifications=true
    ListingsQueryParams params;
    allListingsAndUsers = this.listingsService.list(params);

    // Filter to only listings that are newly added/modified
    listingsToUpdate = allListings.filter(shouldSendNotificationForListing);
    
    // Send notifications
    this.emailService.sendUpdateNotifications(listingsToUpdate.Listing, listingsToUpdate.user);
  }

  shouldSendNotificationForListing(listing: Listing) {
    return true

  }
}
