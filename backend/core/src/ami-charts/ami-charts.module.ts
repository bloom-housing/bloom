import { Module } from "@nestjs/common"
import { AmiChartsController } from "./ami-charts.controller"
import { AmiChartsService } from "./ami-charts.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AmiChart } from "./entities/ami-chart.entity"
import { AuthModule } from "../auth/auth.module"

@Module({
  imports: [TypeOrmModule.forFeature([AmiChart]), AuthModule],
  controllers: [AmiChartsController],
  providers: [AmiChartsService],
})
export class AmiChartsModule {}
