import { Logger, Module } from '@nestjs/common';
import { ScriptRunnerController } from '../controllers/script-runner.controller';
import { ScriptRunnerService } from '../services/script-runner.service';
import { AmiChartModule } from './ami-chart.module';
import { FeatureFlagModule } from './feature-flag.module';
import { EmailModule } from './email.module';
import { MultiselectQuestionModule } from './multiselect-question.module';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    AmiChartModule,
    EmailModule,
    FeatureFlagModule,
    MultiselectQuestionModule,
    PermissionModule,
    PrismaModule,
  ],
  controllers: [ScriptRunnerController],
  providers: [ScriptRunnerService, Logger],
  exports: [ScriptRunnerService],
})
export class ScriptRunnerModule {}
