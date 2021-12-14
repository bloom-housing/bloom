import { Module } from "@nestjs/common"
import { UserService } from "../auth/services/user.service"
import { ListingsService } from "../listings/listings.service"
import { EmailService } from "../shared/email/email.service"
import { CronService } from "./cron.service"

@Module({
  providers: [CronService, EmailService, ListingsService, UserService],
})
export class CronModule {}
