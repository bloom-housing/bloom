import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';
import { ExternalListingController } from '../controllers/external-listing.controller';
import { ExternalListingService } from '../services/external-listing.service';

@Module({
  imports: [HttpModule, PermissionModule, PrismaModule],
  controllers: [ExternalListingController],
  providers: [ExternalListingService, Logger],
  exports: [ExternalListingService],
})
export class ExternalListingModule {}
