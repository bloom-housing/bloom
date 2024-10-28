import { Module } from '@nestjs/common';
import { ScirptRunnerController } from '../controllers/script-runner.controller';
import { ScriptRunnerService } from '../services/script-runner.service';
import { PrismaModule } from './prisma.module';
import { PermissionModule } from './permission.module';
import { EmailModule } from './email.module';
import { AmiChartModule } from './ami-chart.module';
import { ApplicationModule } from './application.module';

@Module({
  imports: [
    PrismaModule,
    PermissionModule,
    EmailModule,
    AmiChartModule,
    ApplicationModule,
  ],
  controllers: [ScirptRunnerController],
  providers: [ScriptRunnerService],
  exports: [ScriptRunnerService],
})
export class ScirptRunnerModule {}
