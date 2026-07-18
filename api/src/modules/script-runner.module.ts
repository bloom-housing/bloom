import { Logger, Module } from '@nestjs/common';
import { ScriptRunnerController } from '../controllers/script-runner.controller';
import { BulkUpdateLoadTestController } from '../controllers/bulk-update-load-test.controller';
import { ScriptRunnerService } from '../services/script-runner.service';
import { AmiChartModule } from './ami-chart.module';
import { FeatureFlagModule } from './feature-flag.module';
import { EmailModule } from './email.module';
import { MultiselectQuestionModule } from './multiselect-question.module';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';
import { SnapshotCreateModule } from './snapshot-create.module';

@Module({
  imports: [
    AmiChartModule,
    EmailModule,
    FeatureFlagModule,
    MultiselectQuestionModule,
    PermissionModule,
    PrismaModule,
    SnapshotCreateModule,
  ],
  controllers: [ScriptRunnerController, BulkUpdateLoadTestController],
  providers: [ScriptRunnerService, Logger],
  exports: [ScriptRunnerService],
})
export class ScriptRunnerModule {}
