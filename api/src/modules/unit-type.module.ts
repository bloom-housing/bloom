import { Module } from '@nestjs/common';
import { UnitTypeController } from '../controllers/unit-type.controller';
import { UnitTypeService } from '../services/unit-type.service';
import { PrismaModule } from './prisma.module';
import { PermissionModule } from './permission.module';

@Module({
  imports: [PrismaModule, PermissionModule],
  controllers: [UnitTypeController],
  providers: [UnitTypeService],
  exports: [UnitTypeService],
})
export class UnitTypeModule {}
