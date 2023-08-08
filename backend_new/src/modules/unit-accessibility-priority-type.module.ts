import { Module } from '@nestjs/common';
import { UnitAccessibilityPriorityTypeController } from '../controllers/unit-accessibility-priority-type.controller';
import { UnitAccessibilityPriorityTypeService } from '../services/unit-accessibility-priority-type.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UnitAccessibilityPriorityTypeController],
  providers: [UnitAccessibilityPriorityTypeService],
  exports: [UnitAccessibilityPriorityTypeService],
})
export class UnitAccessibilityPriorityTypeServiceModule {}
