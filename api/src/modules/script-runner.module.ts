import { Module } from '@nestjs/common';
import { ScriptRunnerController } from '../controllers/script-runner.controller';
import { ScriptRunnerService } from '../services/script-runner.service';
import { AmiChartModule } from './ami-chart.module';
import { FeatureFlagModule } from './feature-flag.module';
import { EmailModule } from './email.module';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    AmiChartModule,
    EmailModule,
    FeatureFlagModule,
    PermissionModule,
    PrismaModule,
  ],
  controllers: [ScriptRunnerController],
  providers: [ScriptRunnerService],
  exports: [ScriptRunnerService],
})
export class ScriptRunnerModule {}
