import { Module } from "@nestjs/common"
import { CronService } from "./cron.service"
import { EmailService } from "../shared/email/email.service"
import { ListingsService } from "../listings/listings.service"

@Module({
  imports: [EmailService, ListingsService],
  providers: [CronService],
})
export class CronModule {}
