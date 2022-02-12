import { Module } from "@nestjs/common"
import { AuthModule } from "../auth/auth.module"
import { ListingsModule } from "../listings/listings.module"
import { EmailModule } from "../email/email.module"
import { CronService } from "./cron.service"

@Module({
  imports: [ListingsModule, EmailModule, AuthModule],
  providers: [CronService],
})
export class CronModule {}
