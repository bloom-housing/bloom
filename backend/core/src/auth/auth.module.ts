import { forwardRef, Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { LocalStrategy } from "./local.strategy"
import { JwtStrategy } from "./jwt.strategy"
import { AuthController } from "./auth.controller"
import { PassportModule } from "@nestjs/passport"
import { AuthService } from "./auth.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { RevokedToken } from "../entity/revokedToken.entity"
import { SharedModule } from "../shared/shared.module"
import { AuthzService } from "./authz.service"
import { ConfigService } from "@nestjs/config"
import { UserModule } from "../user/user.module"

@Module({
  imports: [
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
    forwardRef(() => UserModule),
  ],
  providers: [LocalStrategy, JwtStrategy, AuthService, AuthzService],
  exports: [AuthzService, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
