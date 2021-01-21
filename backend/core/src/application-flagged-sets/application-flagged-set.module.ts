import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ApplicationFlaggedSetService } from "./application-flagged-set.service"
import { ApplicationFlaggedSet } from "./entities/application-flagged-set.entity"

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationFlaggedSet])],
  providers: [ApplicationFlaggedSetService],
  exports: [ApplicationFlaggedSetService],
})
export class ApplicationFlaggedSetModule {}
