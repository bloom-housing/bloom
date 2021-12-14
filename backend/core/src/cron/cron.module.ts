import { Module } from "@nestjs/common"
import { EmailService } from "src/shared/email/email.service"
import { CronService } from "./cron.service"

@Module({
  imports: [EmailService],
  providers: [CronService],
})
export class CronModule {}
