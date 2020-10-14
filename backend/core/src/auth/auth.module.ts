import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { UserModule } from "../user/user.module"
import { LocalStrategy } from "./local.strategy"
import { JwtStrategy } from "./jwt.strategy"
import { AuthController } from "./auth.controller"
import { PassportModule } from "@nestjs/passport"
import { AuthService } from "./auth.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { RevokedToken } from "../entity/revokedToken.entity"
import { EmailService } from "../shared/email.service"
import { SharedModule } from "../shared/shared.module"
import { AuthzService } from "./authz.service"
import { ConfigService } from "@nestjs/config"

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("APP_SECRET"),
        signOptions: {
          expiresIn: "10m",
        },
      }),
    }),
    TypeOrmModule.forFeature([RevokedToken]),
    SharedModule,
  ],
  providers: [LocalStrategy, JwtStrategy, AuthService, EmailService, AuthzService],
  exports: [AuthzService],
  controllers: [AuthController],
})
export class AuthModule {}
