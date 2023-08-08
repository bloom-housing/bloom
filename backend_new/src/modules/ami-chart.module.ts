import { Module } from '@nestjs/common';
import { AmiChartController } from '../controllers/ami-chart.controller';
import { AmiChartService } from '../services/ami-chart.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AmiChartController],
  providers: [AmiChartService],
  exports: [AmiChartService],
})
export class AmiChartModule {}
