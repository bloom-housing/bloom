import { forwardRef, Module } from "@nestjs/common"
import { UserService } from "./user.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./entities/user.entity"
import { UserController } from "./user.controller"
import { PassportModule } from "@nestjs/passport"
import { AuthModule } from "../auth/auth.module"
import { SharedModule } from "../shared/shared.module"
import { EmailModule } from "../shared/email/email.module"

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    SharedModule,
    forwardRef(() => EmailModule),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
