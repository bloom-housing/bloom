import { Module } from '@nestjs/common';
import { PropertyController } from '../controllers/property.controller';
import { PropertyService } from '../services/property.service';
import { PrismaModule } from './prisma.module';
import { PermissionModule } from './permission.module';

@Module({
  imports: [PermissionModule],
  controllers: [PropertyController],
  providers: [PropertyService, PrismaModule],
})
export class PropertyModule {}
