import { Module } from '@nestjs/common';
import { PropertyController } from '../controllers/property.controller';
import { PropertyService } from '../services/property.service';
import { PermissionService } from '../services/permission.service';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';

@Module({
  controllers: [PropertyController],
  providers: [
    PropertyService,
    PermissionService,
    PermissionModule,
    PrismaModule,
  ],
})
export class PropertyModule {}
