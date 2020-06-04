import { Module } from "@nestjs/common"
import { UserModule } from "../user/user.module"
import { LocalStrategy } from "./local.strategy"
import { AuthController } from "./auth.controller"
import { PassportModule } from "@nestjs/passport"

@Module({
  imports: [UserModule, PassportModule],
  providers: [LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
