import { Global, Module } from '@nestjs/common';
import { ApplicationBulkUploadService } from 'src/services/application-bulk-upload.service';
import { PrismaModule } from './prisma.module';
import { ListingModule } from './listing.module';
import { PermissionModule } from './permission.module';

@Global()
@Module({
  imports: [PrismaModule, ListingModule, PermissionModule],
  providers: [ApplicationBulkUploadService],
  exports: [ApplicationBulkUploadService],
})
export class ApplicationBulkUploadModule {}
