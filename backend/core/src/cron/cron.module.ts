import { Module } from "@nestjs/common"
import { EmailService } from "../shared/email/email.service"
import { CronService } from "./cron.service"

@Module({
  providers: [CronService, EmailService],
})
export class CronModule {}
