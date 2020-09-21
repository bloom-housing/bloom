import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Asset } from "../entity/asset.entity"
import { AssetsService } from "./assets.service"
import { AssetsController } from "./assets.controller"

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  providers: [AssetsService],
  exports: [AssetsService],
  controllers: [AssetsController],
})
export class AssetsModule {}
