import { Module } from "@nestjs/common"
import { AmiChartsController } from "./ami-charts.controller"
import { AmiChartsService } from "./ami-charts.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AmiChart } from "./entities/ami-chart.entity"
import { AmiChartItem } from "./entities/ami-chart-item.entity"
import { AuthModule } from "../auth/auth.module"

@Module({
  imports: [TypeOrmModule.forFeature([AmiChart, AmiChartItem]), AuthModule],
  controllers: [AmiChartsController],
  providers: [AmiChartsService],
})
export class AmiChartsModule {}
