import { Module } from '@nestjs/common';
import { AgencyController } from 'src/controllers/agency.controller';
import { AgencyService } from 'src/services/agency.service';
import { PermissionService } from 'src/services/permission.service';
import { PrismaModule } from './prisma.module';

@Module({
  controllers: [AgencyController],
  providers: [AgencyService, PermissionService, PrismaModule],
})
export class AgencyModule {}
