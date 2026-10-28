import { Global, Module } from '@nestjs/common';
import { ApplicationExporterService } from '../services/application-exporter.service';
import { ListingModule } from './listing.module';
import { MultiselectQuestionModule } from './multiselect-question.module';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';
import { S3Module } from './s3.module';

@Global()
@Module({
  imports: [
    ApplicationExporterModule,
    PrismaModule,
    ListingModule,
    MultiselectQuestionModule,
    PermissionModule,
    S3Module,
  ],
  providers: [ApplicationExporterService],
  exports: [ApplicationExporterService],
})
export class ApplicationExporterModule {}
