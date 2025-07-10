import { Module } from '@nestjs/common';
import { ScriptRunnerController } from '../controllers/script-runner.controller';
import { ScriptRunnerService } from '../services/script-runner.service';
import { AmiChartModule } from './ami-chart.module';
import { FeatureFlagModule } from './feature-flag.module';
import { MultiselectQuestionModule } from './multiselect-question.module';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';
import { AssetModule } from './asset.module';

@Module({
  imports: [
    AmiChartModule,
    FeatureFlagModule,
    MultiselectQuestionModule,
    PermissionModule,
    PrismaModule,
    AssetModule,
  ],
  controllers: [ScriptRunnerController],
  providers: [ScriptRunnerService],
  exports: [ScriptRunnerService],
})
export class ScriptRunnerModule {}
