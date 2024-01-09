import { Module } from '@nestjs/common';
import { ApplicationController } from '../controllers/application.controller';
import { ApplicationService } from '../services/application.service';
import { GeocodingService } from '../services/geocoding.service';
import { PrismaModule } from './prisma.module';
import { PermissionModule } from './permission.module';
import { EmailModule } from './email.module';

@Module({
  imports: [EmailModule, PrismaModule, PermissionModule],
  controllers: [ApplicationController],
  providers: [ApplicationService, GeocodingService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
