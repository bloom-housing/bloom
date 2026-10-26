import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScriptRunnerController } from '../controllers/script-runner.controller';
import { ScriptRunnerService } from '../services/script-runner.service';
import { AmiChartModule } from './ami-chart.module';
import { FeatureFlagModule } from './feature-flag.module';
import { EmailModule } from './email.module';
import { MultiselectQuestionModule } from './multiselect-question.module';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';
import { JurisdictionModule } from './jurisdiction.module';
import { S3Module } from './s3.module';

@Module({
  imports: [
    AmiChartModule,
    HttpModule,
    JurisdictionModule,
    S3Module,
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
