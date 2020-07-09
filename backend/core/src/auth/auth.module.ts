import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { UserModule } from "../user/user.module"
import { LocalStrategy } from "./local.strategy"
import { JwtStrategy } from "./jwt.strategy"
import { AuthController } from "./auth.controller"
import { PassportModule } from "@nestjs/passport"
import { secretKey } from "./constants"
import { AuthService } from "./auth.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { RevokedToken } from "../entity/revokedToken.entity"

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: secretKey,
      signOptions: {
        expiresIn: "10m",
      },
    }),
    TypeOrmModule.forFeature([RevokedToken]),
  ],
  providers: [LocalStrategy, JwtStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
