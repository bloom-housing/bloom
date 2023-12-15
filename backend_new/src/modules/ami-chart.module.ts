import { Module } from '@nestjs/common';
import { AmiChartController } from '../controllers/ami-chart.controller';
import { AmiChartService } from '../services/ami-chart.service';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, PermissionModule],
  controllers: [AmiChartController],
  providers: [AmiChartService],
  exports: [AmiChartService],
})
export class AmiChartModule {}
