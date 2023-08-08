import { Module } from '@nestjs/common';
import { UnitTypeController } from '../controllers/unit-type.controller';
import { UnitTypeService } from '../services/unit-type.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UnitTypeController],
  providers: [UnitTypeService],
  exports: [UnitTypeService],
})
export class UnitTypeModule {}
