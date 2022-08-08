import { forwardRef, Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { LocalMfaStrategy } from "./passport-strategies/local-mfa.strategy"
import { JwtStrategy } from "./passport-strategies/jwt.strategy"
import { PassportModule } from "@nestjs/passport"
import { TypeOrmModule } from "@nestjs/typeorm"
import { RevokedToken } from "./entities/revoked-token.entity"
import { SharedModule } from "../shared/shared.module"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AuthService } from "./services/auth.service"
import { AuthzService } from "./services/authz.service"
import { AuthController } from "./controllers/auth.controller"
import { User } from "./entities/user.entity"
import { UserService } from "./services/user.service"
import { UserController } from "./controllers/user.controller"
import { PasswordService } from "./services/password.service"
import { JurisdictionsModule } from "../jurisdictions/jurisdictions.module"
import { Application } from "../applications/entities/application.entity"
import { UserProfileController } from "./controllers/user-profile.controller"
import { ActivityLogModule } from "../activity-log/activity-log.module"
import { EmailModule } from "../email/email.module"
import { SmsMfaService } from "./services/sms-mfa.service"
import { TwilioModule } from "nestjs-twilio"
import { UserRepository } from "./repositories/user-repository"
import { ListingRepository } from "../listings/db/listing.repository"

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("APP_SECRET"),
        signOptions: {
          expiresIn: "1d",
        },
      }),
    }),
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        accountSid: configService.get("TWILIO_ACCOUNT_SID"),
        authToken: configService.get("TWILIO_AUTH_TOKEN"),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([RevokedToken, User, UserRepository, Application, ListingRepository]),
    SharedModule,
    JurisdictionsModule,
    EmailModule,
    forwardRef(() => ActivityLogModule),
  ],
  providers: [
    LocalMfaStrategy,
    JwtStrategy,
    AuthService,
    AuthzService,
    UserService,
    PasswordService,
    SmsMfaService,
  ],
  exports: [AuthzService, AuthService, UserService],
  controllers: [AuthController, UserController, UserProfileController],
})
export class AuthModule {}
