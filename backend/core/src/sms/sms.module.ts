import { TypeOrmModule } from "@nestjs/typeorm"
import { Module } from "@nestjs/common"
import { User } from "../auth/entities/user.entity"
import { AuthModule } from "../auth/auth.module"
import { AuthzService } from "../auth/services/authz.service"
import { SmsService } from "./services/sms.service"
import { SmsController } from "./controllers/sms.controller"
import { TwilioService } from "./services/twilio.service"
import { UserService } from "../auth/services/user.service"
import { Application } from "../applications/entities/application.entity"
import { SharedModule } from "../shared/shared.module"
import { EmailModule } from "../shared/email/email.module"
import { JurisdictionsModule } from "../jurisdictions/jurisdictions.module"

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Application]),
    AuthModule,
    SharedModule,
    EmailModule,
    JurisdictionsModule,
  ],
  providers: [UserService, AuthzService, SmsService, TwilioService],
  exports: [SmsService],
  controllers: [SmsController],
})
export class SmsModule {}
