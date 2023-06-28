import { Module } from '@nestjs/common';
import { UnitRentTypeController } from '../controllers/unit-rent-type.controller';
import { UnitRentTypeService } from '../services/unit-rent-type.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  imports: [],
  controllers: [UnitRentTypeController],
  providers: [UnitRentTypeService, PrismaService],
  exports: [UnitRentTypeService, PrismaService],
})
export class UnitRentTypeModule {}
