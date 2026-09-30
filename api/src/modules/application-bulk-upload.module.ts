import { Global, Module } from '@nestjs/common';
import { ApplicationBulkUploadService } from '../services/application-bulk-upload.service';
import { PrismaModule } from './prisma.module';
import { ListingModule } from './listing.module';
import { PermissionModule } from './permission.module';
import { S3Module } from './s3.module';
import { BackgroundJobsModule } from './background-jobs.module';
import { SnapshotCreateModule } from './snapshot-create.module';
import { EmailModule } from './email.module';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    PrismaModule,
    ListingModule,
    PermissionModule,
    S3Module,
    BackgroundJobsModule,
    SnapshotCreateModule,
    EmailModule,
    ConfigModule,
  ],
  providers: [ApplicationBulkUploadService],
  exports: [ApplicationBulkUploadService],
})
export class ApplicationBulkUploadModule {}
