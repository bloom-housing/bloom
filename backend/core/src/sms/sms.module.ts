import { Module } from "@nestjs/common"
import { AuthModule } from "../auth/auth.module"
import { AuthzService } from "../auth/services/authz.service"
import { SmsService } from "./services/sms.service"
import { SmsController } from "./controllers/sms.controller"
import { TwilioService } from "./services/twilio.service"

@Module({
  imports: [AuthModule],
  providers: [AuthzService, SmsService, TwilioService],
  exports: [SmsService],
  controllers: [SmsController],
})
export class SmsModule {}
