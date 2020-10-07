import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Asset } from "../entity/asset.entity"
import { AssetsService } from "./assets.service"
import { AssetsController } from "./assets.controller"
import { AuthzService } from "../auth/authz.service"

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  providers: [AssetsService, AuthzService],
  exports: [AssetsService],
  controllers: [AssetsController],
})
export class AssetsModule {}
