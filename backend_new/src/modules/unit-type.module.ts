import { Module } from '@nestjs/common';
import { UnitTypeController } from '../controllers/unit-type.controller';
import { UnitTypeService } from '../services/unit-type.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  imports: [],
  controllers: [UnitTypeController],
  providers: [UnitTypeService, PrismaService],
  exports: [UnitTypeService, PrismaService],
})
export class UnitTypeModule {}
