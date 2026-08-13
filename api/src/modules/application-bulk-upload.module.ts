import { Global, Module } from '@nestjs/common';
import { ApplicationBulkUploadService } from '../services/application-bulk-upload.service';
import { PrismaModule } from './prisma.module';
import { ListingModule } from './listing.module';
import { PermissionModule } from './permission.module';
import { S3Module } from './s3.module';
import { BackgroundJobsModule } from './background-jobs.module';

@Global()
@Module({
  imports: [
    PrismaModule,
    ListingModule,
    PermissionModule,
    S3Module,
    BackgroundJobsModule,
  ],
  providers: [ApplicationBulkUploadService],
  exports: [ApplicationBulkUploadService],
})
export class ApplicationBulkUploadModule {}
