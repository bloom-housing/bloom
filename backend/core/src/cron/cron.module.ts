import { Module } from "@nestjs/common"
import { CronService } from "./cron.service"
import { UserService } from "../auth/services/user.service"
import { EmailService } from "../shared/email/email.service"
import { ListingsService } from "../listings/listings.service"

@Module({
  imports: [UserService, EmailService, ListingsService],
  providers: [CronService],
})
export class CronModule {}
