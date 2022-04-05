import { forwardRef, Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { LocalStrategy } from "./passport-strategies/local.strategy"
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
import { UserPreferencesController } from "./controllers/user-preferences.controller"
import { UserPreferencesService } from "./services/user-preferences.services"
import { UserPreferences } from "./entities/user-preferences.entity"

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("APP_SECRET"),
        signOptions: {
          expiresIn: "10m",
        },
      }),
    }),
    TypeOrmModule.forFeature([RevokedToken, User, Application, UserPreferences]),
    SharedModule,
    JurisdictionsModule,
    EmailModule,
    forwardRef(() => ActivityLogModule),
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    AuthService,
    AuthzService,
    UserService,
    PasswordService,
    UserPreferencesService,
  ],
  exports: [AuthzService, AuthService, UserService, UserPreferencesService],
  controllers: [AuthController, UserController, UserProfileController, UserPreferencesController],
})
export class AuthModule {}
