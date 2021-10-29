import { TypeOrmModule } from "@nestjs/typeorm"
import { Module } from "@nestjs/common"
import { User } from "src/auth/entities/user.entity"
import { AuthModule } from "src/auth/auth.module"
import { AuthzService } from "src/auth/services/authz.service"
import { SmsService } from "./services/sms.service"
import { SmsController } from "./controllers/sms.controller"
import { TwilioService } from "./services/twilio.service"
import { UserService } from "src/auth/services/user.service"
import { Application } from "src/applications/entities/application.entity"
import { SharedModule } from "src/shared/shared.module"
import { EmailModule } from "src/shared/email/email.module"
import { JurisdictionsModule } from "src/jurisdictions/jurisdictions.module"

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
