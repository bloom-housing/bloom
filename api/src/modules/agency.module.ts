import { Module } from '@nestjs/common';
import { AgencyController } from '../controllers/agency.controller';
import { AgencyService } from '../services/agency.service';
import { PermissionService } from '../services/permission.service';
import { PrismaModule } from './prisma.module';

@Module({
  controllers: [AgencyController],
  providers: [AgencyService, PermissionService, PrismaModule],
})
export class AgencyModule {}
