import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { PermissionService } from '../services/permission.service';

@Module({
  imports: [PrismaModule],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
