import { Module } from '@nestjs/common';
import { UnitRentTypeController } from '../controllers/unit-rent-type.controller';
import { UnitRentTypeService } from '../services/unit-rent-type.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UnitRentTypeController],
  providers: [UnitRentTypeService],
  exports: [UnitRentTypeService],
})
export class UnitRentTypeModule {}
