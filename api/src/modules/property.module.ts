import { Module } from '@nestjs/common';
import { PropertyController } from '../controllers/property.controller';
import { PropertyService } from '../services/property.service';
import { PermissionService } from '../services/permission.service';

@Module({
  controllers: [PropertyController],
  providers: [PropertyService, PermissionService],
})
export class PropertyModule {}
