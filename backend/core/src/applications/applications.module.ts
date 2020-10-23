import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Application } from "../entity/application.entity"
import { ApplicationsService } from "./applications.service"
import { ApplicationsController } from "./applications.controller"
import { AuthModule } from "../auth/auth.module"
import { CsvEncoder } from "../services/csv-encoder.service"
import { CsvBuilder } from "../services/csv-builder.service"
import { SharedModule } from "../shared/shared.module"
import { ListingsModule } from "../listings/listings.module"

@Module({
  imports: [TypeOrmModule.forFeature([Application]), AuthModule, SharedModule, ListingsModule],
  providers: [ApplicationsService, CsvEncoder, CsvBuilder],
  exports: [ApplicationsService],
  controllers: [ApplicationsController],
})
export class ApplicationsModule {}
