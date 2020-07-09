import { Module } from "@nestjs/common"
import { UserService } from "./user.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "../entity/user.entity"
import { UserController } from "./user.controller"
import { PassportModule } from "@nestjs/passport"

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
