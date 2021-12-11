import { Injectable } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { UserListQueryParams } from "src/auth/dto/user-list-query-params"
import { UserService } from "src/auth/services/user.service"
import { AuthContext } from "src/auth/types/auth-context"
import { Compare } from "src/shared/dto/filter.dto"
import { EmailService } from "src/shared/email/email.service"
import { ListingsService } from "../listings/listings.service"

@Injectable()
export class CronService {
  constructor(
    private readonly emailService: EmailService,
    private readonly listingsService: ListingsService,
    private readonly userService: UserService
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
  async handleCron() {
    if (!process.env.SEND_NOTIFICATIONS_FOR_UPDATE_LISTINGS_REMINDER) {
      return
    }

    const userQueryParams: UserListQueryParams = {
      filter: [
        {
          $comparison: Compare["EQUALS"],
          isPartner: true,
        },
      ],
    }
    const users = this.userService.list(userQueryParams, new AuthContext())
    const allListings = await this.listingsService.list({})

    // For each listing, check whether the listed leasing agents are in the list of partner users.
    // If the leasing agent is a partner and has their email notifications turned on, send the reminder email.
    for (var listing of allListings.items) {
      for (var leasingAgent of listing.leasingAgents) {
        if ((await users).items.includes(leasingAgent)) {
          if (leasingAgent.preferences.sendEmailNotifications == true) {
            this.emailService.updateListingReminder(listing, leasingAgent)
          }
        }
      }
    }
  }
}
