import { Module } from '@nestjs/common';
import { UnitRentTypeController } from '../controllers/unit-rent-type.controller';
import { UnitRentTypeService } from '../services/unit-rent-type.service';
import { PrismaModule } from './prisma.module';
import { PermissionModule } from './permission.module';

@Module({
  imports: [PrismaModule, PermissionModule],
  controllers: [UnitRentTypeController],
  providers: [UnitRentTypeService],
  exports: [UnitRentTypeService],
})
export class UnitRentTypeModule {}
