import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ApplicationFlaggedSetService } from "./application-flagged-set.service"
import { ApplicationFlaggedSet } from "./entities/application-flagged-set.entity"
import { ApplicationFlaggedSetController } from "./application-flagged-set.controller"
import { Application } from "../applications/entities/application.entity"
import { AuthModule } from "../auth/auth.module"
import { CsvEncoder } from "../csv/csv-encoder.service"
import { CsvBuilder } from "../csv/csv-builder.service"

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationFlaggedSet, Application]), AuthModule],
  providers: [ApplicationFlaggedSetService, CsvEncoder, CsvBuilder],
  exports: [ApplicationFlaggedSetService],
  controllers: [ApplicationFlaggedSetController],
})
export class ApplicationFlaggedSetModule {}
