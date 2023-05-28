import { Module } from '@nestjs/common';
import { UnitAccessibilityPriorityTypeController } from '../controllers/unit-accessibility-priority-type.controller';
import { UnitAccessibilityPriorityTypeService } from '../services/unit-accessibility-priority-type.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  imports: [],
  controllers: [UnitAccessibilityPriorityTypeController],
  providers: [UnitAccessibilityPriorityTypeService, PrismaService],
  exports: [UnitAccessibilityPriorityTypeService, PrismaService],
})
export class UnitAccessibilityPriorityTypeServiceModule {}
