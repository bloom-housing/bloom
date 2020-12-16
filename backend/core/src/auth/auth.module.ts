import { forwardRef, Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { LocalStrategy } from "./local.strategy"
import { JwtStrategy } from "./jwt.strategy"
import { AuthController } from "./auth.controller"
import { PassportModule } from "@nestjs/passport"
import { AuthService } from "./auth.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { RevokedToken } from "./entities/revokedToken.entity"
import { SharedModule } from "../shared/shared.module"
import { AuthzService } from "./authz.service"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { UserModule } from "../user/user.module"
import Joi from "joi"

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
    TypeOrmModule.forFeature([RevokedToken]),
    SharedModule,
    forwardRef(() => UserModule),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        APP_SECRET: Joi.string().required().min(16),
      }),
    }),
  ],
  providers: [LocalStrategy, JwtStrategy, AuthService, AuthzService],
  exports: [AuthzService, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
