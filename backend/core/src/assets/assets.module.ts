import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Asset } from "../entity/asset.entity"
import { AssetsService } from "./assets.service"
import { AssetsController } from "./assets.controller"
import { AuthzService } from "../auth/authz.service"
import { AuthModule } from "../auth/auth.module"

@Module({
  imports: [TypeOrmModule.forFeature([Asset]), AuthModule],
  providers: [AssetsService, AuthzService],
  exports: [AssetsService],
  controllers: [AssetsController],
})
export class AssetsModule {}
