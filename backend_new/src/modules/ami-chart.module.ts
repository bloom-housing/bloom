import { Module } from '@nestjs/common';
import { AmiChartController } from '../controllers/ami-chart.controller';
import { AmiChartService } from '../services/ami-chart.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  imports: [],
  controllers: [AmiChartController],
  providers: [AmiChartService, PrismaService],
  exports: [AmiChartService, PrismaService],
})
export class AmiChartModule {}
