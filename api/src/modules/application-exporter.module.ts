import { Global, Module } from '@nestjs/common';
import { ApplicationExporterService } from '../services/application-exporter.service';
import { ListingModule } from './listing.module';
import { MultiselectQuestionModule } from './multiselect-question.module';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';
import { S3Service } from '../services/s3.service';

@Global()
@Module({
  imports: [
    ApplicationExporterModule,
    PrismaModule,
    ListingModule,
    MultiselectQuestionModule,
    PermissionModule,
  ],
  providers: [ApplicationExporterService, S3Service],
  exports: [ApplicationExporterService],
})
export class ApplicationExporterModule {}
